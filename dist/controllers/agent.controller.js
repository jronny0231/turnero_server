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
exports.DeleteAgent = exports.UpdateAgentQueueStatus = exports.UpdateAgent = exports.StoreNewAgent = exports.GetAgentById = exports.GetAllAgents = void 0;
const client_1 = require("@prisma/client");
const filtering_1 = require("../utils/filtering");
const global_state_1 = require("../core/global.state");
const prisma = new client_1.PrismaClient;
const GetAllAgents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agentes = yield prisma.agentes.findMany().finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (agentes.length === 0)
            return res.status(404).json({ message: 'Agentes data was not found' });
        return res.json({ success: true, message: 'Agentes data was successfully recovery', data: agentes });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Agentes data.', data: error });
    }
});
exports.GetAllAgents = GetAllAgents;
const GetAgentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const agente = yield prisma.agentes.findFirst({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (agente === null)
            return res.status(404).json({ message: `Agente id ${id} data was not found` });
        return res.json({ success: true, message: `Agente id: ${id} data was successfully recovery`, data: agente });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error getting Agente id: ${id} data.`, data: error });
    }
});
exports.GetAgentById = GetAgentById;
const StoreNewAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        yield prisma.$connect();
        let newUserId = data.usuario_id;
        if (data.usuario !== undefined) {
            const userData = data.usuario.body;
            const findUser = yield prisma.usuarios.findFirst({
                where: { username: userData.username }
            });
            if (findUser !== null) {
                return res.status(400).json({ success: false, message: "User data is already registred" });
            }
            const password = yield (0, filtering_1.encryptPassword)(userData.password);
            newUserId = (yield prisma.usuarios.create({
                data: Object.assign(Object.assign({}, userData), { password })
            })).id;
        }
        if (newUserId === undefined) {
            return res.status(404).json({ message: 'Agente cant be created without user data or usuario_id' });
        }
        const nuevoAgente = yield prisma.agentes.create({
            data: Object.assign(Object.assign({}, data), { usuario: undefined, usuario_id: newUserId })
        });
        return res.json({ success: true, message: 'Agente data was successfully created', data: nuevoAgente });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error creating new Agente.', data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.StoreNewAgent = StoreNewAgent;
const UpdateAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const data = req.body;
    try {
        const result = yield prisma.agentes.update({
            where: { id }, data
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: 'Agente data was successfully updated', data: result });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error updating Agente id: ${id} data.`, data: error });
    }
});
exports.UpdateAgent = UpdateAgent;
const UpdateAgentQueueStatus = (req, res) => {
    const usuario_id = res.locals.payload.id;
    const data = req.body;
    try {
        const result = (0, global_state_1.setWaitingState)(Object.assign(Object.assign({}, data), { usuario_id }));
        if (result === false) {
            return res.status(404).json({ success: false,
                message: `Agente with usuario id ${usuario_id} availability was not updated` });
        }
        return res.json({ success: true, message: `Agente with usuario id ${usuario_id} availability was updated!` });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error updating Agente availability usuario_id: ${usuario_id} data.`, data: error });
    }
};
exports.UpdateAgentQueueStatus = UpdateAgentQueueStatus;
const DeleteAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const result = yield prisma.agentes.delete({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: "Agente was update successfully!", data: result });
    }
    catch (error) {
        console.error(`Error trying delete Agente id: ${id}`, { error });
        return res.status(404).json({ success: false, message: `Error trying delete Agente id: ${id}`, data: error });
    }
});
exports.DeleteAgent = DeleteAgent;
