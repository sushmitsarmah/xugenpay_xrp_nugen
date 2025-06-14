import express from 'express';
import {
  createOrUpdateUserHandler,
  getUserByUsernameHandler,
  getAllUsers,
  searchByUsername,
  getUserByAddressHandler
} from '../controllers/userController';

const router = express.Router();

// POST /api/users — create or update user
router.post('/create', createOrUpdateUserHandler);

router.get('/search', searchByUsername);

// GET /api/users/:username — get user by username
router.get('/:username', getUserByUsernameHandler);
router.get('/wallet/:address', getUserByAddressHandler);


router.get('/', getAllUsers);

export default router;
