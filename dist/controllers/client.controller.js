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
exports.DeleteClient = exports.UpdateClient = exports.StoreNewClient = exports.GetClientsById = exports.GetAllClients = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const GetAllClients = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clientes = yield prisma.clientes.findMany().finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (clientes.length === 0)
            return res.status(404).json({ message: 'Clients data was not found' });
        return res.json({ success: true, message: 'Clients data was successfully recovery', data: clientes });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Clients data.', data: error });
    }
});
exports.GetAllClients = GetAllClients;
const GetClientsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const cliente = yield prisma.clientes.findFirst({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        if (cliente === null)
            return res.status(404).json({ message: `Client data with id: ${id} was not found` });
        return res.json({ success: true, message: `Client with id: ${id} was successfully recovery`, data: cliente });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error getting Clients data.', data: error });
    }
});
exports.GetClientsById = GetClientsById;
const StoreNewClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const registrado_por_id = res.locals.payload.id;
    try {
        let seguro_id = data.seguro_id;
        yield prisma.$connect();
        if (seguro_id === undefined) {
            if (data.seguro === undefined) {
                return res.status(400).json({ success: false, message: "Seguro or seguro_id not receive" });
            }
            let seguro = yield prisma.seguros.findFirst({
                where: { OR: [
                        { siglas: data.seguro.siglas },
                        { nombre_corto: data.seguro.nombre_corto },
                        { nombre: data.seguro.nombre }
                    ]
                }
            });
            if (seguro === null) {
                seguro = yield prisma.seguros.create({
                    data: Object.assign({}, data.seguro)
                });
            }
            seguro_id = seguro.id;
        }
        const nuevoCliente = yield prisma.clientes.create({
            data: Object.assign(Object.assign({}, data), { seguro: undefined, seguro_id,
                registrado_por_id })
        });
        return res.json({ success: true, message: 'Cliente data was successfully created', data: nuevoCliente });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server status error creating new Cliente.', data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.StoreNewClient = StoreNewClient;
const UpdateClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    try {
        const result = yield prisma.clientes.update({
            where: { id },
            data: Object.assign({}, data)
        });
        return res.json({ sucess: true, message: `Cliente id: ${id} was successfully updated`, data: result });
    }
    catch (error) {
        return res.status(500).json({ message: `Server status error updateing Cliente id ${id}`, data: error });
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.UpdateClient = UpdateClient;
const DeleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    try {
        const result = yield prisma.clientes.delete({
            where: { id }
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, message: "Cliente was deleted successfully!", data: result });
    }
    catch (error) {
        console.error(`Error trying delete Cliente id: ${id}`, { error });
        return res.status(404).json({ success: false, message: `Error trying delete Cliente id: ${id}`, data: error });
    }
});
exports.DeleteClient = DeleteClient;
