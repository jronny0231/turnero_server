"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const App = (0, express_1.default)();
const PORT = process.env.port || 5000;
App.use((0, cors_1.default)({
    origin: '*',
    optionsSuccessStatus: 204 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));
App.use(express_1.default.json());
App.listen(PORT, () => {
    console.log('Server Express running on port ' + PORT);
});
App.get('/ping', (_req, res) => {
    console.log('Someone ping here!');
    res.send('pong');
});
exports.default = App;
