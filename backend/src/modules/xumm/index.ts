import { Xumm } from "xumm";
import type { XummPostPayloadBodyJson } from "xumm-sdk/dist/src/types";

const API_KEY = process.env.XUMM_API_KEY;
const SECRET_KEY = process.env.XUMM_API_SECRET;

if (!API_KEY || !SECRET_KEY) {
    throw new Error("XUMM API keys are not set in environment variables.");
}

const xumm = new Xumm(API_KEY, SECRET_KEY);

export const healthCheck = async () => {
    try {
        const pong = await xumm.ping();
        console.log('XUMM SDK connected');
    } catch (error) {
        console.error("XUMM Health Check Error:", error);
        throw error;
    }
};

export const signinXumm = async () => {
    console.log('Initiating XUMM Sign-in...');
    const payload = await xumm?.payload?.create({
        txjson: {
            TransactionType: 'SignIn',
        }
    }, true); // The `true` here makes it a "SignIn" payload

    if (payload) {
        console.log('Sign-in Payload created:', payload.uuid);

        return {
            uuid: payload.uuid,
            qr: payload.refs.qr_png, // QR code image URL
            qr_matrix: payload.refs.qr_matrix, // Base64 QR code matrix
            refs: payload.refs, // Deep link to open in XUMM
            pushed: payload.pushed // True if push notification was sent
        };
    }
};

// 3. Get Sign-in Status & Generate User Token
// Frontend will poll this endpoint with the payload UUID
export const getSignInStatus = async (payloadUuid: string, res: any) => {
    try {
        const payload = await xumm.payload?.get(payloadUuid);

        if (!payload) {
            return res.status(404).json({ error: 'Payload not found or expired.' });
        }

        // Check if the payload is resolved (signed or rejected)
        if (payload.meta.resolved) {
            if (payload.meta.signed) {
                // User successfully signed in!
                const userAccount = payload.response.account;
                console.log(`User ${userAccount} signed in successfully!`);

                // --- Generate your backend's user token (e.g., JWT) ---
                // const userToken = generateUserToken(userAccount);

                // In a real application, you would:
                // 1. Look up or create a user in your database using `userAccount`.
                // 2. Store `userAccount` in their session or associate it with the JWT.
                // 3. Return the JWT to the frontend for future authenticated requests.

                // activePayloads.delete(payloadUuid); // Clean up
                return res.json({
                    status: 'signed',
                    r_account: userAccount,
                    // userToken: userToken, // Your generated token
                    message: 'Sign-in successful!'
                });
            } else {
                // User rejected or did not sign
                // activePayloads.delete(payloadUuid); // Clean up
                return res.json({
                    status: 'rejected',
                    reason:  'User rejected sign-in.',
                    message: 'Sign-in rejected or cancelled.'
                });
            }
        } else {
            // Payload is still pending
            return res.json({
                status: 'pending',
                message: 'Awaiting user action in XUMM app.'
            });
        }
    } catch (error) {
        console.error(`Error getting sign-in status for ${payloadUuid}:`, error);
        res.status(500).json({ error: 'Internal server error while checking sign-in status.' });
    }
};

export const initiatePayment = async (
    res: any,
    account: string,
    destination: string,
    amount: any,
    issuer?: string
) => {
    try {
        console.log(`Initiating XUMM Payment to ${destination} for ${amount} ...`);

        const amountDrops =  1000000 * parseFloat(amount); // Convert amount to drops if XRP

        const paymentPayload: XummPostPayloadBodyJson = {
            txjson: {
                TransactionType: 'Payment',
                Account: account, // Your backend's XRP address
                Destination: destination,
                Amount: String(amountDrops), // Convert XRP to drops if XRP, otherwise keep as string (for issued currencies)
            }
        };

        const payload = await xumm.payload?.create(paymentPayload, true);

        console.log(payload)

        if (payload) {
            console.log('Payment Payload created:', payload.uuid);
            // activePayloads.set(payload.uuid, payload); // Store for status checks

            res.json({
                uuid: payload.uuid,
                qr: payload.refs.qr_png,
                qr_matrix: payload.refs.qr_matrix,
                refs: payload.refs,
                pushed: payload.pushed
            });
        } else {
            res.status(500).json({ error: 'Failed to create XUMM payment payload.' });
        }
    } catch (error) {
        console.error('Error initiating payment:', error);
        res.status(500).json({ error: 'Internal server error during payment initiation.' });
    }
};

export const getPaymentStatus = async (payloadUuid: string, res: any) => {
    try {
        const payload = await xumm.payload?.get(payloadUuid);

        if (!payload) {
            return res.status(404).json({ error: 'Payload not found or expired.' });
        }

        if (payload.meta.resolved) {
            if (payload.meta.signed) {
                // Payment signed and submitted
                console.log(`Payment payload ${payloadUuid} signed.`);
                // activePayloads.delete(payloadUuid); // Clean up
                return res.json({
                    status: 'signed',
                    txid: payload.response.txid, // The transaction ID on the XRP Ledger
                    message: 'Payment successfully signed and submitted!'
                });
            } else {
                // Payment rejected or not signed
                // activePayloads.delete(payloadUuid); // Clean up
                return res.json({
                    status: 'rejected',
                    // reason: payload.response.reason,
                    message: 'Payment rejected or cancelled.'
                });
            }
        } else {
            // Payment is still pending
            return res.json({
                status: 'pending',
                message: 'Awaiting user action for payment in XUMM app.'
            });
        }
    } catch (error) {
        console.error(`Error getting payment status for ${payloadUuid}:`, error);
        res.status(500).json({ error: 'Internal server error while checking payment status.' });
    }
};