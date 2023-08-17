import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import * as controller from '../controllers/agent.controller';
import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';
import { middlewaresType } from '../@types/global';
import validateWith from '../middlewares/validation.middlewares'
import { createAgent, updateAgentStatus } from '../schemas/agent.schema';

const router = express.Router()

const middlewares: middlewaresType = [authToken, verifyActiveUserToken];

router.put('/atendiendo/', middlewares, validateWith(updateAgentStatus), controller.UpdateAgentQueueStatus)

router.get('/', middlewares, controller.GetAllAgents);
router.get('/:id', middlewares, controller.GetAgentById);
router.post('/', middlewares, validateWith(createAgent), controller.StoreNewAgent);
router.put('/:id', middlewares, controller.UpdateAgent);
router.delete('/:id', middlewares, controller.DeleteAgent);


export default router;