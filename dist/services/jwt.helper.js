"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PRIVATE_TOKEN_SECRET = "@#$56;ñasdasdasdÑasdad$%&5468(//&//#hnAde!/ñpP[];mnf234-=&111;ñaqxqeAAQW12$%$&°";
const TOKEN_SECRET = process.env.TOKEN_SECRET || PRIVATE_TOKEN_SECRET;
exports.createToken = ((payload) => {
    return jsonwebtoken_1.default.sign({
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
        data: payload
    }, TOKEN_SECRET);
});
const getSecret = () => TOKEN_SECRET;
exports.getSecret = getSecret;
