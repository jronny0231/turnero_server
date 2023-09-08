import express from 'express';
import * as controller from "../controllers/aws.controller"

const router = express.Router()

router.get('/', controller.getAllFileList);
router.get('/:key', controller.getFileByKey);

export default router;