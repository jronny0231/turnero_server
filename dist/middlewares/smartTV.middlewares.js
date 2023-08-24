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
exports.getDisplayProps = void 0;
const filtering_1 = require("../utils/filtering");
const getDisplayProps = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Aqui ira la logica con la tabla de Pantallas para comparar la informacion
    // del objeto request que servira de autenticacion ademas de brindar
    // informacion sobre la pantalla que hace la solicitud.
    const key = (0, filtering_1.stringToUUID)((_a = req.get("X-Display-UUID")) !== null && _a !== void 0 ? _a : "");
    if (key === null) {
        return res.status(403).json({ message: "invalid X-Display-UUID header-key, please fix it and try again." });
    }
    res.locals.display = key;
    // console.log("Display connected: ", key)
    next();
    return;
});
exports.getDisplayProps = getDisplayProps;
