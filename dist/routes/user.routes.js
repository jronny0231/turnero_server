"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activeToken_middlewares_1 = require("../middlewares/activeToken.middlewares");
const user_controller_1 = require("../controllers/user.controller");
const activeUser_middlewares_1 = require("../middlewares/activeUser.middlewares");
const router = express_1.default.Router();
router.get('/', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, user_controller_1.GetAllUsers);
router.get('/:id', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, user_controller_1.GetUserById);
router.post('/', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, user_controller_1.StoreNewUser);
router.put('/:id', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, user_controller_1.UpdateUser);
router.delete('/:id', activeToken_middlewares_1.authToken, activeUser_middlewares_1.verifyActiveUserToken, user_controller_1.DeleteUser);
exports.default = router;
