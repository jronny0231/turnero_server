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
exports.DeleteRoleAndPermissions = exports.UpdateRoleAndPermissions = exports.StoreNewRole = exports.GetRoleAndPermissionsById = exports.GetAllRolesAndPermissions = void 0;
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const prisma = new client_1.PrismaClient;
const GetAllRolesAndPermissions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield prisma.roles.findMany({
            include: {
                roles_permisos: {
                    include: { permiso: true }
                }
            }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (roles.length === 0)
            return res.status(404).json({ message: 'Roles data was not found' });
        return res.json({ success: true, message: 'Roles data was successfully recovery', data: roles });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Roles data.', data: error });
    }
});
exports.GetAllRolesAndPermissions = GetAllRolesAndPermissions;
const GetRoleAndPermissionsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const role = yield prisma.roles.findFirst({
            where: { id },
            include: {
                roles_permisos: {
                    include: { permiso: true }
                }
            }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (role === null)
            return res.status(404).json({ message: `role by id ${id} was not found` });
        return res.json({ success: true, message: `role by id ${id} was successfully recovery`, data: role });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error getting usuario by id ${id}.`, data: error });
    }
});
exports.GetRoleAndPermissionsById = GetRoleAndPermissionsById;
/**
 * Debe poder almacenar un nuevo registro en la tabla Roles
 * y ademas registros de vinculacion mucho a mucho con la tabla
 * Roles_permisos con sus valores booleanos definidos con
 * al menos un valor CRUD en true
 * @param req
 * @param res
 * @returns
 */
const StoreNewRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        return res.json({ sucess: true, message: ``, data });
    }
    catch (error) {
        if (error instanceof library_1.PrismaClientKnownRequestError) {
            if (error.code === 'P2000')
                return res.status(400).send({ error: 'A field is too longer.', message: error.message });
            if (error.code === 'P2002')
                return res.status(400).send({ error: 'Same user data already registred.', message: error.message });
        }
        return res.status(500).json({ message: 'Server status error creating Grupos_servicios data.', data: error });
    }
});
exports.StoreNewRole = StoreNewRole;
/**
 * Debe poder actualizar tanto los datos de registro del Rol
 * como tambien los permisos en la tabla Roles_Permisos con
 * al menos un valor CRUD en true
 * @param req
 * @param res
 * @returns
 */
const UpdateRoleAndPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = req.body;
    try {
        return res.json({ success: true, message: ``, data });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error updating Role and Permissions by id ${id}.`, data: error });
    }
});
exports.UpdateRoleAndPermissions = UpdateRoleAndPermissions;
const DeleteRoleAndPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const role = yield prisma.roles.delete({
            where: { id },
            include: { roles_permisos: true }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (role === null)
            return res.status(404).json({ message: `Role by id ${id} could not be deleted` });
        return res.json({ success: true, message: `Role by id ${id} was successfully deleted`, data: role });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error deleting Role by id ${id}.`, data: error });
    }
});
exports.DeleteRoleAndPermissions = DeleteRoleAndPermissions;
