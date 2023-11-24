import express from 'express';
import * as controller from '../controllers/office.controller';

import { validateWith } from '../middlewares/validation.middlewares'
import { createOffice, updateOffice } from '../schemas/office.schema';
import { middlewares } from '../utils/tools';

const router = express.Router()

router.get('/', middlewares('offices'), controller.getAllOffices)

router.get('/:id', middlewares('offices'), controller.GetOfficeById);

router.post('/', middlewares('offices'), validateWith(createOffice), controller.StoreNewOffice);

router.put('/:id', middlewares('offices'), validateWith(updateOffice), controller.UpdateOffice);

router.delete('/:id', middlewares('offices'), controller.DeleteOffice);

router.post('/departments', middlewares('offices_departments'), );// validateWith(createOffceWithDepartments), controller.StoreOfficeWithDepartments);

router.put('/departments', middlewares('offices_departments'), );// validateWith(updateOffceWithDepartments), controller.UpdateOfficeWithDepartments);

export default router