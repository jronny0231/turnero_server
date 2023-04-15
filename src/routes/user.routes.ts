import express from 'express';
import {authenticateToken} from '../controllers/auth.controller';
import { DeleteUser, GetAllUsers, GetUserById, StoreNewUser, UpdateUser } from '../controllers/user.controller';

const router = express.Router()

router.get('/', authenticateToken, GetAllUsers);
router.get('/:id', authenticateToken, GetUserById);
router.post('/', authenticateToken, StoreNewUser);
router.put('/:id', authenticateToken, UpdateUser);
router.delete('/:id', authenticateToken, DeleteUser);


export default router;