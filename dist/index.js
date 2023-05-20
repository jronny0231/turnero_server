"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_server_1 = __importDefault(require("./servers/express.server"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const queue_routes_1 = __importDefault(require("./routes/queue.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
express_server_1.default.use('/api/auth', auth_routes_1.default);
express_server_1.default.use('/api/queues', queue_routes_1.default);
express_server_1.default.use('/api/users', user_routes_1.default);
express_server_1.default.use('/api/services', service_routes_1.default);
