// src/neo4j.ts
import neo4j, { Driver, Session, AuthToken } from 'neo4j-driver';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const username = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASS || 'password'; // Use a default if not set, but production should always have this set.

let driver: Driver;

/**
 * Initializes and returns the Neo4j driver instance.
 * Ensures only one driver instance is created.
 */
export const getDriver = async (): Promise<Driver> => {
    if (!driver) {
        driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
        console.log('Neo4j Driver initialized.');

        try {
            const serverInfo = await driver.getServerInfo()
            console.log('Neo4j Server Info:', serverInfo)
            console.log('Neo4j connection verified successfully!')
        } catch (error) {
            console.error('Neo4j connection failed:', error);
            throw error; // Re-throw to indicate a critical setup error
        }
    }
    return driver;
};

/**
 * Creates and returns a new Neo4j session.
 */
export const getSession = async (): Promise<Session> => {
    const driver = await getDriver()
    return driver.session()
};

/**
 * Closes the Neo4j driver connection.
 * Call this when your application shuts down.
 */
export const closeDriver = async () => {
    if (driver) {
        await driver.close();
        console.log('Neo4j Driver closed.');
    }
};

/**
 * Utility function to run a Cypher query and close the session.
 * @param query The Cypher query string.
 * @param params Parameters for the query.
 * @returns A promise that resolves to the query result.
 */
export const runQuery = async (query: string, params: Record<string, any> = {}) => {
    const session = await getSession();
    try {
        const result = await session.run(query, params);
        return result;
    } finally {
        await session.close();
    }
};

// Graceful shutdown (optional, but good practice)
process.on('SIGINT', async () => {
    console.log('SIGINT received. Closing Neo4j driver...');
    await closeDriver();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Closing Neo4j driver...');
    await closeDriver();
    process.exit(0);
});