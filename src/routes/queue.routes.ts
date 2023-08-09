import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';
import { GetAllQueues, GetQueueById, StoreNewQueue, UpdateQueue, DeleteQueue, getActiveQueuesByDisplayId, getNewCallingsByDisplayId, updateCallingsByDisplayId } from '../controllers/queue.controller';
import { getDisplayProps } from '../middlewares/smartTV.middlewares';
import { middlewaresType } from '../@types/global';

const router = express.Router()

const middlewares: middlewaresType = [authToken, verifyActiveUserToken];


/**
 * Probar el endpoint de la pantalla de turnos
 * (REQ->GET: query_params con sucursal_id),
 * (RESP: Array con turnos en estado [EN ESPERA, ATENDIENDO, ESPERANDO]
 * con los siguientes campos: {id, secuencia, servicio_destino, departamento, estado}
 */
router.get('/display/', getDisplayProps, getActiveQueuesByDisplayId)
router.get('/display/calling', getDisplayProps, getNewCallingsByDisplayId)
router.post('/display/calling/:id', getDisplayProps, updateCallingsByDisplayId)

router.get('/', middlewares, GetAllQueues);
router.get('/:id', middlewares, GetQueueById);
router.post('/', middlewares, StoreNewQueue);
router.put('/:id', middlewares, UpdateQueue);
router.delete('/:id', middlewares, DeleteQueue);


export default router;