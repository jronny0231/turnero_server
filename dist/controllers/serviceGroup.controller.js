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
exports.DeleteServiceGroup = exports.UpdateServiceGroup = exports.StoreNewServiceGroup = exports.GetServiceGroupById = exports.GetAllSelectableServicesGroup = exports.GetAllServicesGroup = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient;
const GetAllServicesGroup = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Grupos_servicios = yield prisma.grupos_servicios.findMany().finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (Grupos_servicios.length === 0)
            return res.status(404).json({ message: 'Grupos_servicios data was not found' });
        return res.json({ success: true, message: 'Grupos_servicios data was successfully recovery', data: Grupos_servicios });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Grupos_servicios data.', data: error });
    }
});
exports.GetAllServicesGroup = GetAllServicesGroup;
const GetAllSelectableServicesGroup = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Grupos_servicios = yield prisma.grupos_servicios.findMany({
            where: { es_seleccionable: true }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (Grupos_servicios.length === 0)
            return res.status(404).json({ message: 'Selectables grupos_servicios data was not found' });
        return res.json({ success: true, message: 'Selectables grupos_servicios data was successfully recovery', data: Grupos_servicios });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting selectables Grupos_servicios data.', data: error });
    }
});
exports.GetAllSelectableServicesGroup = GetAllSelectableServicesGroup;
const GetServiceGroupById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const Grupos_servicios = yield prisma.grupos_servicios.findFirst({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (Grupos_servicios === null)
            return res.status(404).json({ message: `Grupos_servicios by id ${id} was not found` });
        return res.json({ success: true, message: `Grupos_servicios by id ${id} was successfully recovery`, data: Grupos_servicios });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error getting Grupos_servicios by id ${id}.`, data: error });
    }
});
exports.GetServiceGroupById = GetServiceGroupById;
const StoreNewServiceGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const Grupos_servicios = yield prisma.grupos_servicios.create({
            data
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: 'Grupos_servicios data was successfully store', data: Grupos_servicios });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error creating Grupos_servicios data.', data: error });
    }
});
exports.StoreNewServiceGroup = StoreNewServiceGroup;
const UpdateServiceGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = req.body;
    try {
        const Grupos_servicios = yield prisma.grupos_servicios.update({
            where: { id }, data
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (Grupos_servicios === null)
            return res.status(404).json({ message: `Grupos_servicios by id ${id} could not update` });
        return res.json({ success: true, message: `Grupos_servicios by id ${id} was successfully update`, data: Grupos_servicios });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error updating Grupos_servicios by id ${id}.`, data: error });
    }
});
exports.UpdateServiceGroup = UpdateServiceGroup;
const DeleteServiceGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const Grupos_servicios = yield prisma.grupos_servicios.delete({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (Grupos_servicios === null)
            return res.status(404).json({ message: `Grupos_servicios by id ${id} could not be deleted` });
        return res.json({ success: true, message: `Grupos_servicios by id ${id} was successfully delete`, data: Grupos_servicios });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error deleting Grupos_servicios by id ${id}.`, data: error });
    }
});
exports.DeleteServiceGroup = DeleteServiceGroup;
