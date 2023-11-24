import express from 'express';
import * as serviceCtl from '../controllers/service.controller';
import * as groupCtl from '../controllers/serviceGroup.controller';
import { validateWith } from '../middlewares/validation.middlewares'
import { createServices, createServicesGroup, updateServiceGroup } from '../schemas/service.schema';
import { middlewares } from '../utils/tools';

const router = express.Router()

router.get('/groups/', middlewares('services_groups'), groupCtl.GetAllServicesGroup);

router.get('/groups/:id', middlewares('services_groups'), groupCtl.GetServiceGroupById);

router.post('/groups/', middlewares('services_groups'), validateWith(createServicesGroup), groupCtl.StoreNewServiceGroup);

router.put('/groups/:id', middlewares('services_groups'), validateWith(updateServiceGroup), groupCtl.UpdateServiceGroup);

router.delete('/groups/:id', middlewares('services_groups'), groupCtl.DeleteServiceGroup);


router.get('/available/', middlewares('services'), serviceCtl.GetAllAvailableServices);

router.get('/', middlewares('services'), serviceCtl.GetAllServices);

router.get('/:id', middlewares('services'), serviceCtl.GetServiceById);

router.post('/', middlewares('services'), validateWith(createServices), serviceCtl.StoreNewServices);

router.put('/:id', middlewares('services'), serviceCtl.UpdateService);

router.delete('/:id', middlewares('services'), serviceCtl.DeleteService);


export default router;