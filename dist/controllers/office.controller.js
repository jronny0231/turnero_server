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
exports.DeleteOffice = exports.UpdateOffice = exports.StoreNewOffice = exports.GetOfficeById = exports.getAllOffices = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient;
const getAllOffices = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sucursales = yield prisma.sucursales.findMany().finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (sucursales.length === 0)
            return res.status(404).json({ message: 'Sucursales data was not found' });
        return res.json({ success: true, message: 'Sucursales data was successfully recovery', data: sucursales });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Sucursales data.', data: error });
    }
});
exports.getAllOffices = getAllOffices;
const GetOfficeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const sucursal = yield prisma.sucursales.findFirst({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (sucursal === null)
            return res.status(404).json({ message: `Sucursal id ${id} data was not found` });
        return res.json({ success: true, message: `Sucursal id: ${id} data was successfully recovery`, data: sucursal });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error getting Sucursal id: ${id} data.`, data: error });
    }
});
exports.GetOfficeById = GetOfficeById;
const StoreNewOffice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const nuevaSucursal = yield prisma.sucursales.create({
            data
        });
        return res.json({ success: true, message: 'Sucursal data was successfully created', data: nuevaSucursal });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error creating new Sucursal.', data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.StoreNewOffice = StoreNewOffice;
const UpdateOffice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = req.body;
    try {
        const result = yield prisma.sucursales.update({
            where: { id }, data
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: 'Sucursal data was successfully updated', data: result });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error updating Sucursal id: ${id} data.`, data: error });
    }
});
exports.UpdateOffice = UpdateOffice;
const DeleteOffice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const result = yield prisma.sucursales.delete({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: "Sucursal was update successfully!", data: result });
    }
    catch (error) {
        console.error(`Error trying delete Sucursal id: ${id}`, { error });
        return res.status(404).json({ success: false, message: `Error trying delete Sucursal id: ${id}`, data: error });
    }
});
exports.DeleteOffice = DeleteOffice;
