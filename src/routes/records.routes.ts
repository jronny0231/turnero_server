import express from 'express';
import * as controller from '../controllers/records.controller';
import { validateWith } from '../middlewares/validation.middlewares';
import { getQueueCallAudio, setQueueCallAudio } from '../schemas/records.schema';

const router = express.Router()

router.post('/stream-queue', validateWith(setQueueCallAudio), controller.preparingCallingAudio)
router.get('/stream-queue/:uuid', validateWith(getQueueCallAudio), controller.getCallingAudiobyDisplay)

export default router