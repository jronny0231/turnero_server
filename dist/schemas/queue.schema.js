"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateQueueState = exports.createQueueWithClient = void 0;
const zod_1 = require("zod");
exports.createQueueWithClient = zod_1.z.object({
    body: zod_1.z.object({
        servicio_destino_id: zod_1.z.number().gte(1).lte(23),
        sucursal_id: zod_1.z.number().gte(1).lte(3),
        cliente: zod_1.z.object({
            tipo_identificacion_id: zod_1.z.number().gte(1).lte(3),
            identificacion: zod_1.z.string().min(9).max(20),
            seguro_id: zod_1.z.number().gte(1).lte(2),
            es_tutor: zod_1.z.boolean(),
        })
    })
});
exports.updateQueueState = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.number().gte(1)
    }),
    body: zod_1.z.object({
        agente_id: zod_1.z.number().gte(1),
        servicio_id: zod_1.z.number().gte(1),
        turno_id: zod_1.z.number().gte(1),
        estado_turno_id: zod_1.z.number().gte(1).lte(7),
        razon_cancelado_id: zod_1.z.number().gte(1),
    })
});
