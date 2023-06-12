"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_server_1 = __importDefault(require("./servers/express.server"));
const ws_server_1 = __importDefault(require("./servers/ws.server"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const queue_routes_1 = __importDefault(require("./routes/queue.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const appVersion = 1;
express_server_1.default.use(`/api/v${appVersion}/auth`, auth_routes_1.default);
express_server_1.default.use(`/api/v${appVersion}/queues`, queue_routes_1.default);
express_server_1.default.use(`/api/v${appVersion}/users`, user_routes_1.default);
express_server_1.default.use(`/api/v${appVersion}/services`, service_routes_1.default);
ws_server_1.default.on('connection', function connection(ws) {
    ws.send(`Connected to server`);
});
exports.default = express_server_1.default;
