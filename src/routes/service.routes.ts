import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import { DeleteService, GetAllServices, GetAllServicesByServiceGroup, GetAllSeletableServicesByServiceGroup, GetServiceById, StoreNewService, UpdateService } from '../controllers/service.controller';
import { DeleteServiceGroup, GetAllServicesGroup, GetAllSelectableServicesGroup, GetServiceGroupById, StoreNewServiceGroup, UpdateServiceGroup } from '../controllers/serviceGroup.controller';
import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';

const router = express.Router()

router.get('/groups/', authToken, verifyActiveUserToken, GetAllServicesGroup);
router.get('/groups/:id', authToken, verifyActiveUserToken, GetServiceGroupById);
router.get('/selectable-groups/', authToken, verifyActiveUserToken, GetAllSelectableServicesGroup);
router.post('/groups/', authToken, verifyActiveUserToken, StoreNewServiceGroup);
router.put('/groups/:id', authToken, verifyActiveUserToken, UpdateServiceGroup);
router.delete('/groups/:id', authToken, verifyActiveUserToken, DeleteServiceGroup);

router.get('/groups/:id/services/', authToken, verifyActiveUserToken, GetAllServicesByServiceGroup);
router.get('/groups/:id/selectable-services/', authToken, verifyActiveUserToken, GetAllSeletableServicesByServiceGroup);

router.get('/', authToken, verifyActiveUserToken, GetAllServices);
router.get('/:id', authToken, verifyActiveUserToken, GetServiceById);
router.post('/', authToken, verifyActiveUserToken, StoreNewService);
router.put('/:id', authToken, verifyActiveUserToken, UpdateService);
router.delete('/:id', authToken, verifyActiveUserToken, DeleteService);

export default router;