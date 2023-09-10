"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAgentStatus = exports.createAgent = void 0;
const zod_1 = require("zod");
const agentTypeSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    nombre: zod_1.z.string().min(1).max(25),
    nombre_corto: zod_1.z.string().min(1).max(5).regex(/^[A-Z]+$/, "Letters must be in UPPERCASE"),
    descripcion: zod_1.z.string().min(1).max(50),
    grupo_servicio_id: zod_1.z.coerce.number().gte(1),
    estatus: zod_1.z.coerce.boolean()
});
const agentSchema = zod_1.z.object({
    id: zod_1.z.coerce.number().gte(1),
    nombre: zod_1.z.string().min(1).max(30),
    descripcion: zod_1.z.string().min(1).max(50),
    tipo_agente_id: zod_1.z.number().gte(1),
    tipo_agente: agentTypeSchema.omit({ id: true, estatus: true, }),
    departamentos_sucursal_id: zod_1.z.number().gte(1),
    estatus: zod_1.z.boolean().optional(),
    usuario_id: zod_1.z.number().gte(1).optional()
});
exports.createAgent = zod_1.z.object({
    body: agentSchema.omit({
        id: true,
        estatus: true,
    }).partial({
        tipo_agente: true,
        tipo_agente_id: true
    })
});
exports.updateAgentStatus = zod_1.z.object({
    params: agentSchema.pick({ id: true }),
    body: agentSchema.omit({
        id: true
    }).partial()
});
