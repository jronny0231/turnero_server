import express from 'express';
import * as controller from '../controllers/schedule.controller';
import { validateWith } from '../middlewares/validation.middlewares';
import { createSchedule, updateSchedule } from '../schemas/schedule.schema';
import { middlewares } from '../utils/tools';

const router = express.Router()

router.get('/', middlewares('schedules'), controller.GetAllSchedules);

router.get('/:id', middlewares('schedules'), controller.GetSchedulesById);

router.post('/', middlewares('schedules'), validateWith(createSchedule), controller.StoreNewSchedule);

router.put('/', middlewares('schedules'), validateWith(updateSchedule), controller.UpdateSchedule);

router.delete('/:id', middlewares('schedules'), controller.DeleteSchedule)


export default router;