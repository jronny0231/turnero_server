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
exports.DeleteUser = exports.UpdateUser = exports.StoreNewUser = exports.GetUserById = exports.GetAllUsers = void 0;
const client_1 = require("@prisma/client");
const filtering_1 = require("../utils/filtering");
const library_1 = require("@prisma/client/runtime/library");
const prisma = new client_1.PrismaClient;
const GetAllUsers = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usuarios = yield prisma.usuarios.findMany().finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (usuarios.length === 0)
            return res.status(404).json({ message: 'Usuarios data was not found' });
        return res.json({ success: true, message: 'Usuarios data was successfully recovery', data: usuarios });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Usuarios data.', data: error });
    }
});
exports.GetAllUsers = GetAllUsers;
const GetUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const usuario = yield prisma.usuarios.findFirst({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (usuario === null)
            return res.status(404).json({ message: `Usuario by id ${id} was not found` });
        return res.json({ success: true, message: `Usuario by id ${id} was successfully recovery`, data: usuario });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error getting usuario by id ${id}.`, data: error });
    }
});
exports.GetUserById = GetUserById;
const StoreNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        yield prisma.$connect();
        const password = yield (0, filtering_1.encryptPassword)(data.password);
        const usuario = yield prisma.usuarios.create({
            data: Object.assign(Object.assign({}, data), { password, agentes: undefined }),
            select: {
                id: true,
                username: true,
                agentes: true
            }
        });
        if (data.agente === undefined) {
            if (data.agente_id === undefined) {
                return res.json({ success: true, message: 'Usuario without Agente data was successfully store', data: usuario });
            }
            const agente = yield prisma.agentes.update({
                where: { id: data.agente_id },
                data: { usuario_id: usuario.id }
            });
            return res.json({ success: true, message: `Usuario with Agente_id ${agente.id} data was successfully store`, data: { usuario, agente } });
        }
        let tipo_agente_id = 0;
        if (data.agente.body.tipo_agente === undefined) {
            if (data.agente.body.tipo_agente_id === undefined) {
                return res.status(400).json({ success: false, message: `Could not create agente without agente_tipo_id or agente_tipo data` });
            }
            const tipo_agente = yield prisma.tipos_agentes.findFirst({
                where: { id: data.agente.body.tipo_agente_id }
            });
            if (tipo_agente === null) {
                return res.status(400).json({ success: false, message: `Could not create agente because agente_tipo_id not match` });
            }
            tipo_agente_id = tipo_agente.id;
        }
        else {
            const tipo_agente = yield prisma.tipos_agentes.create({
                data: Object.assign({}, data.agente.body.tipo_agente)
            });
            tipo_agente_id = tipo_agente.id;
        }
        const agente = yield prisma.agentes.create({
            data: Object.assign(Object.assign({}, data.agente.body), { usuario_id: usuario.id, tipo_agente: undefined, tipo_agente_id })
        });
        return res.json({ success: true, message: `Usuario with Agente_id ${agente.id} data was successfully store`, data: { usuario, agente } });
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
    finally {
        yield prisma.$disconnect();
    }
});
exports.StoreNewUser = StoreNewUser;
const UpdateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = req.body;
    try {
        const usuario = yield prisma.usuarios.update({
            where: { id }, data
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (usuario === null)
            return res.status(404).json({ message: `Usuario by id ${id} could not update` });
        return res.json({ success: true, message: `Usuario by id ${id} was successfully update`, data: usuario });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error updating Usuario by id ${id}.`, data: error });
    }
});
exports.UpdateUser = UpdateUser;
const DeleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const usuario = yield prisma.usuarios.delete({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (usuario === null)
            return res.status(404).json({ message: `Usuario by id ${id} could not be deleted` });
        return res.json({ success: true, message: `Usuario by id ${id} was successfully deleted`, data: usuario });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error deleting usuario by id ${id}.`, data: error });
    }
});
exports.DeleteUser = DeleteUser;
