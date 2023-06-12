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
const ws_1 = require("ws");
const display_model_1 = require("../models/display.model");
const PORT = Number(process.env.WS_PORT) || 5050;
const WSS = new ws_1.WebSocketServer({ port: PORT });
// Check SmartTV connection path and secret key
const clientUUID = new Map();
const fetchPantallas = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, display_model_1.GetAll)();
});
const webSocketMiddleware = (ws, req, cb) => {
    if (req.url) {
        const UUID = req.url.replace('/', '');
        fetchPantallas().then(pantallas => {
            let found = false;
            pantallas.forEach(pantalla => {
                if (pantalla.key === UUID) {
                    found = true;
                    clientUUID.set(UUID, pantalla);
                    cb(ws, req);
                    return;
                }
            });
            !found && ws.close(3001, 'UUID not matched');
        }).catch(error => {
            ws.close(3001, error.message);
            return;
        });
    }
    else {
        ws.close(4001, "No UUID provided");
        return;
    }
};
const onClose = (UUID, code, reason) => {
    console.log(`Client disconnected, code: ${code}, reason: ${reason}`);
    const hasDeleted = clientUUID.delete(UUID);
    if (hasDeleted) {
        console.log('Client deleted');
    }
    else {
        console.log('Client not found');
    }
};
WSS.on('connection', (socket, request) => {
    webSocketMiddleware(socket, request, (ws, req) => {
        ws.on('close', (code, reason) => {
            if (req.url) {
                const UUID = req.url.replace('/', '');
                onClose(UUID, code, reason);
            }
        });
        ws.on('message', (msg) => {
            console.log('received: %s', msg);
            ws.send('You`ve send: ' + msg);
        });
        ws.on('error', (error) => {
            console.error({ socketError: error });
        });
    });
});
exports.default = WSS;
