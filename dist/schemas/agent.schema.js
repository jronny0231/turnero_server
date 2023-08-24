"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAgentStatus = exports.createAgent = void 0;
const zod_1 = require("zod");
const user_schema_1 = require("./user.schema");
exports.createAgent = zod_1.z.object({
    body: zod_1.z.object({
        nombre: zod_1.z.string().min(1).max(30),
        descripcion: zod_1.z.string().min(1).max(50),
        grupo_servicio_id: zod_1.z.number().gte(1).lte(23),
        tipo_agente_id: zod_1.z.number().gte(1).lte(5),
        departamento_sucursal_id: zod_1.z.number().gte(1),
        usuario_id: zod_1.z.number().gte(1),
        estatus: zod_1.z.boolean().optional(),
        usuario: user_schema_1.createUser.pick({ body: true }).optional()
    })
});
exports.updateAgentStatus = zod_1.z.object({
    body: zod_1.z.object({
        esperando: zod_1.z.boolean(),
        servicios_destino_id: zod_1.z.tuple([zod_1.z.number().gte(1).lte(23)]),
    })
});
