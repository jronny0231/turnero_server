"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketToken = exports.urlToken = exports.authToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_helper_1 = require("../services/jwt.helper");
const TOKEN_SECRET = (0, jwt_helper_1.getSecret)();
const authToken = (req, res, next) => {
    // Request and check bearer token from header
    const authHeader = req.get('authorization');
    if (authHeader === undefined) {
        return res.status(403).json({ success: false, message: 'bearer token forbidden' });
    }
    const [tokenType, token] = authHeader.split(' ');
    if (tokenType !== 'Bearer' || typeof token !== 'string') {
        return res.status(403).json({ success: false, message: 'bearer token invalid' });
    }
    // Verify token (iss, lifetime, structure) from jwt
    return jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (err, decode) => {
        // If error return it
        if (err) {
            return res.status(403).json({ success: false, message: err.message });
        }
        const payload = decode.data;
        res.locals.payload = payload;
        res.locals.token = token;
        return next();
    });
};
exports.authToken = authToken;
const urlToken = (req, res, next) => {
    const { token } = req.query;
    if (typeof token !== 'string') {
        return res.status(403).json({ success: false, message: 'bearer token invalid' });
    }
    // Verify token (iss, lifetime, structure) from jwt
    return jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (err, decode) => {
        // If error return it
        if (err) {
            return res.status(403).json({ success: false, message: err.message });
        }
        const payload = decode.data;
        res.locals.payload = payload;
        res.locals.token = token;
        return next();
    });
};
exports.urlToken = urlToken;
const socketToken = (socket, next) => {
    const token = socket.handshake.auth.token;
    if (typeof token !== 'string') {
        const error = new Error('bearer token invalid');
        return next(error);
    }
    // Verify token (iss, lifetime, structure) from jwt
    return jsonwebtoken_1.default.verify(token, TOKEN_SECRET, (err, decode) => {
        // If error return it
        if (err) {
            const error = new Error(err.message);
            return next(error);
        }
        socket.handshake.auth.payload = decode.data;
        return next();
    });
};
exports.socketToken = socketToken;
