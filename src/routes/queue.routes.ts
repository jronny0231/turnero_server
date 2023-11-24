import express from 'express';
import * as controller from '../controllers/queue.controller';
import { getDisplayProps } from '../middlewares/smartTV.middlewares';
import { validateWith } from '../middlewares/validation.middlewares'
import { createQueueWithClient, updateQueueState } from '../schemas/queue.schema';
import { middlewares } from '../utils/tools';

const router = express.Router()

/**
 * Probar el endpoint de la pantalla de turnos
 * (REQ->GET: query_params con sucursal_id),
 * (RESP: Array con turnos en estado [EN ESPERA, ATENDIENDO, ESPERANDO]
 * con los siguientes campos: {id, secuencia, servicio_destino, departamento, estado}
 */
router.get('/display/', getDisplayProps, controller.getActiveQueuesByDisplayId);
router.get('/display/callData/', getDisplayProps, controller.getNewCallingsByDisplayId);
router.post('/display/callData/:id', getDisplayProps, controller.updateCallingsByDisplayId);

router.get('/active/', middlewares('queues'), controller.GetToAttendQueue);
router.put('/active/', middlewares('queues'), validateWith(updateQueueState), controller.UpdateStateAttendingQueue);

router.get('/', middlewares('queues'), controller.getAllQueues);
router.get('/:id', middlewares('queues'), controller.getQueueById);
router.post('/', middlewares('queues'), validateWith(createQueueWithClient), controller.StoreNewQueue);
router.put('/:id', middlewares('queues'), controller.UpdateQueue);
router.delete('/:id', middlewares('queues'), controller.DeleteQueue);


export default router;