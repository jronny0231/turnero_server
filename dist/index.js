"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
// Page not found: must be after all routes
app_1.default.use('/*', (_req, res) => {
    return res.status(404).json({ message: "Page not found!" });
});
