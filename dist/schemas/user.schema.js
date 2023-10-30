"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordChange = exports.userCredential = exports.updateUser = exports.createUser = exports.userSchema = void 0;
const zod_1 = require("zod");
const agent_schema_1 = require("./agent.schema");
exports.userSchema = zod_1.z.object({
    nombres: zod_1.z.string().min(1).max(50),
    correo: zod_1.z.string().email().max(60),
    username: zod_1.z.string().min(3).max(15)
        .regex(/^[a-zA-Z0-9_]+$/, "Must contains only letters, numbers and underscores"),
    password: zod_1.z.string().min(8).max(80)
        .regex(/^(?=.*[a-z]).+$/, "Must contain at least one LOWERCASE letter")
        .regex(/^(?=.*[A-Z]).+$/, "Must contain at least one UPPERCASE letter")
        .regex(/^(?=.*[-+_!@#$%^&*., ?]).+$/, "Must contain at least one SPECIAL character")
        .regex(/^(?=.*\d).+$/, "Must contain at least one NUMBER"),
    rol_id: zod_1.z.number().gte(1),
    agente_id: zod_1.z.coerce.number().gte(1),
    agente: agent_schema_1.createAgent
});
exports.createUser = zod_1.z.object({
    body: exports.userSchema.partial({
        agente: true,
        agente_id: true,
    }).omit({
        password: true
    })
});
exports.updateUser = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.number().gte(1)
    }),
    body: exports.userSchema.pick({
        username: true,
        correo: true,
        rol_id: true,
        agente: true
    }).partial()
});
exports.userCredential = zod_1.z.object({
    body: exports.userSchema.pick({
        username: true,
        password: true
    })
});
exports.passwordChange = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.number().gte(1)
    }),
    body: exports.userSchema.pick({
        password: true
    })
});
