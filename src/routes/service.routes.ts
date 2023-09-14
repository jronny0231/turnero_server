import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import * as serviceCtl from '../controllers/service.controller';
import * as groupCtl from '../controllers/serviceGroup.controller';
import { validateActiveUser } from '../middlewares/activeUser.middlewares';
import { middlewaresType } from '../@types/global';
import validateWith from '../middlewares/validation.middlewares'
import { createServices, createServicesGroup, updateServiceGroup } from '../schemas/service.schema';

const router = express.Router()

const middlewares: middlewaresType = [authToken, validateActiveUser];

router.get('/groups/', middlewares, groupCtl.GetAllServicesGroup);
router.get('/groups/:id', middlewares, groupCtl.GetServiceGroupById);
router.post('/groups/', middlewares, validateWith(createServicesGroup), groupCtl.StoreNewServiceGroup);
router.put('/groups/:id', middlewares, validateWith(updateServiceGroup), groupCtl.UpdateServiceGroup);
router.delete('/groups/:id', middlewares, groupCtl.DeleteServiceGroup);

router.get('/available/', middlewares, serviceCtl.GetAllAvailableServices);

router.get('/', middlewares, serviceCtl.GetAllServices);
router.get('/:id', middlewares, serviceCtl.GetServiceById);
router.post('/', middlewares, validateWith(createServices), serviceCtl.StoreNewServices);
router.put('/:id', middlewares, serviceCtl.UpdateService);
router.delete('/:id', middlewares, serviceCtl.DeleteService);

export default router;