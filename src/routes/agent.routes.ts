import express from 'express';
import * as controller from '../controllers/agent.controller';
import { validateWith } from '../middlewares/validation.middlewares'
import { createAgent, updateAgentStatus } from '../schemas/agent.schema';
import { middlewares } from '../utils/tools';

const router = express.Router()

router.put('/atendiendo/', middlewares('queues_state'), validateWith(updateAgentStatus), controller.UpdateAgentQueueStatus)

router.get('/', middlewares('agents'), controller.GetAllAgents);

router.get('/:id', middlewares('agents'), controller.GetAgentById);

router.post('/', middlewares('agents'), validateWith(createAgent), controller.StoreNewAgent);

router.put('/:id', middlewares('agents'), controller.UpdateAgent);

router.delete('/:id', middlewares('agents'), controller.DeleteAgent);


export default router;