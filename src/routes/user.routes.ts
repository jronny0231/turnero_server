import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import { DeleteUser, GetAllUsers, GetUserById, StoreNewUser, UpdateUser } from '../controllers/user.controller';
import { validateActiveUser } from '../middlewares/activeUser.middlewares';
import { middlewaresType } from '../@types/global';

const router = express.Router()

const middlewares: middlewaresType = [authToken, validateActiveUser];


router.get('/', middlewares, GetAllUsers);
router.get('/:id', middlewares, GetUserById);
router.post('/', middlewares, StoreNewUser);
router.put('/:id', middlewares, UpdateUser);
router.delete('/:id', middlewares, DeleteUser);


export default router;