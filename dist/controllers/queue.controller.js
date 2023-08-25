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
exports.DeleteQueue = exports.UpdateQueue = exports.UpdateStateQueue = exports.GetToAttendQueue = exports.StoreNewQueue = exports.getActiveQueuesByClientId = exports.getActiveQueuesByDisplayId = exports.updateCallingsByDisplayId = exports.getNewCallingsByDisplayId = exports.GetQueueById = exports.GetAllQueues = void 0;
const client_1 = require("@prisma/client");
const global_state_1 = require("../core/global.state");
const flow_manage_1 = require("../core/flow.manage");
const prisma = new client_1.PrismaClient();
const GetAllQueues = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const turnos = yield prisma.turnos.findMany().finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (turnos.length === 0)
            return res.status(404).json({ message: 'Turnos data was not found' });
        return res.json({ success: true, message: 'Turnos data was successfully recovery', data: turnos });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Turnos data.', data: error });
    }
});
exports.GetAllQueues = GetAllQueues;
const GetQueueById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const result = yield prisma.turnos.findFirst({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (result === null)
            return res.status(404).json({ success: false, message: `No Turno was found with id: ${id}` });
        return res.json({ success: true, message: 'Turno data was successfully recovery', data: result });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server status error finding Turno data.', data: error });
    }
});
exports.GetQueueById = GetQueueById;
const getNewCallingsByDisplayId = (_req, res) => {
    const key = res.locals.display;
    const data = (0, global_state_1.getCallQueueState)({ displayUUID: key });
    if (data === null) {
        return res.status(404).json({ success: false, message: 'No Turnos pending to call found', data });
    }
    return res.json({ success: true, message: 'Turno calling data successfully getted ', data });
};
exports.getNewCallingsByDisplayId = getNewCallingsByDisplayId;
const updateCallingsByDisplayId = (req, res) => {
    const displayUUID = res.locals.display;
    const { estatus } = req.body;
    const state_id = Number(req.params.id);
    const result = (0, global_state_1.setCallQueueState)({ state_id, displayUUID, estatus });
    return res.json({ success: true, data: result });
};
exports.updateCallingsByDisplayId = updateCallingsByDisplayId;
const getActiveQueuesByDisplayId = (_req, res) => {
    try {
        const displayUUID = res.locals.display;
        const turnos = (0, global_state_1.getActiveQueueList)({ displayUUID });
        if (turnos === null)
            return res.status(404).json({ success: false, message: 'No active Turnos to display', data: turnos });
        const data = turnos.map((turno) => {
            return {
                id: turno.id,
                secuencia_ticket: turno.secuencia_ticket,
                servicio: turno.activo.servicio.descripcion,
                agente: turno.activo.agente.nombre,
                destino: turno.activo.departamento.descripcion
            };
        });
        const columns = [
            {
                name: "secuencia_ticket",
                label: "TURNO",
                widthPercent: 0.2,
                isBold: true,
            }, {
                name: "agente",
                label: "AGENTE",
                widthPercent: 0.3,
                isBold: false,
            }, {
                name: "servicio_destino",
                label: "SERVICIO",
                widthPercent: 0.5,
                isBold: false,
            }
        ];
        return res.json({ success: true, data: { columns, data } });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server status error finding active Turnos.', data: error });
    }
};
exports.getActiveQueuesByDisplayId = getActiveQueuesByDisplayId;
const getActiveQueuesByClientId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cliente_id = Number(req.params.id);
    try {
        const turnos = yield prisma.turnos.findMany({
            where: { cliente_id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (turnos === null)
            return res.status(404).json({ success: false, message: 'No active Turnos to display', data: null });
        return res.json({ success: true, message: `Turnos by cliente_id: ${cliente_id} successfully getted`, data: turnos });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: `Server status error finding all Turnos by cliente_id: ${cliente_id}`, data: error });
    }
});
exports.getActiveQueuesByClientId = getActiveQueuesByClientId;
/**
 * Funcion principal que registra un nuevo turno en el sistema...
 * incluyendo los datos por defecto del cliente nuevo o enlazando si existe
 * procesando todos los datos por los parametros automaticos
 */
const StoreNewQueue = (req, res) => {
    const body = req.body;
    /**  Syncronous operations, perform response waiting for  **/
    try {
        const nowTimestamp = new Date(Date.now()); // Otiene la fecha actual
        //const nowDate: Date = new Date(nowTimestamp.getFullYear(), nowTimestamp.getMonth(), nowTimestamp.getDate())
        // Obtiene el id del usuario logeado que emitio el turno
        const registrado_por_id = res.locals.payload.id;
        // Cantidad de ceros en la secuencia del ticket
        const cantPosMark = 2;
        const servicio_destino = (0, global_state_1.getServiceById)(body.servicio_destino_id);
        if (servicio_destino === null)
            return res.status(404).json({ success: false, message: 'Could not found servicio requested to turno' });
        const secuencia = (0, global_state_1.getQueuesListByService)({
            servicio_destino_id: servicio_destino.id,
            sucursal_id: body.sucursal_id
        }).length + 1;
        const secuencia_ticket = servicio_destino.prefijo + ('0' + secuencia).slice(cantPosMark * -1);
        const response = {
            secuencia_ticket,
            servicio_destino: servicio_destino.descripcion,
            createdAt: nowTimestamp.toLocaleString()
        };
        new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                yield prisma.$connect();
                const cliente = () => __awaiter(void 0, void 0, void 0, function* () {
                    const clienteFound = yield prisma.clientes.findFirst({
                        where: { identificacion: body.cliente.identificacion }
                    });
                    if (clienteFound)
                        return clienteFound;
                    return yield prisma.clientes.create({
                        data: Object.assign(Object.assign({}, body.cliente), { registrado_por_id, nombre_tutorado: (body.cliente.es_tutor ? 'sin_definir' : undefined) })
                    });
                });
                const servicio_actual_id = yield (0, flow_manage_1.getUnrelatedFirstService)({
                    seguro_id: (_a = (yield cliente()).seguro_id) !== null && _a !== void 0 ? _a : 0,
                    sucursal_id: body.sucursal_id,
                    servicio_destino_id: servicio_destino.id
                });
                const cola_posicion = (0, global_state_1.getQueuesListByService)({
                    servicio_actual_id: servicio_actual_id,
                    sucursal_id: body.sucursal_id
                }).length + 1;
                const turno = yield prisma.turnos.create({
                    data: {
                        secuencia_ticket,
                        cliente_id: (yield cliente()).id,
                        servicio_actual_id,
                        servicio_destino_id: servicio_destino.id,
                        cola_posicion,
                        registrado_por_id,
                        sucursal_id: body.sucursal_id,
                        fecha_turno: nowTimestamp.toLocaleDateString()
                    }
                });
                (0, global_state_1.addNewQueueState)({ turno });
                resolve(turno);
            }
            catch (error) {
                console.error("Error when create new Turno in Promise clousure", { error });
                if (error.code === 'P2000')
                    console.error({ success: false, error: 'A field is too longer.', message: error.message });
                return reject(error);
            }
        })).then(console.log)
            .finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: "Turno was created successfully!", data: response });
    }
    catch (error) {
        console.error(`Error trying to create a new turno sync on ${Date.now().toLocaleString()}`, { error });
        return res.status(500).json({ success: false, message: `Error trying to create a new turno sync on ${Date.now().toLocaleString()}`, data: error });
    }
};
exports.StoreNewQueue = StoreNewQueue;
const GetToAttendQueue = (res) => {
    const usuario_id = res.locals.payload.id;
    try {
        const turno = (0, global_state_1.getAttendingQueueByUserId)({ usuario_id });
        if (turno === null)
            return res.status(404).json({ success: false, message: 'No active Turnos to display', data: null });
        return res.json({ success: true, message: 'Active Turno was found', data: turno });
    }
    catch (error) {
        console.error(`Error trying to get current attending Turno with user_id: ${usuario_id}`, { error });
        return res.status(500).json({ success: false, message: `Error trying to get current attending Turno with user_id: ${usuario_id}`, data: error });
    }
};
exports.GetToAttendQueue = GetToAttendQueue;
const UpdateStateQueue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id: turno_id } = req.params;
    try {
        if (body.servicio_id === undefined || body.agente_id === undefined || body.estado_turno_id === undefined) {
            return res.status(404).json({ success: false, message: "Data receive is incomplet or bad formed" });
        }
        const isUpdate = yield (0, global_state_1.setAttendingState)(Object.assign(Object.assign({}, body), { turno_id }));
        if (isUpdate)
            return res.json({ success: true, message: "Turno status was updated successfully!", data: isUpdate });
        return res.status(404).json({ success: false, message: "Turno status could not updated", data: isUpdate });
    }
    catch (error) {
        console.error(`Error trying update Status Turno id: ${turno_id} with status_turno_id: ${body.estado_turno_id}`, { error });
        return res.status(500).json({ success: false, message: `Error trying update Status Turno id: ${turno_id} with status_turno_id: ${body.estado_turno_id}`, data: error });
    }
});
exports.UpdateStateQueue = UpdateStateQueue;
const UpdateQueue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const id = Number(req.params.id);
    try {
        yield prisma.$connect();
        const result = yield prisma.turnos.update({
            where: { id },
            data: Object.assign({}, body)
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: "Turno was update successfully!", data: result });
    }
    catch (error) {
        console.error(`Error trying update Turno id: ${id}`, { error });
        if (error.code === 'P2000')
            return res.status(400).json({ success: false, error: 'A field is too longer.', message: error.message });
        return res.status(500).json({ success: false, message: `Error trying update Turno id: ${id}`, data: error });
    }
});
exports.UpdateQueue = UpdateQueue;
const DeleteQueue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const result = yield prisma.turnos.delete({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: "Turno was update successfully!", data: result });
    }
    catch (error) {
        console.error(`Error trying delete Turno id: ${id}`, { error });
        return res.status(404).json({ success: false, message: `Error trying delete Turno id: ${id}`, data: error });
    }
});
exports.DeleteQueue = DeleteQueue;
/*
const validateNewTurno = (data: NuevoTurnoType) => {
    return z.object({
        servicio_destino_id: z.number().gte(1).lte(23),
        sucursal_id: z.number().gte(1).lte(3),
        cliente: z.object({
            tipo_identificacion_id: z.number().gte(1).lte(3),
            identificacion: z.string()
            .min(
                data.cliente.tipo_identificacion_id === 1 ? 11
                : data.cliente.tipo_identificacion_id === 2 ? 9
                    : data.cliente.tipo_identificacion_id === 3 ? 10 : 0)
            .max(
                data.cliente.tipo_identificacion_id === 1 ? 13
                : data.cliente.tipo_identificacion_id === 2 ? 11
                    : data.cliente.tipo_identificacion_id === 3 ? 20 : 0
            ),
            seguro_id: z.number().gte(1).lte(2),
            es_tutor: z.boolean(),
        })
    }).parse(data)
}
*/ 
