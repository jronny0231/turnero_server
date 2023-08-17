import express, {Request, Response} from 'express';
import * as Auth from '../providers/auth.provider';
import * as User from '../controllers/user.controller'
import { authToken } from '../middlewares/activeToken.middlewares';
import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';
import { refreshToken } from '../services/jwt.helper';
import { middlewaresType } from '../@types/global';
import validateWith from "../middlewares/validation.middlewares"
import { passwordChange, updateUser, userCredential } from '../schemas/user.schema';

const router = express.Router()

const middlewares: middlewaresType = [authToken, verifyActiveUserToken];


router.post('/login', validateWith(userCredential), Auth.Login);

router.get('/refreshToken', middlewares, refreshToken);

router.delete('/logout', middlewares, Auth.Logout);

router.get('/profile', middlewares, Auth.GetAccount);

router.put('/profile', middlewares, validateWith(updateUser), Auth.UpdateAccount)

router.put('/update-password/', middlewares, validateWith(passwordChange), Auth.UpdatePassword)

router.put('/reset-password/:id', middlewares, Auth.ResetPassword);

export default router;