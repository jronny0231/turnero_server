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
const jwt_helper_1 = require("../services/jwt.helper");
const TOKEN_SECRET = (0, jwt_helper_1.getSecret)();
const authToken = (req, res, next) => {
    // Request and check bearer token from header
    const authHeader = req.get('authorization');
    if (authHeader === undefined) {
        return res.status(403).json({ success: false, message: 'bearer token forbidden' });
    }
    const { tokenType, token } = authHeader.split(' ');
    if (tokenType !== 'Bearer' || typeof token !== 'string') {
        return res.status(403).json({ success: false, message: 'bearer token invalid' });
    }
    // Verify token (iss, lifetime, structure) from jwt
    jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (err, decode) => __awaiter(void 0, void 0, void 0, function* () {
        // If error return it
        if (err) {
            return res.status(403).json({ success: false, message: err.message });
        }
        const payload = decode.data;
        res.locals.payload = payload;
        res.locals.token = token;
        next();
    }));
};
exports.authToken = authToken;
