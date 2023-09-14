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
exports.DeleteSchedule = exports.UpdateSchedule = exports.StoreNewSchedule = exports.GetSchedulesById = exports.GetAllSchedules = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const GetAllSchedules = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schedules = yield prisma.visitas_agendadas.findMany().finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (schedules.length === 0)
            return res.status(404).json({ message: 'Schedules data was not found' });
        return res.json({ success: true, message: 'Schedules data was successfully recovery', data: schedules });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Schedules data.', data: error });
    }
});
exports.GetAllSchedules = GetAllSchedules;
const GetSchedulesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const schedule = yield prisma.visitas_agendadas.findFirst({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (schedule === null)
            return res.status(404).json({ message: `Schedule data with id: ${id} was not found` });
        return res.json({ success: true, message: `Schedule with id: ${id} was successfully recovery`, data: schedule });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Schedules data.', data: error });
    }
});
exports.GetSchedulesById = GetSchedulesById;
const StoreNewSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const data = req.body;
    const registrado_por_id = res.locals.payload.id;
    try {
        let tipo_visita_id = (_a = data.tipo_visita_id) !== null && _a !== void 0 ? _a : 0;
        let clientes_id = [{ id: (_b = data.cliente_id) !== null && _b !== void 0 ? _b : 0 }];
        yield prisma.$connect();
        if (data.clientes !== undefined) {
            const clients = yield prisma.$transaction([
                ...data.clientes.map(cliente => {
                    return prisma.clientes.upsert({
                        where: {
                            identificacion: cliente.body.identificacion,
                            tipo_identificacion_id: cliente.body.tipo_identificacion_id,
                        },
                        update: Object.assign(Object.assign({}, cliente), { tipo_identificacion: undefined }),
                        create: Object.assign(Object.assign({}, cliente.body), { seguro: undefined, tipo_identificacion: undefined, registrado_por_id }),
                        select: {
                            id: true
                        }
                    });
                })
            ]);
            clientes_id = clients;
        }
        if (tipo_visita_id === 0) {
            if (data.tipo_visita === undefined) {
                return res.status(400).json({ success: false, messsage: "Tipo_visita or tipo_visita_id not received" });
            }
            let tipo_visita = yield prisma.tipos_visitas.findFirst({
                where: {
                    nombre: data.tipo_visita.nombre
                }
            });
            if (tipo_visita === null) {
                tipo_visita = yield prisma.tipos_visitas.create({
                    data: Object.assign({}, data.tipo_visita)
                });
            }
            tipo_visita_id = tipo_visita.id;
        }
        const result = yield prisma.$transaction([
            ...clientes_id.map(({ id: cliente_id }) => {
                return prisma.visitas_agendadas.create({
                    data: Object.assign(Object.assign({}, data), { cliente_id, tipo_visita: undefined, tipo_visita_id, registrado_por: registrado_por_id })
                });
            })
        ]);
        return res.json({ success: true, message: 'Schedule data was successfully created', data: result });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error creating new Schedule.', data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.StoreNewSchedule = StoreNewSchedule;
const UpdateSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        const result = yield prisma.visitas_agendadas.update({
            where: { id },
            data: Object.assign({}, data)
        });
        return res.json({ sucess: true, message: `Schedule id: ${id} was successfully updated`, data: result });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error updateing Schedule id ${id}`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.UpdateSchedule = UpdateSchedule;
const DeleteSchedule = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const result = yield prisma.visitas_agendadas.delete({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: "Schedule was deleted successfully!", data: result });
    }
    catch (error) {
        console.error(`Error trying delete Schedule id: ${id}`, { error });
        return res.status(404).json({ success: false, message: `Error trying delete Schedule id: ${id}`, data: error });
    }
});
exports.DeleteSchedule = DeleteSchedule;
