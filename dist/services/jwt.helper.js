"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_controller_1 = require("../controllers/user.controller");
const PRIVATE_TOKEN_SECRET = "@#$56;ñasdasdasdÑasdad$%&5468(//&//#hnAde!/ñpP[];mnf234-=&111;ñaqxqeAAQW12$%$&°";
const TOKEN_SECRET = process.env.TOKEN_SECRET || PRIVATE_TOKEN_SECRET;
exports.createToken = ((payload) => {
    return jsonwebtoken_1.default.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: payload
    }, TOKEN_SECRET);
});
exports.refreshToken = ((_req, res) => {
    const payload = res.locals.payload;
    if (payload.type === "user") {
        const token = (0, exports.createToken)(payload);
        (0, user_controller_1.setTokenById)(payload.id, token);
        return res.json({ token });
    }
    else if (payload.type === "super") {
        const token = (0, exports.createToken)(payload);
        return res.json({ token });
    }
    return res.status(403).json({ message: "invalid session token, user logged out." });
});
