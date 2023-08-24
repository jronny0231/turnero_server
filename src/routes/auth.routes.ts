import express from 'express';
import * as Auth from '../providers/auth.provider';
import { authToken, urlToken } from '../middlewares/activeToken.middlewares';
import { validateActiveUser } from '../middlewares/activeUser.middlewares';
import { middlewaresType } from '../@types/global';
import validateWith from "../middlewares/validation.middlewares"
import { passwordChange, updateUser, userCredential } from '../schemas/user.schema';

const router = express.Router()

const middlewares: middlewaresType = [authToken, validateActiveUser];


router.post('/login/', validateWith(userCredential), Auth.Login);

router.get('/refreshToken/', middlewares, Auth.RefreshToken);

router.delete('/logout/', middlewares, Auth.Logout);

router.get('/profile/', middlewares, Auth.GetAccount);

router.put('/profile/', middlewares, validateWith(updateUser), Auth.UpdateAccount)

router.put('/update-password/', middlewares, urlToken, validateWith(passwordChange), Auth.UpdatePassword)

// router.get('/reset-password', Auth.ConfirmPasswordForm)

router.put('/reset-password/:id', middlewares, Auth.ResetPassword);

export default router;