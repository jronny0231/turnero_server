import express, {Request, Response} from 'express';
import * as User from '../controllers/user.controller';
import { authToken } from '../middlewares/activeToken.middlewares';
import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';
import { refreshToken } from '../services/jwt.helper';
import { middlewaresType } from '../@types/global';

const router = express.Router()

const middlewares: middlewaresType = [authToken, verifyActiveUserToken];


router.post('/login', User.Login);

router.get('/refreshToken', middlewares, refreshToken);

router.delete('/logout', middlewares, User.Logout);

router.get('/profile', middlewares, (_req: Request, res: Response) => {
    const id = res.locals.payload.id;
    User.GetUserByTokenId(id, res);
});

router.get('/agent', middlewares, (_req: Request, res: Response) => {
    const id = res.locals.payload.id;
    User.GetAgentByTokenId(id, res);
});

router.put('/passwordReset/:id', User.UpdatePassword);
router.put('/passwordReset', middlewares, User.UpdatePassword);

export default router;