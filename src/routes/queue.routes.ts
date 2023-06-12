import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';
import { GetAllQueues, GetQueueById, StoreNewQueue, UpdateQueue, DeleteQueue, getActiveQueuesBySucursalId } from '../controllers/queue.controller';
import { getDisplayProps } from '../middlewares/smartTV.middlewares';

const router = express.Router()

/**
 * Probar el endpoint de la pantalla de turnos
 * (REQ->GET: query_params con sucursal_id),
 * (RESP: Array con turnos en estado [EN ESPERA, ATENDIENDO, ESPERANDO]
 * con los siguientes campos: {id, secuencia, servicio_destino, departamento, estado}
 */
router.get('/display/:id', getDisplayProps, getActiveQueuesBySucursalId)

router.get('/', authToken, verifyActiveUserToken, GetAllQueues);
router.get('/:id', authToken, verifyActiveUserToken, GetQueueById);
router.post('/', authToken, verifyActiveUserToken, StoreNewQueue);
router.put('/:id', authToken, verifyActiveUserToken, UpdateQueue);
router.delete('/:id', authToken, verifyActiveUserToken, DeleteQueue);


export default router;