"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAgentStatus = exports.createAgent = exports.agentSchema = void 0;
const zod_1 = require("zod");
exports.agentSchema = zod_1.z.object({
    nombre: zod_1.z.string().min(1).max(30),
    descripcion: zod_1.z.string().min(1).max(50),
    tipo_agente_id: zod_1.z.number().gte(1),
    departamentos_sucursal_id: zod_1.z.number().gte(1),
    estatus: zod_1.z.boolean().optional(),
    usuario_id: zod_1.z.number().gte(1).optional()
});
exports.createAgent = zod_1.z.object({
    body: exports.agentSchema
});
exports.updateAgentStatus = zod_1.z.object({
    body: zod_1.z.object({
        esperando: zod_1.z.boolean(),
        agente_id: zod_1.z.number().gte(1),
        servicios_destino_id: zod_1.z.tuple([zod_1.z.number().gte(1).lte(23)]),
    })
});
