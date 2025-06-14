import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import config from './config';
import * as xrplService from './services/xrplService';
import accountRoutes from './routes/accountRoutes';
import transactionRoutes from './routes/transactionRoutes';
import ammRoutes from './routes/ammRoutes';
import xummRoutes from './routes/xummRoutes'; // Import XUMM routes if needed
import userRoutes from './routes/userRoutes'; // Import user routes if needed
import { error as errorHandler } from './utils/responseHandler'; // Renamed to avoid conflict with `error` variable

import { checkSupabaseConnection } from './db/client';
import { getSession } from './db/neo4j/client';

checkSupabaseConnection()

const session = getSession()

const app: Application = express();
const networkType = process.env.XRPL_NETWORK_TYPE || 'testnet';

console.log(`Starting XRPL backend on ${networkType}...`);

// Middlewares
app.use(cors()); // Enable CORS for all origins (adjust in production)
app.use(express.json()); // Parse JSON request bodies

// Connect to XRPL on startup
xrplService.connectClient(networkType)
    .catch((err: any) => {
        console.error('Initial XRPL client connection failed:', err);
        process.exit(1); // Exit if cannot connect to XRPL
    });

// Ensure XRPL client is connected before processing routes
app.use((req: Request, res: Response, next: NextFunction) => {
    try {
        xrplService.getClient(); // This will throw an error if not connected
        next();
    } catch (err: any) {
        errorHandler(res, 'XRPL client not connected. Please try again later.', 503); // Service Unavailable
    }
});


// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('XRPL Backend is running!');
});
app.use('/api/account', accountRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/amm', ammRoutes);
app.use('/api/xumm', xummRoutes);
app.use('/api/users', userRoutes);


// Global error handler (catch-all for unhandled errors)
// Note: next is required even if not used, for Express error handler signature
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack); // Log the stack trace for debugging
    errorHandler(res, 'Something went wrong!', 500); // Send a generic error response
});

// Start the server
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    const serverUrl = networkType === 'testnet' ? config.xrpl.testnetServerUrl
        : networkType === 'devnet' ?config.xrpl.devnetServerUrl
        : 'wss://xrplcluster.com';
    console.log(`XRPL server URL: ${serverUrl}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down server...');
    await xrplService.disconnectClient();
    process.exit(0);
});
