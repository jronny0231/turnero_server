import express from 'express';
import { authenticateToken, refreshToken} from '../controllers/auth.controller';
import { UpdatePassword, Login, Logout } from '../controllers/user.controller';

const router = express.Router()

router.post('/login', Login);

router.get('/refreshToken', authenticateToken, refreshToken);

router.delete('/logout', authenticateToken, Logout);

router.get('/user', authenticateToken, (_req, res) => {
    const payload = res.locals.payload;
    res.status(200).json({data: payload});
});

router.put('/passwordReset/:id', UpdatePassword);
router.put('/passwordReset', authenticateToken, UpdatePassword);

export default router;