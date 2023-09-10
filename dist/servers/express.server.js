"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const App = (0, express_1.default)();
// Load application configuration from configuration .env file
(0, dotenv_1.config)();
const PORT = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 0);
if (PORT === 0) {
    console.error({ message: "Port number not set" });
    process.abort();
}
App.use((0, cors_1.default)({
    origin: '*',
    optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
// Express Middleware settings
App.use(express_1.default.json());
App.use(express_1.default.urlencoded({ extended: false }));
App.use(express_1.default.static(path_1.default.resolve('./public')));
App.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: '/tmp/upload/'
}));
App.listen(PORT, () => {
    console.log('Server Express running on port ' + PORT);
});
App.get('/ping', (_req, res) => {
    console.log('Someone ping here!');
    res.send('pong');
});
exports.default = App;
