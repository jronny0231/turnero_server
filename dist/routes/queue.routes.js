"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const queue_controller_1 = require("../controllers/queue.controller");
const activeToken_middlewares_1 = require("../middlewares/activeToken.middlewares");
const activeUser_middlewares_1 = require("../middlewares/activeUser.middlewares");
const router = express_1.default.Router();
router.get('/', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, queue_controller_1.GetAllQueues);
router.get('/:id', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, queue_controller_1.GetQueueById);
router.post('/', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, queue_controller_1.StoreNewQueue);
router.put('/:id', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, queue_controller_1.UpdateQueue);
router.delete('/:id', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, queue_controller_1.DeleteQueue);
exports.default = router;
