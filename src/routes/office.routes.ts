import express from 'express';
import { authToken } from '../middlewares/activeToken.middlewares';
import * as controller from '../controllers/office.controller';
import { validateActiveUser } from '../middlewares/activeUser.middlewares';
import { middlewaresType } from '../@types/global';
import validateWith from '../middlewares/validation.middlewares'
import { createOffice, updateOffice } from '../schemas/office.schema';

const router = express.Router()

const middlewares: middlewaresType = [authToken, validateActiveUser];

router.get('/', middlewares, controller.getAllOffices)
router.get('/:id', middlewares, controller.GetOfficeById);

router.post('/', middlewares, validateWith(createOffice), controller.StoreNewOffice);

router.put('/:id', middlewares, validateWith(updateOffice), controller.UpdateOffice);

router.delete('/:id', middlewares, controller.DeleteOffice);

export default router