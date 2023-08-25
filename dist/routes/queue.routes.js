"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activeToken_middlewares_1 = require("../middlewares/activeToken.middlewares");
const activeUser_middlewares_1 = require("../middlewares/activeUser.middlewares");
const controller = __importStar(require("../controllers/queue.controller"));
const smartTV_middlewares_1 = require("../middlewares/smartTV.middlewares");
const validation_middlewares_1 = __importDefault(require("../middlewares/validation.middlewares"));
const queue_schema_1 = require("../schemas/queue.schema");
const router = express_1.default.Router();
const middlewares = [activeToken_middlewares_1.authToken, activeUser_middlewares_1.validateActiveUser];
/**
 * Probar el endpoint de la pantalla de turnos
 * (REQ->GET: query_params con sucursal_id),
 * (RESP: Array con turnos en estado [EN ESPERA, ATENDIENDO, ESPERANDO]
 * con los siguientes campos: {id, secuencia, servicio_destino, departamento, estado}
 */
router.get('/display/', smartTV_middlewares_1.getDisplayProps, controller.getActiveQueuesByDisplayId);
router.get('/display/calling/', smartTV_middlewares_1.getDisplayProps, controller.getNewCallingsByDisplayId);
router.post('/display/calling/:id', smartTV_middlewares_1.getDisplayProps, controller.updateCallingsByDisplayId);
router.get('/active/', middlewares, controller.GetToAttendQueue);
router.put('/active/', middlewares, (0, validation_middlewares_1.default)(queue_schema_1.updateQueueState), controller.UpdateStateQueue);
router.get('/', middlewares, controller.GetAllQueues);
router.get('/:id', middlewares, controller.GetQueueById);
router.post('/', middlewares, (0, validation_middlewares_1.default)(queue_schema_1.createQueueWithClient), controller.StoreNewQueue);
router.put('/:id', middlewares, controller.UpdateQueue);
router.delete('/:id', middlewares, controller.DeleteQueue);
exports.default = router;
