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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const PRIVATE_TOKEN_SECRET = "@#$56;ñasdasdasdÑasdad$%&5468(//&//#hnAde!/ñpP[];mnf234-=&111;ñaqxqeAAQW12$%$&°";
const TOKEN_SECRET = process.env.TOKEN_SECRET || PRIVATE_TOKEN_SECRET;
exports.authToken = ((req, res, next) => {
    // Request and check bearer token from header
    const authHeader = req.get('authorization');
    if (authHeader === undefined)
        return res.status(403).json({ message: 'bearer token forbidden' });
    const tokenType = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];
    if (tokenType !== 'Bearer' || token == null)
        return res.status(403).json({ message: 'bearer token invalid' });
    // Verify token (iss, lifetime, structure) from jwt
    jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
        // If error return it
        if (err) {
            return res.status(403).json({ message: err.message });
        }
        // Verify if user data in token is super user offline account
        if (payload.data.type === "super") {
            res.locals.payload = payload.data;
            next();
            return;
        }
        // Set response local variables with verify user data payload 
        res.locals.payload = payload.data;
        res.locals.payload.token = token;
        next();
    }));
});
