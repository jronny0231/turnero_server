"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activeToken_middlewares_1 = require("../middlewares/activeToken.middlewares");
const activeUser_middlewares_1 = require("../middlewares/activeUser.middlewares");
const queue_controller_1 = require("../controllers/queue.controller");
const smartTV_middlewares_1 = require("../middlewares/smartTV.middlewares");
const router = express_1.default.Router();
/**
 * Probar el endpoint de la pantalla de turnos
 * (REQ->GET: query_params con sucursal_id),
 * (RESP: Array con turnos en estado [EN ESPERA, ATENDIENDO, ESPERANDO]
 * con los siguientes campos: {id, secuencia, servicio_destino, departamento, estado}
 */
router.get('/display/:id', smartTV_middlewares_1.getDisplayProps, queue_controller_1.getActiveQueuesBySucursalId);
router.get('/', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, queue_controller_1.GetAllQueues);
router.get('/:id', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, queue_controller_1.GetQueueById);
router.post('/', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, queue_controller_1.StoreNewQueue);
router.put('/:id', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, queue_controller_1.UpdateQueue);
router.delete('/:id', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, queue_controller_1.DeleteQueue);
exports.default = router;
