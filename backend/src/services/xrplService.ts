// src/services/xrplService.ts
// Removed: import { SignedTx } } from 'xrpl';
import { Client, Wallet, Transaction, SubmitResponse } from 'xrpl';
import config from '../config';

// Define the type for a signed transaction by inferring it from Wallet.sign()
type SignedTransaction = ReturnType<typeof Wallet.prototype.sign>;

let client: Client | undefined;

const connectClient = async (networkType='testnet'): Promise<Client> => {
    if (!client || !client.isConnected()) {
        const serverUrl = networkType === 'testnet' ? config.xrpl.testnetServerUrl
            : networkType === 'devnet' ? config.xrpl.devnetServerUrl
            : 'wss://xrplcluster.com';

        try {
            client = new Client(serverUrl);
            await client.connect();
            console.log(`Connected to XRPL server: ${serverUrl}`);
        } catch (error) {
            console.error('Failed to connect to XRPL server:', error);
            throw new Error('XRPL connection failed');
        }
    }
    return client;
};

const disconnectClient = async (): Promise<void> => {
    if (client && client.isConnected()) {
        await client.disconnect();
        console.log('Disconnected from XRPL server.');
    }
};

const getClient = (): Client => {
    if (!client || !client.isConnected()) {
        throw new Error('XRPL client not connected. Call connectClient() first.');
    }
    return client;
    // Alternative: If you're sure it's connected, you can use a non-null assertion:
    // return client!;
};

const submitTransaction = async (signedTxBlob: string): Promise<SubmitResponse> => {
    try {
        const connectedClient = getClient();
        const result = await connectedClient.submit(signedTxBlob);
        return result;
    } catch (error) {
        console.error('Error submitting transaction:', error);
        throw error;
    }
};

const signAndSubmit = async (tx: Transaction, seed: string): Promise<SubmitResponse> => {
    try {
        const connectedClient = getClient();
        const wallet = Wallet.fromSeed(seed);
        // Use the inferred type here
        const signedTx: SignedTransaction = wallet.sign(tx);
        const result = await connectedClient.submit(signedTx.tx_blob);

        if (result.result.engine_result !== 'tesSUCCESS') {
            const errorMessage = `Transaction failed: ${result.result.engine_result} - ${result.result.engine_result_message}`;
            console.error(errorMessage, result.result);
            throw new Error(errorMessage);
        }
        return result;
    } catch (error) {
        console.error('Error in signAndSubmit:', error);
        throw error;
    }
};

export {
    connectClient,
    disconnectClient,
    getClient,
    submitTransaction,
    signAndSubmit,
    SignedTransaction // Export it if other services need to use it directly
};