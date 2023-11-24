import express from 'express';
import * as controller from '../controllers/client.controller';
import { validateWith } from '../middlewares/validation.middlewares';
import { createClient, updateClient } from '../schemas/client.schema';
import { middlewares } from '../utils/tools';

const router = express.Router()

router.get('/', middlewares('clients'), controller.GetAllClients);
router.get('/:id', middlewares('clients'), controller.GetClientsById);

router.post('/', middlewares('clients'), validateWith(createClient), controller.StoreNewClient);
router.put('/', middlewares('clients'), validateWith(updateClient), controller.UpdateClient);

router.delete('/:id', middlewares('clients'), controller.DeleteClient)

export default router;