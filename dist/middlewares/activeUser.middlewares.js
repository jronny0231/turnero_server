"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyActiveUserToken = void 0;
const user_controller_1 = require("../controllers/user.controller");
const verifyActiveUserToken = (_req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = res.locals.payload.token;
    const id = res.locals.payload.id;
    // Verify if online user account has same token stored.
    const loggedToken = yield (0, user_controller_1.getTokenById)(id);
    if (!loggedToken || (loggedToken !== token)) {
        (0, user_controller_1.setTokenById)(id, "");
        res.locals.payloay = null;
        return res.status(403).json({ message: "invalid session token, user logged out." });
    }
    next();
    return;
});
exports.verifyActiveUserToken = verifyActiveUserToken;
