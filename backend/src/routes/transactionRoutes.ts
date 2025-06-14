// src/routes/transactionRoutes.ts
import { Router } from 'express';
import * as transactionController from '../controllers/transactionController';
import { validate, schemas } from '../middlewares/validationMiddleware';

const router = Router();

router.post('/payment', validate(schemas.paymentSchema), transactionController.sendPayment);
router.post('/trustline', validate(schemas.trustlineSchema), transactionController.createTrustline);
router.post('/offer-create', validate(schemas.offerCreateSchema), transactionController.createOffer);
router.post('/nft-mint', validate(schemas.nftMintSchema), transactionController.mintNFT);

export default router;
