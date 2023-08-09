import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import { DeleteService, GetAllServices, GetAllServicesByServiceGroup, GetAllSeletableServicesByServiceGroup, GetServiceById, StoreNewService, UpdateService } from '../controllers/service.controller';
import { DeleteServiceGroup, GetAllServicesGroup, GetAllSelectableServicesGroup, GetServiceGroupById, StoreNewServiceGroup, UpdateServiceGroup } from '../controllers/serviceGroup.controller';
import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';
import { middlewaresType } from '../@types/global';

const router = express.Router()

const middlewares: middlewaresType = [authToken, verifyActiveUserToken];

router.get('/groups/', middlewares, GetAllServicesGroup);
router.get('/groups/:id', middlewares, GetServiceGroupById);
router.get('/selectable-groups/', middlewares, GetAllSelectableServicesGroup);
router.post('/groups/', middlewares, StoreNewServiceGroup);
router.put('/groups/:id', middlewares, UpdateServiceGroup);
router.delete('/groups/:id', middlewares, DeleteServiceGroup);

router.get('/groups/:id/services/', middlewares, GetAllServicesByServiceGroup);
router.get('/groups/:id/selectable-services/', middlewares, GetAllSeletableServicesByServiceGroup);

router.get('/', middlewares, GetAllServices);
router.get('/:id', middlewares, GetServiceById);
router.post('/', middlewares, StoreNewService);
router.put('/:id', middlewares, UpdateService);
router.delete('/:id', middlewares, DeleteService);

export default router;