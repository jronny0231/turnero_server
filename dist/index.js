"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const admin_1 = require("./core/admin");
(0, admin_1.initialize)(); // Initialize constants cache core data
// Page not found: must be after all routes
app_1.default.use((req, res) => {
    return res.status(404).json({ message: `The resource on ${req.originalUrl} could not be found!` });
});
