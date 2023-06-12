"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.DeleteQueue = exports.UpdateQueue = exports.StoreNewQueue = exports.getActiveQueuesBySucursalId = exports.GetQueueById = exports.GetAllQueues = void 0;
const filtering_1 = require("../utils/filtering");
const queueModel = __importStar(require("../models/queue.model"));
const service_model_1 = require("../models/service.model");
const ticket_export_1 = require("../services/ticket.export");
/*
    id: number;
    secuencia_ticket: string;
    servicio_actual_id: number;
    servicio_destino_id: number;
    estado_turno_id: number;
    cola_posicion: number;
    cliente_id: number;
    sucursal_id: number;
    registrado_por_id: number;
    createdAt: Date;
    */
const INPUT_TYPES_TURNOS = ['tipo_identificacion_id', 'identificacion', 'es_tutor', 'servicio_destino_id', 'servicio_destino', 'servicio_prefijo', 'sucursal_id', 'sucursal'];
const OUTPUT_TYPES_TURNOS = ['id', 'secuencia_ticket', 'servicio_destino', 'servicio_actual', 'estado_turno', 'cola_posicion', 'cliente', 'createdAt', 'updateAt'];
const GetAllQueues = (_req, res) => {
    queueModel.GetAll().then((queues => {
        const data = queues.map((queue) => {
            return (0, filtering_1.ObjectFiltering)(queue, OUTPUT_TYPES_TURNOS);
        });
        res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send({ error: error.message });
    }));
};
exports.GetAllQueues = GetAllQueues;
const GetQueueById = (_req, res) => {
    res.send('Get Turno by ID');
};
exports.GetQueueById = GetQueueById;
/**
 * Function to get a list of queues that are currently open for processing
 * @param _req
 * @param _res
 * @returns {Promise<{}>}
 */
const getActiveQueuesBySucursalId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sucursal_id = Number(req.params.id);
    const queues = yield queueModel.GetsByWithDepartamento({ sucursal_id }, { param: 'estado_turno', field: 'descripcion', values: ['ESPERANDO', 'ATENDIENDO', 'EN_ESPERA'] });
    if (queues.length === 0) {
        return res.status(404).send({ error: 'No se encontraron turnos activos' });
    }
    const data = queues.map((queue) => {
        return (0, filtering_1.ObjectFiltering)(queue, [
            'id', 'secuencia_ticket', 'servicio_destino', 'departamento', 'estado_turno'
        ]);
    });
    return res.send({ success: true, data });
});
exports.getActiveQueuesBySucursalId = getActiveQueuesBySucursalId;
/**
 * Funcion principal que registra un nuevo turno en el sistema...
 * incluyendo los datos por defecto del cliente nuevo o enlazando si existe
 * procesando todos los datos por los parametros automaticos
 */
const StoreNewQueue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqData = req.body;
    if ((0, filtering_1.ObjectDifferences)(reqData, INPUT_TYPES_TURNOS).length > 0) {
        return res.status(400).json({ message: 'Incorrect or incomplete data in request', received: reqData, valid: INPUT_TYPES_TURNOS });
    }
    // Nombre del tutorado predefinido cuando es valido
    const defaultTutorado = 'sin definir';
    // Optiene la fecha actual
    const nowTimestamp = new Date(Date.now());
    const nowDate = new Date(nowTimestamp.getFullYear(), nowTimestamp.getMonth(), nowTimestamp.getDate());
    // Optiene el id del usuario logeado que emitio el turno
    const userId = res.locals.payload.id;
    // Optiene la sucursal a la que pertenece el agente del usuario logueado
    const officeId = reqData.sucursal_id;
    // Obtiene el estado de turno predeterminado para el nuevo turno
    const queueStateId = 1;
    // Obtiene el id del servicio siguiente con la prioridad mas alta en la tabla 'servicios_dependientes' (casos generales: Registro)
    const nextService = (yield (0, service_model_1.GetAllDependentsBySelectableId)(reqData.servicio_destino_id))[0];
    const nextServiceId = nextService ? nextService.servicio_dependiente_id : 17; // 17 Servicio: Registro
    // Obtiene la cantidad de turnos sen la cola del servicio siguiente y le suma 1 para setear la cola
    const queuesInServiceToday = yield queueModel.GetsBy({
        servicio_destino_id: reqData.servicio_destino_id,
        sucursal_id: officeId
    });
    const cola_posicion = queuesInServiceToday.length + 1;
    // Setea el codigo de Ticket para el nuevo turno
    const queueSecuency = reqData.servicio_prefijo + ('0' + cola_posicion).slice(-2);
    const queueData = {
        secuencia_ticket: queueSecuency,
        servicio_actual_id: nextServiceId,
        servicio_destino_id: Number(reqData.servicio_destino_id),
        estado_turno_id: queueStateId,
        cola_posicion,
        registrado_por_id: userId,
        sucursal_id: officeId,
        fecha_turno: nowDate,
        cliente: {
            tipo_identificacion_id: reqData.tipo_identificacion_id,
            identificacion: reqData.identificacion,
            nombre_tutorado: reqData.es_tutor ? defaultTutorado : null,
            registrado_por_id: userId,
        }
    };
    try {
        const newQueue = yield queueModel.StoreWithClient(queueData);
        const data = (0, filtering_1.ObjectFiltering)(newQueue, OUTPUT_TYPES_TURNOS);
        res.set('Content-Type', 'application/pdf');
        res.set('Content-Disposition', 'attachment; filename=ticket.pdf');
        new Promise(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const pdf = yield (0, ticket_export_1.exportPOSQueue)({
                sucursal: reqData.sucursal,
                secuencia_ticket: data.secuencia_ticket,
                servicio_destino: reqData.servicio_destino,
                createdAt: (_a = data.createdAt) !== null && _a !== void 0 ? _a : nowTimestamp,
            });
            return res.send(pdf);
        }));
        return res.json({ message: 'Queue created successfully!', data });
    }
    catch (error) {
        if (error.code === 'P2000')
            return res.status(400).send({ error: 'A field is too longer.', message: error.message });
        return res.status(400).send({ error: error.message });
    }
});
exports.StoreNewQueue = StoreNewQueue;
const UpdateQueue = (_req, res) => {
    res.send('Update a Turno');
};
exports.UpdateQueue = UpdateQueue;
const DeleteQueue = (_req, res) => {
    res.send('Delete a Turno');
};
exports.DeleteQueue = DeleteQueue;
