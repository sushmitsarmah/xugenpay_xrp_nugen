import { Router } from 'express';
import * as accountController from '../controllers/accountController';
import { validate, schemas } from '../middlewares/validationMiddleware';

const router = Router();

router.post('/create', accountController.createWallet);
router.get('/info/:address', accountController.getAccountDetails);
router.post('/fund', validate(schemas.fundAccountSchema), accountController.fundAccount);

export default router;
