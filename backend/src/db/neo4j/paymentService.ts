// src/services/paymentService.ts
import { getSession } from './client';
import { Transaction } from '../models/transaction';
import { User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
    /**
     * Creates a payment, updates balances, and creates graph relationships.
     * Uses a single transaction for atomicity.
     */
    async createPayment(senderId: string, recipientId: string, amount: number, description: string): Promise<Transaction | null> {
        if (amount <= 0) {
            throw new Error('Payment amount must be positive.');
        }
        if (senderId === recipientId) {
            throw new Error('Cannot send money to yourself.');
        }

        const session = await getSession();
        const transactionId = uuidv4();
        const timestamp = new Date().toISOString();

        try {
            const result = await session.writeTransaction(async tx => {
                // 1. Get sender and recipient to check balances
                const senderResult = await tx.run(
                    `MATCH (s:User {userId: $senderId}) RETURN s.balance AS balance`,
                    { senderId }
                );
                const senderBalance = senderResult.records[0]?.get('balance');

                if (senderBalance === undefined) {
                    throw new Error('Sender not found.');
                }
                if (senderBalance < amount) {
                    throw new Error('Insufficient funds.');
                }

                // 2. Create Transaction node and relationships, and update balances
                const query = `
                    MATCH (sender:User {userId: $senderId})
                    MATCH (recipient:User {userId: $recipientId})
                    CREATE (sender)-[:INITIATED_PAYMENT]->(tx:Transaction {
                        transactionId: $transactionId,
                        amount: $amount,
                        description: $description,
                        timestamp: $timestamp,
                        status: 'completed'
                    })-[:FOR_RECIPIENT]->(recipient)
                    SET sender.balance = sender.balance - $amount,
                        recipient.balance = recipient.balance + $amount
                    RETURN tx {.*} AS transaction
                `;
                const paymentResult = await tx.run(query, {
                    senderId,
                    recipientId,
                    amount,
                    description,
                    transactionId,
                    timestamp,
                });

                if (paymentResult.records.length === 0) {
                    throw new Error('Payment failed: could not create transaction or update balances.');
                }
                return paymentResult.records[0].get('transaction');
            });
            return result;
        } catch (error: any) {
            console.error('Error creating payment:', error.message);
            throw error; // Re-throw for API layer to handle
        } finally {
            await session.close();
        }
    }

    /**
     * Finds payments initiated by a specific user.
     */
    async getPaymentsBySender(senderId: string): Promise<any[]> {
        const session = await getSession();
        const query = `
            MATCH (s:User {userId: $senderId})-[:INITIATED_PAYMENT]->(t:Transaction)-[:FOR_RECIPIENT]->(r:User)
            RETURN s.username AS senderUsername,
                   r.username AS recipientUsername,
                   t.amount AS amount,
                   t.description AS description,
                   t.timestamp AS timestamp,
                   t.status AS status,
                   t.transactionId AS transactionId
            ORDER BY t.timestamp DESC
        `;
        try {
            const result = await session.readTransaction(tx =>
                tx.run(query, { senderId })
            );
            return result.records.map(record => record.toObject());
        } catch (error) {
            console.error(`Error fetching payments by sender ${senderId}:`, error);
            throw error;
        } finally {
            await session.close();
        }
    }

    /**
     * Finds payments received by a specific user.
     */
    async getPaymentsByRecipient(recipientId: string): Promise<any[]> {
        const session = await getSession();
        const query = `
            MATCH (s:User)-[:INITIATED_PAYMENT]->(t:Transaction)-[:FOR_RECIPIENT]->(r:User {userId: $recipientId})
            RETURN s.username AS senderUsername,
                   r.username AS recipientUsername,
                   t.amount AS amount,
                   t.description AS description,
                   t.timestamp AS timestamp,
                   t.status AS status,
                   t.transactionId AS transactionId
            ORDER BY t.timestamp DESC
        `;
        try {
            const result = await session.readTransaction(tx =>
                tx.run(query, { recipientId })
            );
            return result.records.map(record => record.toObject());
        } catch (error) {
            console.error(`Error fetching payments by recipient ${recipientId}:`, error);
            throw error;
        } finally {
            await session.close();
        }
    }

    /**
     * Finds a payment path between two users.
     * @param startUsername The username of the starting user.
     * @param endUsername The username of the ending user.
     * @param maxSteps The maximum number of payment steps (transactions).
     * @returns An array of objects describing the paths.
     */
    async findPaymentPath(startUsername: string, endUsername: string, maxSteps: number = 5): Promise<any[]> {
        const session = await getSession();
        // Path finds from A -> Transaction -> B -> Transaction -> C, etc.
        // maxSteps corresponds to the number of transaction nodes in the path.
        const query = `
            MATCH p = (startUser:User {username: $startUsername})
                      -[:INITIATED_PAYMENT]->(:Transaction)-[:FOR_RECIPIENT]->(intermediateUser:User)
                      *0..${maxSteps-1}
                      -[:INITIATED_PAYMENT]->(:Transaction)-[:FOR_RECIPIENT]->(endUser:User {username: $endUsername})
            RETURN nodes(p) AS pathNodes, relationships(p) AS pathRelationships, length(p)/2 AS numSteps
            ORDER BY numSteps ASC
            LIMIT 10
        `;
        // Explanation of path query:
        // *0..${maxSteps-1} means 0 to maxSteps-1 repetitions of the (User)-[:INITIATED_PAYMENT]->(:Transaction)-[:FOR_RECIPIENT]->(User) pattern.
        // So, 0 repetitions = direct path (1 step in our logical model)
        // 1 repetition = A->TX1->B->TX2->C (2 steps)
        // length(p)/2 gives the number of logical "payment steps" (each payment is 2 relationships in the graph model)

        try {
            const result = await session.readTransaction(tx =>
                tx.run(query, { startUsername, endUsername })
            );

            return result.records.map(record => {
                const pathNodes = record.get('pathNodes');
                const pathRelationships = record.get('pathRelationships');
                const numSteps = record.get('numSteps');

                const detailedPath = [];
                for (let i = 0; i < pathNodes.length; i++) {
                    const node = pathNodes[i];
                    if (node.labels.includes('User')) {
                        detailedPath.push({ type: 'User', username: node.properties.username });
                    } else if (node.labels.includes('Transaction')) {
                        detailedPath.push({
                            type: 'Transaction',
                            amount: node.properties.amount,
                            description: node.properties.description,
                            timestamp: node.properties.timestamp,
                            id: node.properties.transactionId
                        });
                    }
                    if (i < pathRelationships.length) {
                        const rel = pathRelationships[i];
                        // If you need relationship details you can add them, but for path visualization, types are enough
                        detailedPath.push({ type: rel.type });
                    }
                }

                return {
                    numSteps: numSteps.toNumber(), // Convert Neo4j Integer to JS number
                    path: detailedPath,
                    // rawPath: record.toObject() // For debugging
                };
            });
        } catch (error) {
            console.error(`Error finding payment path from ${startUsername} to ${endUsername}:`, error);
            throw error;
        } finally {
            await session.close();
        }
    }
}