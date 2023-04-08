"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const App = (0, express_1.default)();
const port = process.env.port || 3000;
App.use(cors_1.default);
App.listen(port, () => {
    console.log('Server Express running on port ' + port);
});
exports.default = App;
