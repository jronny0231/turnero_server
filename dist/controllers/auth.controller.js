"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PRIVATE_TOKEN_SECRET = "@#$56;ñasdasdasdÑasdad$%&5468(//&//#hnAde!/ñpP[];mnf234-=&111;ñaqxqeAAQW12$%$&°";
const TOKEN_SECRET = process.env.TOKEN_SECRET || PRIVATE_TOKEN_SECRET;
exports.createToken = ((payload, expiresIn) => {
    const EXPIRETIME = (expiresIn === null) ? '1800s' : expiresIn;
    return jsonwebtoken_1.default.sign(payload, TOKEN_SECRET, { expiresIn: EXPIRETIME });
});
exports.authenticateToken = ((req, res, next) => {
    const authHeader = req.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (err, payload) => {
        console.log(err);
        if (err)
            return res.sendStatus(403);
        req.headers.set('payload', payload);
        next();
    });
});
