import express from 'express';
import * as controller from '../controllers/records.controller';
import validateWith from '../middlewares/validation.middlewares';
import { getQueueCallAudio } from '../schemas/records.schema';

const router = express.Router()

router.get('/stream-queue/:uuid', validateWith(getQueueCallAudio), controller.getCallingAudiobyDisplay)

export default router