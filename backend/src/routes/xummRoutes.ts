import { Router } from 'express';

import { getPaymentStatus, getSignInStatus, initiatePayment, signinXumm } from "../modules/xumm";

const router = Router();

router.post('/signin/init', async (req, res) => {
    try {
        const result = await signinXumm();
        res.json(result);
    } catch (err: any) {
        console.error('Error initiating sign-in:', err);
        res.status(500).json({ error: err.message });
    }
});


router.get('/signin/status/:payloadUuid', async (req, res) => {
    const { payloadUuid } = req.params;
    getSignInStatus(payloadUuid, res)
});

// 4. Initiate Payment Route
// Frontend sends destination and amount
router.post('/payment/init', async (req, res) => {
    const { destination, amount, account, issuer } = req.body; // currency and issuer optional for XRP

    // Basic input validation
    if (!destination || !amount) {
        res.status(400).json({ error: 'Destination and amount are required.' });
    }
    // Add more robust validation for XRP address format, amount, currency, etc.

    initiatePayment(
        res,
        account,
        destination,
        amount, // Ensure amount is a string
    )
});

// 5. Get Payment Status
// Frontend will poll this endpoint with the payload UUID
router.get('/payment/status/:payloadUuid', async (req, res) => {
    const { payloadUuid } = req.params;
    getPaymentStatus(payloadUuid, res);
});

export default router;