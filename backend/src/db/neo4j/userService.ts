// src/services/userService.ts
import { getSession } from './client';
import { User } from '../models/user';
import { v4 as uuidv4 } from 'uuid';

export class UserService {
    async createUser(username: string, email: string): Promise<User | null> {
        const session = await getSession();
        const userId = uuidv4();
        const query = `
            CREATE (u:User {
                userId: $userId,
                username: $username,
                email: $email,
                balance: 0.0
            })
            RETURN u {.*} AS user
        `;
        try {
            const result = await session.writeTransaction(tx =>
                tx.run(query, { userId, username, email })
            );
            if (result.records.length > 0) {
                return result.records[0].get('user');
            }
            return null;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        } finally {
            await session.close();
        }
    }

    async findUserById(userId: string): Promise<User | null> {
        const session = await getSession();
        const query = `
            MATCH (u:User {userId: $userId})
            RETURN u {.*} AS user
        `;
        try {
            const result = await session.readTransaction(tx =>
                tx.run(query, { userId })
            );
            if (result.records.length > 0) {
                return result.records[0].get('user');
            }
            return null;
        } catch (error) {
            console.error(`Error finding user by ID ${userId}:`, error);
            throw error;
        } finally {
            await session.close();
        }
    }

    async findUserByUsername(username: string): Promise<User | null> {
        const session = await getSession();
        const query = `
            MATCH (u:User {username: $username})
            RETURN u {.*} AS user
        `;
        try {
            const result = await session.readTransaction(tx =>
                tx.run(query, { username })
            );
            if (result.records.length > 0) {
                return result.records[0].get('user');
            }
            return null;
        } catch (error) {
            console.error(`Error finding user by username ${username}:`, error);
            throw error;
        } finally {
            await session.close();
        }
    }

    async getAllUsers(): Promise<User[]> {
        const session = await getSession();
        const query = `
            MATCH (u:User)
            RETURN u {.*} AS user
            ORDER BY u.username
        `;
        try {
            const result = await session.readTransaction(tx =>
                tx.run(query)
            );
            return result.records.map(record => record.get('user'));
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        } finally {
            await session.close();
        }
    }

    async updateBalance(userId: string, amount: number): Promise<User | null> {
        const session = await getSession();
        const query = `
            MATCH (u:User {userId: $userId})
            SET u.balance = u.balance + $amount
            RETURN u {.*} AS user
        `;
        try {
            const result = await session.writeTransaction(tx =>
                tx.run(query, { userId, amount })
            );
            if (result.records.length > 0) {
                return result.records[0].get('user');
            }
            return null;
        } catch (error) {
            console.error(`Error updating balance for user ${userId}:`, error);
            throw error;
        } finally {
            await session.close();
        }
    }
}