import express from 'express';
import * as Auth from '../providers/auth.provider';
import { urlToken } from '../middlewares/activeToken.middlewares';
import { validateWith } from "../middlewares/validation.middlewares"
import { passwordChange, updateUser, userCredential } from '../schemas/user.schema';
import { middlewares } from '../utils/tools';

const router = express.Router()


router.post('/login/', validateWith(userCredential), Auth.Login);

router.get('/refreshToken/', middlewares(), Auth.RefreshToken);

router.delete('/logout/', middlewares(), Auth.Logout);

router.get('/permissions', middlewares(), Auth.GetPermissions);

router.get('/profile/', middlewares('auth_profile'), Auth.GetAccount);

router.put('/profile/', middlewares('auth_profile'), validateWith(updateUser), Auth.UpdateAccount)

router.put('/update-password/', middlewares(), urlToken, validateWith(passwordChange), Auth.UpdatePassword)

// router.get('/reset-password', Auth.ConfirmPasswordForm)

router.put('/reset-password/:id', middlewares(), Auth.ResetPassword);

export default router;