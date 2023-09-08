import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import * as controller from '../controllers/department.controller';
import { validateActiveUser } from '../middlewares/activeUser.middlewares';
import { middlewaresType } from '../@types/global';
import validateWith from '../middlewares/validation.middlewares'
import { addRelatedServicesToDepartment, createDepartment, createDepartmentWithRelatedServices, updateDepartment } from '../schemas/department.schema';

const router = express.Router()

const middlewares: middlewaresType = [authToken, validateActiveUser];

router.get('/', middlewares, controller.getAllDepartments)
router.get('/:id', middlewares, controller.GetDepartmentById);

router.post('/', middlewares, validateWith(createDepartment), controller.StoreNewDepartment);
router.post('/services', middlewares, validateWith(createDepartmentWithRelatedServices), controller.StoreNewDepartmentWithServices);

router.put('/:id', middlewares, validateWith(updateDepartment), controller.UpdateDepartment);
router.put('/:id/services', middlewares, validateWith(addRelatedServicesToDepartment), controller.AddServicesToDepartment);

router.delete('/:id', middlewares, controller.DeleteDepartment);

export default router
