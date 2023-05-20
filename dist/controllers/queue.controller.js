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
exports.DeleteQueue = exports.UpdateQueue = exports.StoreNewQueue = exports.GetQueueById = exports.GetAllQueues = void 0;
const queue_model_1 = require("../models/queue.model");
const filtering_1 = require("../utils/filtering");
const service_model_1 = require("../models/service.model");
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
const INPUT_TYPES_TURNOS = ['servicio_destino_id', 'sucursal_id', 'registrado_por_id'];
const OUTPUT_TYPES_TURNOS = ['id', 'secuencia_ticket', 'servicio_destino', 'servicio_actual', 'cola_posicion', 'cliente', 'createdAt', 'updateAt'];
exports.GetAllQueues = ((_req, res) => {
    (0, queue_model_1.GetAll)().then((queues => {
        const data = queues.map((queue) => {
            return (0, filtering_1.ObjectFiltering)(queue, OUTPUT_TYPES_TURNOS);
        });
        res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send({ error: error.message });
    }));
});
exports.GetQueueById = ((_req, res) => {
    res.send('Get Turno by ID');
});
exports.StoreNewQueue = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqData = req.body;
    if ((0, filtering_1.ObjectDifferences)(reqData, INPUT_TYPES_TURNOS).length > 0) {
        return res.status(400).json({ message: 'Incorrect or incomplete data in request', valid: INPUT_TYPES_TURNOS });
    }
    const nowDate = new Date(Date.now());
    const userId = res.locals.payload.id;
    const serviceRequest = yield (0, service_model_1.GetById)(reqData.servicio_destino_id);
    const lastQueuesInServiceToday = (yield (0, queue_model_1.GetsBy)({ servicio_destino_id: serviceRequest.id, sucursal_id: reqData.sucursal_id, createdAt: nowDate })).length + 1;
    const queueSecuency = serviceRequest.prefijo + lastQueuesInServiceToday;
    const data = Object.assign(Object.assign({}, reqData), { secuencia_ticket: queueSecuency, servicio_actual_id: 1, estado_turno_id: 1, cola_posicion: lastQueuesInServiceToday, cliente_id: 1, registrado_por_id: userId, createdAt: nowDate });
    (0, queue_model_1.Store)(data).then((newQueue) => {
        const data = (0, filtering_1.ObjectFiltering)(newQueue, OUTPUT_TYPES_TURNOS);
        return res.send({ message: 'Queue created successfully!', data });
    }).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error.code === 'P2000')
            return res.status(400).send({ error: 'A field is too longer.', message: error.message });
        return res.status(400).send({ error: error.message });
    }));
    return;
}));
exports.UpdateQueue = ((_req, res) => {
    res.send('Update a Turno');
});
exports.DeleteQueue = ((_req, res) => {
    res.send('Delete a Turno');
});
