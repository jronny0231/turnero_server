import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import { validateActiveUser } from '../middlewares/activeUser.middlewares';
import * as controller from '../controllers/queue.controller';
import { getDisplayProps } from '../middlewares/smartTV.middlewares';
import { middlewaresType } from '../@types/global';
import validateWith from '../middlewares/validation.middlewares'
import { createQueueWithClient, updateQueueState } from '../schemas/queue.schema';

const router = express.Router()

const middlewares: middlewaresType = [authToken, validateActiveUser];


/**
 * Probar el endpoint de la pantalla de turnos
 * (REQ->GET: query_params con sucursal_id),
 * (RESP: Array con turnos en estado [EN ESPERA, ATENDIENDO, ESPERANDO]
 * con los siguientes campos: {id, secuencia, servicio_destino, departamento, estado}
 */
router.get('/display/', getDisplayProps, controller.getActiveQueuesByDisplayId);
router.get('/display/callData/', getDisplayProps, controller.getNewCallingsByDisplayId);
router.post('/display/callData/:id', getDisplayProps, controller.updateCallingsByDisplayId);

router.get('/active/', middlewares, controller.GetToAttendQueue);
router.put('/active/', middlewares, validateWith(updateQueueState), controller.UpdateStateAttendingQueue);

router.get('/', middlewares, controller.getAllQueues);
router.get('/:id', middlewares, controller.getQueueById);
router.post('/', middlewares, validateWith(createQueueWithClient), controller.StoreNewQueue);
router.put('/:id', middlewares, controller.UpdateQueue);
router.delete('/:id', middlewares, controller.DeleteQueue);


export default router;