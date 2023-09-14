"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRelatedServicesToDepartment = exports.createDepartmentWithRelatedServices = exports.updateDepartment = exports.createDepartment = void 0;
const zod_1 = require("zod");
const service_schema_1 = require("./service.schema");
const departmentSchema = zod_1.z.object({
    descripcion: zod_1.z.string().min(4).max(30),
    siglas: zod_1.z.string().min(4).max(5)
        .regex(/^[A-Z]+$/, "Must contain only UPPERCASE character."),
});
exports.createDepartment = zod_1.z.object({
    query: zod_1.z.object({
        sucursal_id: zod_1.z.coerce.number().gte(1).optional()
    }),
    body: departmentSchema
});
exports.updateDepartment = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number().gte(1)
    }),
    query: zod_1.z.object({
        sucursal_id: zod_1.z.coerce.number().gte(1).optional()
    }),
    body: departmentSchema.partial()
});
exports.createDepartmentWithRelatedServices = zod_1.z.object({
    query: zod_1.z.object({
        sucursal_id: zod_1.z.coerce.number().gte(1).optional()
    }),
    body: zod_1.z.object({
        departamento: departmentSchema,
        servicios: service_schema_1.discriminateFilterService,
    }),
});
exports.addRelatedServicesToDepartment = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.coerce.number().gte(1)
    }),
    body: zod_1.z.object({
        sucursal_id: zod_1.z.coerce.number().gte(1),
        servicios: service_schema_1.discriminateFilterService,
    }),
});
