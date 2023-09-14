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
exports.DeleteDepartment = exports.AddServicesToDepartment = exports.UpdateDepartment = exports.StoreNewDepartmentWithServices = exports.StoreNewDepartment = exports.GetDepartmentById = exports.getAllDepartments = void 0;
const client_1 = require("@prisma/client");
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
            const sucursalDepartamento = yield prisma.departamentos_sucursales.create({
                data: {
                    sucursal_id: query.sucursal_id,
                    departamento_id: nuevoDepartamento.id
                }
            });
            const servicios = yield prisma.servicios.findMany();
            yield prisma.$transaction([
                ...data.servicios.data.map(servicio => {
                    const type = data.servicios.serviceField;
                    if (type === 'id') {
                        return prisma.servicios_departamentos_sucursales.create({
                            data: {
                                servicio_id: Number(servicio),
                                departamento_sucursal_refId: sucursalDepartamento.refId
                            },
                            select: { servicio: true }
                        });
                    }
                    if (type === 'nombre_corto') {
                        const idServicio = servicios.filter(service => service.nombre_corto === servicio)[0];
                        return prisma.servicios_departamentos_sucursales.create({
                            data: {
                                servicio_id: idServicio.id,
                                departamento_sucursal_refId: sucursalDepartamento.refId
                            },
                            select: { servicio: true }
                        });
                    }
                    // Prefijo
                    const idServicio = servicios.filter(service => service.prefijo === servicio)[0];
                    return prisma.servicios_departamentos_sucursales.create({
                        data: {
                            servicio_id: idServicio.id,
                            departamento_sucursal_refId: sucursalDepartamento.refId
                        },
                        select: { servicio: true }
                    });
                })
            ]);
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
    const params = req.params;
    const data = req.body;
    try {
        yield prisma.$connect();
        const findDepartamento = yield prisma.departamentos.findFirst({
            where: { id: params.id }
        });
        if (findDepartamento === null) {
            return res.status(404).json({ success: false, message: `Departamento with id ${params.id} not found` });
        }
        const sucursalDepartamento = yield prisma.departamentos_sucursales.upsert({
            where: {
                departamento_id_sucursal_id: {
                    sucursal_id: data.sucursal_id,
                    departamento_id: findDepartamento.id
                }
            },
            create: {
                sucursal_id: data.sucursal_id,
                departamento_id: findDepartamento.id
            },
            update: {
                sucursal_id: data.sucursal_id,
                departamento_id: findDepartamento.id
            }
        });
        const servicios = yield prisma.servicios.findMany();
        const relatedServices = yield prisma.$transaction([
            ...data.servicios.data.map(servicio => {
                const type = data.servicios.serviceField;
                if (type === 'id') {
                    return prisma.servicios_departamentos_sucursales.create({
                        data: {
                            servicio_id: Number(servicio),
                            departamento_sucursal_refId: sucursalDepartamento.refId
                        },
                        select: { servicio: true }
                    });
                }
                if (type === 'nombre_corto') {
                    const idServicio = servicios.filter(service => service.nombre_corto === servicio)[0];
                    return prisma.servicios_departamentos_sucursales.create({
                        data: {
                            servicio_id: idServicio.id,
                            departamento_sucursal_refId: sucursalDepartamento.refId
                        },
                        select: { servicio: true }
                    });
                }
                // Prefijo
                const idServicio = servicios.filter(service => service.prefijo === servicio)[0];
                return prisma.servicios_departamentos_sucursales.create({
                    data: {
                        servicio_id: idServicio.id,
                        departamento_sucursal_refId: sucursalDepartamento.refId
                    },
                    select: { servicio: true }
                });
            })
        ]);
        return res.json({ success: true, message: 'Servicios in Departamento data was successfully added', data: Object.assign(Object.assign({}, findDepartamento), { relatedServices }) });
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
