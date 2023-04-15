"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const turnos_routes_1 = __importDefault(require("./routes/turnos.routes"));
const express_server_1 = __importDefault(require("./servers/express.server"));
express_server_1.default.use('/api/turnos', turnos_routes_1.default);
express_server_1.default.get('/ping', (_req, res) => {
    console.log('Someone ping here!');
    res.send('pong');
});
