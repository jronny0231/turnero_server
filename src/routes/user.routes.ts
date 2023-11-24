import express from 'express';
import { DeleteUser, GetAllUsers, GetUserById, StoreNewUser, UpdateUser } from '../controllers/user.controller';
import { middlewares } from '../utils/tools';
import { validateWith } from '../middlewares/validation.middlewares';
import { createUser, updateUser } from '../schemas/user.schema';

const router = express.Router()


router.get('/', middlewares('users'), GetAllUsers);

router.get('/:id', middlewares('users'), GetUserById);

router.post('/', middlewares('users'), validateWith(createUser), StoreNewUser);

router.put('/:id', middlewares('users'), validateWith(updateUser), UpdateUser);

router.delete('/:id', middlewares('users'), DeleteUser);


export default router;