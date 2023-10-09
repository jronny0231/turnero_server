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
exports.createSucursalDepartamentoServicios = exports.DeleteDepartment = exports.AddServicesToDepartment = exports.UpdateDepartment = exports.StoreNewDepartmentWithServices = exports.StoreNewDepartment = exports.GetDepartmentById = exports.getAllDepartments = void 0;
const client_1 = require("@prisma/client");
const service_controller_1 = require("./service.controller");
const prisma = new client_1.PrismaClient;
const getAllDepartments = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const departamentos = yield prisma.departamentos.findMany().finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (departamentos.length === 0)
            return res.status(404).json({ message: 'Departamentos data was not found' });
        return res.json({ success: true, message: 'Departamentos data was successfully recovery', data: departamentos });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Departamentos data.', data: error });
    }
});
exports.getAllDepartments = getAllDepartments;
const GetDepartmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const departamento = yield prisma.departamentos.findFirst({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (departamento === null)
            return res.status(404).json({ message: `Departamento id ${id} data was not found` });
        return res.json({ success: true, message: `Departamento id: ${id} data was successfully recovery`, data: departamento });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error getting Departamento id: ${id} data.`, data: error });
    }
});
exports.GetDepartmentById = GetDepartmentById;
const StoreNewDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const data = req.body;
    try {
        const nuevoDepartamento = yield prisma.departamentos.create({
            data
        });
        if (query.sucursal_id) {
            yield prisma.departamentos_sucursales.create({
                data: {
                    sucursal_id: query.sucursal_id,
                    departamento_id: nuevoDepartamento.id
                }
            });
        }
        return res.json({ success: true, message: 'Departamento data was successfully created', data: nuevoDepartamento });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error creating new Departamento.', data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.StoreNewDepartment = StoreNewDepartment;
const StoreNewDepartmentWithServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const data = req.body;
    try {
        yield prisma.$connect();
        const nuevoDepartamento = yield prisma.departamentos.create({
            data: data.departamento
        });
        if (query.sucursal_id) {
            const result = yield (0, exports.createSucursalDepartamentoServicios)({
                sucursal_id: query.sucursal_id,
                departamento_id: nuevoDepartamento.id,
                servicios: data.servicios
            });
            return res.json({
                success: true,
                message: 'Departamento in sucursal with servicios data was successfully created',
                data: result
            });
        }
        const sucursales = yield prisma.sucursales.findMany({ select: { id: true } });
        if (sucursales.length > 0) {
            const results = [];
            for (const sucursal of sucursales) {
                const result = yield (0, exports.createSucursalDepartamentoServicios)({
                    sucursal_id: sucursal.id,
                    departamento_id: nuevoDepartamento.id,
                    servicios: data.servicios
                });
                results.push(result);
            }
            return res.json({
                success: true,
                message: 'Departamento in all sucursales with servicios data was successfully created',
                data: results
            });
        }
        return res.json({ success: true, message: 'Departamento with servicios data was successfully created', data: nuevoDepartamento });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error creating new Departamento with servicios.', data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.StoreNewDepartmentWithServices = StoreNewDepartmentWithServices;
const UpdateDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = req.body;
    try {
        const result = yield prisma.departamentos.update({
            where: { id }, data
        });
        return res.json({ success: true, message: 'Departamento data was successfully updated', data: result });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error updating Departamento id: ${id} data.`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.UpdateDepartment = UpdateDepartment;
const AddServicesToDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params);
    const data = req.body;
    try {
        yield prisma.$connect();
        const findDepartamento = yield prisma.departamentos.findFirst({
            where: { id }
        });
        if (findDepartamento === null) {
            return res.status(404).json({ success: false, message: `Departamento with id ${id} not found` });
        }
        const result = yield (0, exports.createSucursalDepartamentoServicios)({
            sucursal_id: data.sucursal_id,
            departamento_id: findDepartamento.id,
            servicios: data.servicios
        });
        return res.json({
            success: true,
            message: 'Departamento in sucursal with servicios data was successfully created',
            data: result
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error adding servicios in Departamento.', data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.AddServicesToDepartment = AddServicesToDepartment;
const DeleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const result = yield prisma.departamentos.delete({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: "Departamento was deleted successfully!", data: result });
    }
    catch (error) {
        console.error(`Error trying delete Departamento id: ${id}`, { error });
        return res.status(404).json({ success: false, message: `Error trying delete Departamento id: ${id}`, data: error });
    }
});
exports.DeleteDepartment = DeleteDepartment;
/**
 * Create sucursal_departament_services related
 */
const createSucursalDepartamentoServicios = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const sucursalDepartamento = yield prisma.departamentos_sucursales.upsert({
        where: {
            departamento_id_sucursal_id: {
                sucursal_id: data.sucursal_id,
                departamento_id: data.departamento_id
            }
        },
        create: {
            sucursal_id: data.sucursal_id,
            departamento_id: data.departamento_id
        },
        update: {
            sucursal_id: data.sucursal_id,
            departamento_id: data.departamento_id
        },
        select: {
            refId: true,
            sucursal: { select: { descripcion: true } },
            departamento: { select: { descripcion: true } }
        }
    });
    const services_id = (0, service_controller_1.getIdsFromDiscriminatedSearch)(data.servicios);
    const relatedServices = yield prisma.$transaction([
        ...services_id.map(servicio_id => prisma.servicios_departamentos_sucursales.create({
            data: {
                servicio_id,
                departamento_sucursal_refId: sucursalDepartamento.refId
            }
        }))
    ]);
    return {
        sucursal: sucursalDepartamento.sucursal.descripcion,
        departamento: sucursalDepartamento.departamento.descripcion,
        servicios: relatedServices
    };
});
exports.createSucursalDepartamentoServicios = createSucursalDepartamentoServicios;
