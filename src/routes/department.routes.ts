import express from 'express';
import * as controller from '../controllers/department.controller';
import { validateWith } from '../middlewares/validation.middlewares'
import * as deptSchemas from '../schemas/department.schema';
import { middlewares } from '../utils/tools';

const router = express.Router()


router.get('/', middlewares('departments'), controller.getAllDepartments)
router.get('/:id', middlewares('departments'), controller.GetDepartmentById);

router.post('/', middlewares('departments'), validateWith(deptSchemas.createDepartment), controller.StoreNewDepartment);
router.post('/services', middlewares('offs_depts_services'), validateWith(deptSchemas.createDepartmentWithRelatedServices), controller.StoreNewDepartmentWithServices);

router.put('/:id', middlewares('departments'), validateWith(deptSchemas.updateDepartment), controller.UpdateDepartment);
router.put('/:id/services', middlewares('offs_depts_services'), validateWith(deptSchemas.addRelatedServicesToDepartment), controller.AddServicesToDepartment);

router.delete('/:id', middlewares('departments'), controller.DeleteDepartment);

export default router
