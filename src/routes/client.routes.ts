import express from 'express';
import * as controller from '../controllers/client.controller';
import { middlewaresType } from '../@types/global';
import { authToken } from '../middlewares/activeToken.middlewares';
import { validateActiveUser } from '../middlewares/activeUser.middlewares';
import validateWith from '../middlewares/validation.middlewares';
import { createClient, updateClient } from '../schemas/client.schema';

const router = express.Router()

const middlewares: middlewaresType = [authToken, validateActiveUser];

router.get('/', middlewares, controller.GetAllClients);
router.get('/:id', middlewares, controller.GetClientsById);

router.post('/', middlewares, validateWith(createClient), controller.StoreNewClient);
router.put('/', middlewares, validateWith(updateClient), controller.UpdateClient);

router.delete('/:id', middlewares, controller.DeleteClient)

export default router;