import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import { DeleteUser, GetAllUsers, GetUserById, StoreNewUser, UpdateUser } from '../controllers/user.controller';
import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';

const router = express.Router()

router.get('/', authToken, verifyActiveUserToken, GetAllUsers);
router.get('/:id', authToken, verifyActiveUserToken, GetUserById);
router.post('/', authToken, verifyActiveUserToken, StoreNewUser);
router.put('/:id', authToken, verifyActiveUserToken, UpdateUser);
router.delete('/:id', authToken, verifyActiveUserToken, DeleteUser);


export default router;