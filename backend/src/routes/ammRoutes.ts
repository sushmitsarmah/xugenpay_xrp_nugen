import { Router } from 'express';
import * as ammController from '../controllers/ammController';
import { validate, schemas } from '../middlewares/validationMiddleware';

const router = Router();

router.post('/create', validate(schemas.ammCreateSchema), ammController.createAMM);
router.post('/deposit', validate(schemas.ammDepositWithdrawSchema), ammController.depositAMM);
router.post('/withdraw', validate(schemas.ammDepositWithdrawSchema), ammController.withdrawAMM);
router.post('/vote', validate(schemas.ammVoteSchema), ammController.voteAMM);
router.post('/bid', validate(schemas.ammBidSchema), ammController.bidAMM);
// Note: Asset parameters can be tricky for GET, this assumes simple XRP/IOU.
// For IOU, the issuer would be part of the path, e.g., /api/amm/info/USD/r.../XRP
// router.get('/info/:asset1_currency/:asset1_issuer/:asset2_currency/:asset2_issuer?', ammController.getAMMDetails);
router.get('/info/:asset1_currency/:asset2_currency', ammController.getAMMDetails); // For XRP/XRP or XRP/IOU where issuer is default

export default router;
