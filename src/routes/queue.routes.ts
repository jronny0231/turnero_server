import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';
import { GetAllQueues, GetQueueById, StoreNewQueue, UpdateQueue, DeleteQueue } from '../controllers/queue.controller';

const router = express.Router()

router.get('/', authToken, verifyActiveUserToken, GetAllQueues);
router.get('/:id', authToken, verifyActiveUserToken, GetQueueById);
router.post('/', authToken, verifyActiveUserToken, StoreNewQueue);
router.put('/:id', authToken, verifyActiveUserToken, UpdateQueue);
router.delete('/:id', authToken, verifyActiveUserToken, DeleteQueue);


export default router;