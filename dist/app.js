"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_server_1 = __importDefault(require("./servers/express.server"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const config_routes_1 = __importDefault(require("./routes/config.routes"));
const queue_routes_1 = __importDefault(require("./routes/queue.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const service_routes_1 = __importDefault(require("./routes/service.routes"));
const version = process.env.VERSION || "1";
express_server_1.default.use(`/api/v${version}/auth`, auth_routes_1.default);
express_server_1.default.use(`/api/v${version}/config`, config_routes_1.default);
express_server_1.default.use(`/api/v${version}/queues`, queue_routes_1.default);
express_server_1.default.use(`/api/v${version}/users`, user_routes_1.default);
express_server_1.default.use(`/api/v${version}/services`, service_routes_1.default);
exports.default = express_server_1.default;
