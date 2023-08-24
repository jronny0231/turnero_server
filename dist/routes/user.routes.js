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
const middlewares = [activeToken_middlewares_1.authToken, activeUser_middlewares_1.validateActiveUser];
router.get('/', middlewares, user_controller_1.GetAllUsers);
router.get('/:id', middlewares, user_controller_1.GetUserById);
router.post('/', middlewares, user_controller_1.StoreNewUser);
router.put('/:id', middlewares, user_controller_1.UpdateUser);
router.delete('/:id', middlewares, user_controller_1.DeleteUser);
exports.default = router;
