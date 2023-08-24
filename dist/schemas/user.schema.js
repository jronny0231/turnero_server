"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordChange = exports.userCredential = exports.updateUser = exports.createUser = void 0;
const zod_1 = require("zod");
const userSchema = zod_1.z.object({
    nombres: zod_1.z.string().min(1).max(50),
    correo: zod_1.z.string().email().max(60),
    username: zod_1.z.string().min(4).max(15)
        .regex(/^[a-zA-Z][a-zA-Z0-9]*_[a-zA-Z0-9]*$/, "Must start with uppercase and only include letters, numbers and one underscore"),
    password: zod_1.z.string().min(8).max(80)
        .regex(/^(?=.*[a-z]).+$/, "Must contain at least one LOWERCASE letter")
        .regex(/^(?=.*[A-Z]).+$/, "Must contain at least one UPPERCASE letter")
        .regex(/^(?=.*[-+_!@#$%^&*., ?]).+$/, "Must contain at least one SPECIAL character")
        .regex(/^(?=.*\d).+$/, "Must contain at least one NUMBER"),
    rol_id: zod_1.z.number().min(1),
});
exports.createUser = zod_1.z.object({
    body: userSchema
});
exports.updateUser = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.number().gte(1)
    }),
    body: userSchema.pick({
        username: true,
        correo: true,
        rol_id: true
    }).partial()
});
exports.userCredential = zod_1.z.object({
    body: userSchema.pick({
        username: true,
        password: true
    })
});
exports.passwordChange = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.number().gte(1)
    }),
    body: zod_1.z.object({
        currentPassword: userSchema.pick({ password: true }),
        newPassword: userSchema.pick({ password: true }),
        repeatPassword: userSchema.pick({ password: true })
    })
});
