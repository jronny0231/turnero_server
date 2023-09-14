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
const controller = __importStar(require("../controllers/schedule.controller"));
const activeToken_middlewares_1 = require("../middlewares/activeToken.middlewares");
const activeUser_middlewares_1 = require("../middlewares/activeUser.middlewares");
const validation_middlewares_1 = __importDefault(require("../middlewares/validation.middlewares"));
const schedule_schema_1 = require("../schemas/schedule.schema");
const router = express_1.default.Router();
const middlewares = [activeToken_middlewares_1.authToken, activeUser_middlewares_1.validateActiveUser];
router.get('/', middlewares, controller.GetAllSchedules);
router.get('/:id', middlewares, controller.GetSchedulesById);
router.post('/', middlewares, (0, validation_middlewares_1.default)(schedule_schema_1.createSchedule), controller.StoreNewSchedule);
router.put('/', middlewares, (0, validation_middlewares_1.default)(schedule_schema_1.updateSchedule), controller.UpdateSchedule);
router.delete('/:id', middlewares, controller.DeleteSchedule);
exports.default = router;
