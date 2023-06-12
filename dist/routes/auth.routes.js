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
const User = __importStar(require("../controllers/user.controller"));
const activeToken_middlewares_1 = require("../middlewares/activeToken.middlewares");
const activeUser_middlewares_1 = require("../middlewares/activeUser.middlewares");
const jwt_helper_1 = require("../services/jwt.helper");
const router = express_1.default.Router();
router.post('/login', User.Login);
router.get('/refreshToken', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, jwt_helper_1.refreshToken);
router.delete('/logout', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, User.Logout);
router.get('/profile', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, (_req, res) => {
    const id = res.locals.payload.id;
    User.GetUserByTokenId(id, res);
});
router.get('/agent', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, (_req, res) => {
    const id = res.locals.payload.id;
    User.GetAgentByTokenId(id, res);
});
router.put('/passwordReset/:id', User.UpdatePassword);
router.put('/passwordReset', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, User.UpdatePassword);
exports.default = router;
