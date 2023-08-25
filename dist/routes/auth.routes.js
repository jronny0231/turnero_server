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
const Auth = __importStar(require("../providers/auth.provider"));
const activeToken_middlewares_1 = require("../middlewares/activeToken.middlewares");
const activeUser_middlewares_1 = require("../middlewares/activeUser.middlewares");
const validation_middlewares_1 = __importDefault(require("../middlewares/validation.middlewares"));
const user_schema_1 = require("../schemas/user.schema");
const router = express_1.default.Router();
const middlewares = [activeToken_middlewares_1.authToken, activeUser_middlewares_1.validateActiveUser];
router.post('/login/', (0, validation_middlewares_1.default)(user_schema_1.userCredential), Auth.Login);
router.get('/refreshToken/', middlewares, Auth.RefreshToken);
router.delete('/logout/', middlewares, Auth.Logout);
router.get('/profile/', middlewares, Auth.GetAccount);
router.put('/profile/', middlewares, (0, validation_middlewares_1.default)(user_schema_1.updateUser), Auth.UpdateAccount);
router.put('/update-password/', middlewares, activeToken_middlewares_1.urlToken, (0, validation_middlewares_1.default)(user_schema_1.passwordChange), Auth.UpdatePassword);
// router.get('/reset-password', Auth.ConfirmPasswordForm)
router.put('/reset-password/:id', middlewares, Auth.ResetPassword);
exports.default = router;
