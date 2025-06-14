// src/services/aiService.ts
import { getSession } from '../db/neo4j/client';
import { getNugenChatCompletion } from '../modules/nugen/client'; // Import the Nugen utility function
import { NUGEN_MODEL_LLM } from '../modules/nugen/config'; // Still need model name from config

export class AIService {

    /**
     * Generates a Cypher query from natural language using Nugen LLM.
     * @param naturalLanguageQuery The user's query in plain English.
     * @returns A promise that resolves to the generated Cypher query string.
     */
    private async generateCypher(naturalLanguageQuery: string): Promise<string> {
        const schemaContext = `
            You are a Cypher query generator for a Neo4j database.
            Nodes:
            - User {userId: string, username: string, email: string, balance: float}
            - Transaction {transactionId: string, amount: float, description: string, timestamp: datetime, status: string ('completed', 'pending', 'failed')}

            Relationships:
            - (User)-[:INITIATED_PAYMENT]->(Transaction): A user initiated a payment.
            - (Transaction)-[:FOR_RECIPIENT]->(User): A transaction was for a specific recipient.

            Rules for Cypher generation:
            1. Always use parameters ($paramName) for dynamic values like usernames, amounts, etc., if you can extract them from the query. If the query does not contain specific values, return general queries.
            2. For paths (e.g., "who paid whom over multiple steps"), use variable length relationships. A "payment step" is a (User)-[:INITIATED_PAYMENT]->(Transaction)-[:FOR_RECIPIENT]->(User) chain.
            3. Assume a maximum of 3 "payment steps" for path queries unless the user specifies otherwise.
            4. Return only the Cypher query string, no other text, explanations, or markdown.
            5. Ensure 'username' is preferred for user identification in MATCH clauses unless 'userId' is explicitly mentioned.
            6. When returning data, always return meaningful properties, not just the node itself. For paths, return the path object and length.

            Example queries and expected Cypher:
            - "Who paid Alice?" -> MATCH (s:User)-[:INITIATED_PAYMENT]->(:Transaction)-[:FOR_RECIPIENT]->(r:User {username: 'Alice'}) RETURN s.username
            - "Show transactions from Bob to Charlie" -> MATCH (s:User {username: 'Bob'})-[:INITIATED_PAYMENT]->(t:Transaction)-[:FOR_RECIPIENT]->(r:User {username: 'Charlie'}) RETURN t.amount, t.description, t.timestamp
            - "What is Alice's balance?" -> MATCH (u:User {username: 'Alice'}) RETURN u.balance
            - "Who did Bob pay?" -> MATCH (s:User {username: 'Bob'})-[:INITIATED_PAYMENT]->(:Transaction)-[:FOR_RECIPIENT]->(r:User) RETURN r.username, t.amount, t.description
            - "Show me payment paths from Alice to David up to 2 steps" -> MATCH p = (a:User {username: 'Alice'})-[:INITIATED_PAYMENT]->(:Transaction)-[:FOR_RECIPIENT]->(:User)*0..1-[:INITIATED_PAYMENT]->(:Transaction)-[:FOR_RECIPIENT]->(d:User {username: 'David'}) RETURN p, length(p)/2 AS steps
            - "List all users" -> MATCH (u:User) RETURN u.username, u.balance
            - "What were the last 5 transactions?" -> MATCH (s:User)-[:INITIATED_PAYMENT]->(t:Transaction)-[:FOR_RECIPIENT]->(r:User) RETURN s.username, r.username, t.amount, t.description ORDER BY t.timestamp DESC LIMIT 5

            Query: ${naturalLanguageQuery}
            Cypher:
        `;

        try {
            const cypher = await getNugenChatCompletion(
                [{ role: "user", content: schemaContext }],
                NUGEN_MODEL_LLM,
                0.1, // Low temperature for consistent query generation
                200  // Max tokens for Cypher
            );
            return cypher.replace(/```cypher|```/g, '').trim(); // Clean up markdown
        } catch (error) {
            console.error('Error generating Cypher via Nugen:', error);
            throw error;
        }
    }

    /**
     * Executes a Cypher query and formats the results for an LLM.
     * This function remains unchanged as it interacts with Neo4j directly.
     */
    private async executeCypherAndFormat(cypherQuery: string, params: Record<string, any> = {}): Promise<string> {
        const session = await getSession();
        try {
            const result = await session.readTransaction(tx =>
                tx.run(cypherQuery, params)
            );

            if (result.records.length === 0) {
                return "No data found for this query.";
            }

            let formattedResult = "Cypher Query Results:\n";
            result.records.forEach((record, index) => {
                formattedResult += `--- Record ${index + 1} ---\n`;
                record.keys.forEach(k => {
                    const key = String(k)
                    const value = record.get(key);
                    if (value && typeof value === 'object' && 'properties' in value && ('labels' in value || 'type' in value)) {
                        const type = value.labels ? value.labels.join(',') : value.type;
                        formattedResult += `${key}: (Type: ${type}, Properties: ${JSON.stringify(value.properties)})\n`;
                    } else if (value && typeof value === 'object' && 'low' in value && 'high' in value && value.constructor.name === 'Integer') {
                         formattedResult += `${key}: ${value.toNumber()}\n`;
                    } else if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && 'properties' in value[0]) {
                        formattedResult += `${key}: [\n`;
                        value.forEach((item: any) => {
                            if ('properties' in item) {
                                formattedResult += `    { Type: ${item.labels ? item.labels.join(',') : item.type}, Properties: ${JSON.stringify(item.properties)} }\n`;
                            } else {
                                formattedResult += `    ${JSON.stringify(item)}\n`;
                            }
                        });
                        formattedResult += `]\n`;
                    }
                    else {
                        formattedResult += `${key}: ${JSON.stringify(value)}\n`;
                    }
                });
                formattedResult += '\n';
            });
            return formattedResult;
        } catch (error: any) {
            console.error('Error executing Cypher query:', error.message);
            return `Error executing Cypher query: ${error.message}`;
        } finally {
            await session.close();
        }
    }

    /**
     * Main RAG function: takes a natural language query, gets data from Neo4j,
     * and uses Nugen LLM to generate a human-friendly response.
     * @param naturalLanguageQuery The user's query.
     * @returns A promise that resolves to the LLM's natural language response.
     */
    async queryGraphWithAI(naturalLanguageQuery: string): Promise<string> {
        try {
            // Step 1: Generate Cypher from natural language using Nugen utility
            const cypherQuery = await this.generateCypher(naturalLanguageQuery);
            console.log('Generated Cypher:', cypherQuery);

            // Step 2: Execute Cypher and get formatted results from Neo4j
            const formattedResults = await this.executeCypherAndFormat(cypherQuery);
            console.log('Formatted Cypher Results:\n', formattedResults);

            // Step 3: Augment prompt with context and get final answer using Nugen utility
            const finalPrompt = `
                Based on the following data retrieved from a graph database, answer the question: "${naturalLanguageQuery}"

                Graph Data:
                ${formattedResults}

                If the data indicates "No data found", state that clearly.
                Be concise and directly answer the question based *only* on the provided data.
                If the query resulted in an error, explain the error.
            `;

            const finalResponse = await getNugenChatCompletion(
                [{ role: "user", content: finalPrompt }],
                NUGEN_MODEL_LLM,
                0.1, // Low temperature for factual responses
                300  // Max tokens for final answer
            );

            return finalResponse;

        } catch (error: any) {
            console.error('AI Service Error:', error.message);
            return `I'm sorry, I encountered an error: ${error.message}`;
        }
    }
}