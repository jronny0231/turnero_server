import express from 'express';
import * as User from '../controllers/user.controller';
import { authToken } from '../middlewares/activeToken.middlewares';
import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';
import { refreshToken } from '../services/jwt.helper';

const router = express.Router()

router.post('/login', User.Login);

router.get('/refreshToken', authToken, verifyActiveUserToken, refreshToken);

router.delete('/logout', authToken, verifyActiveUserToken, User.Logout);

router.get('/profile', authToken, verifyActiveUserToken, (_req, res) => {
    const id = res.locals.payload.id;
    User.GetUserByTokenId(id, res);
});

router.get('/agent', authToken, verifyActiveUserToken, (_req, res) => {
    const id = res.locals.payload.id;
    User.GetAgentByTokenId(id, res);
});

router.put('/passwordReset/:id', User.UpdatePassword);
router.put('/passwordReset', authToken, verifyActiveUserToken, User.UpdatePassword);

export default router;