import express from 'express';
import App from '../servers/express.server';
import * as controller from '../controllers/turnos.controller';
import { authenticateToken } from '../controllers/auth.controller';

const router = express.Router()
App.use(express.json)

router.get('/', authenticateToken, controller.getAll)
router.get('/{id}', controller.getById)

router.post('/', (_req, res) => {
    res.send('Saving a new turno');
});

export default router;