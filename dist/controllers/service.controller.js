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
exports.DeleteService = exports.UpdateService = exports.StoreNewServices = exports.GetServiceById = exports.GetAllAvailableServices = exports.GetAllServices = void 0;
const client_1 = require("@prisma/client");
const global_state_1 = require("../core/global.state");
const prisma = new client_1.PrismaClient;
const GetAllServices = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const servicios = yield prisma.servicios.findMany().finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (servicios.length === 0)
            return res.status(404).json({ message: 'Services data was not found' });
        return res.json({ success: true, message: 'Services data was successfully recovery', data: servicios });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Services data.', data: error });
    }
});
exports.GetAllServices = GetAllServices;
const GetAllAvailableServices = (req, res) => {
    const grupo_id = req.query.group ? Number(req.query.group) : undefined;
    const es_seleccionable = req.query.selectable ? Boolean(req.query.selectable) : undefined;
    const user_id = res.locals.payload.id;
    try {
        const sucursal = (0, global_state_1.getSucursalByUserId)(user_id);
        const grupoServicios = (0, global_state_1.GetAllAvailableServicesInSucursal)({
            sucursal_id: sucursal.id,
            grupo_id,
            es_seleccionable
        });
        if (grupoServicios === null)
            return res.status(404).json({ message: `Available Servicios in Sucursal ${sucursal.descripcion} were not found` });
        return res.json({ success: true, message: `Available Servicios in Sucursal ${sucursal.descripcion} were successful recovery`, data: grupoServicios });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Servicios in Sucursal.', data: error });
    }
};
exports.GetAllAvailableServices = GetAllAvailableServices;
const GetServiceById = (req, res) => {
    const id = Number(req.params.id);
    try {
        const result = (0, global_state_1.getServiceById)(id);
        if (result === null)
            return res.status(404).json({ success: false, message: `No Service was found with id: ${id}` });
        return res.json({ success: true, message: 'Seervice data was successfully recovery', data: result });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server status error finding Seervice data.', data: error });
    }
};
exports.GetServiceById = GetServiceById;
const StoreNewServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const result = yield prisma.$transaction(data.map(entry => prisma.servicios.create({ data: entry })));
        if (result === undefined) {
            return res.status(400).json({ success: false, message: "Algunos registros de servicios no se crearon" });
        }
        (0, global_state_1.refreshPersistentData)();
        return res.json({ success: true, message: 'Servicio data was successfully created', data: result });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error creating Servicios.', data: error });
    }
});
exports.StoreNewServices = StoreNewServices;
const UpdateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = req.body;
    try {
        const result = yield prisma.servicios.update({
            where: { id }, data
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: 'Servicio data was successfully updated', data: result });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error updating Servicio id: ${id} data.`, data: error });
    }
});
exports.UpdateService = UpdateService;
const DeleteService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const result = yield prisma.servicios.delete({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: "Servicio was update successfully!", data: result });
    }
    catch (error) {
        console.error(`Error trying delete Servicio id: ${id}`, { error });
        return res.status(404).json({ success: false, message: `Error trying delete Servicio id: ${id}`, data: error });
    }
});
exports.DeleteService = DeleteService;
