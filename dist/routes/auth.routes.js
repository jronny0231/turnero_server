"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const activeToken_middlewares_1 = require("../middlewares/activeToken.middlewares");
const activeUser_middlewares_1 = require("../middlewares/activeUser.middlewares");
const jwt_helper_1 = require("../services/jwt.helper");
const router = express_1.default.Router();
router.post('/login', user_controller_1.Login);
router.get('/refreshToken', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, jwt_helper_1.refreshToken);
router.delete('/logout', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, user_controller_1.Logout);
router.get('/user', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, (_req, res) => {
    const id = res.locals.payload.id;
    (0, user_controller_1.GetUserByTokenId)(id, res);
});
router.put('/passwordReset/:id', user_controller_1.UpdatePassword);
router.put('/passwordReset', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, user_controller_1.UpdatePassword);
exports.default = router;
