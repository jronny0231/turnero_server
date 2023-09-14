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
const serviceCtl = __importStar(require("../controllers/service.controller"));
const groupCtl = __importStar(require("../controllers/serviceGroup.controller"));
const activeUser_middlewares_1 = require("../middlewares/activeUser.middlewares");
const validation_middlewares_1 = __importDefault(require("../middlewares/validation.middlewares"));
const service_schema_1 = require("../schemas/service.schema");
const router = express_1.default.Router();
const middlewares = [activeToken_middlewares_1.authToken, activeUser_middlewares_1.validateActiveUser];
router.get('/groups/', middlewares, groupCtl.GetAllServicesGroup);
router.get('/groups/:id', middlewares, groupCtl.GetServiceGroupById);
router.post('/groups/', middlewares, groupCtl.StoreNewServiceGroup);
router.put('/groups/:id', middlewares, groupCtl.UpdateServiceGroup);
router.delete('/groups/:id', middlewares, groupCtl.DeleteServiceGroup);
router.get('/available/', middlewares, serviceCtl.GetAllAvailableServices);
router.get('/', middlewares, serviceCtl.GetAllServices);
router.get('/:id', middlewares, serviceCtl.GetServiceById);
router.post('/', middlewares, (0, validation_middlewares_1.default)(service_schema_1.createServices), serviceCtl.StoreNewServices);
router.put('/:id', middlewares, serviceCtl.UpdateService);
router.delete('/:id', middlewares, serviceCtl.DeleteService);
exports.default = router;
