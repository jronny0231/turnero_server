"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//import { authToken } from '../middlewares/activeToken.middlewares';
//import {  } from '../controllers/agent.controller';
//import { verifyActiveUserToken } from '../middlewares/activeUser.middlewares';
const router = express_1.default.Router();
/*
router.get('/', authToken, verifyActiveUserToken, GetLoggedAgent);
router.get('/:id', authToken, verifyActiveUserToken, GetUserById);
router.post('/', authToken, verifyActiveUserToken, StoreNewUser);
router.put('/:id', authToken, verifyActiveUserToken, UpdateUser);
router.delete('/:id', authToken, verifyActiveUserToken, DeleteUser);
*/
exports.default = router;
