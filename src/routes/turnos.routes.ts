import express from 'express';
import { getAll, getById } from '../controllers/turnos.controller';
import { authenticateToken } from '../controllers/auth.controller';

const router = express.Router()

router.use((_req, _res, next) => {
    next()
})

router.get('/', authenticateToken, getAll)
router.get('/:id', getById)

router.post('/', (_req, res) => {
    res.send('Saving a new turno');
});

export default router;