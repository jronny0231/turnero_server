"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_server_1 = __importDefault(require("./servers/express.server"));
express_server_1.default.use(body_parser_1.default.json());
express_server_1.default.get('/ping', (req, res) => {
    console.log('Someone ping here!');
    console.log(req.body);
    res.send('pong');
});
