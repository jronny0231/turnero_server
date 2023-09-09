import express from 'express';
import * as controller from '../controllers/schedule.controller';
import { middlewaresType } from '../@types/global';
import { authToken } from '../middlewares/activeToken.middlewares';
import { validateActiveUser } from '../middlewares/activeUser.middlewares';
import validateWith from '../middlewares/validation.middlewares';
import { createSchedule, updateSchedule } from '../schemas/schedule.schema';

const router = express.Router()

const middlewares: middlewaresType = [authToken, validateActiveUser];


router.get('/', middlewares, controller.GetAllSchedules);
router.get('/:id', middlewares, controller.GetSchedulesById);

router.post('/', middlewares, validateWith(createSchedule), controller.StoreNewSchedule);
router.put('/', middlewares, validateWith(updateSchedule), controller.UpdateSchedule);

router.delete('/:id', middlewares, controller.DeleteSchedule)


export default router;