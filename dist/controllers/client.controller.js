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
exports.DeleteClients = exports.UpdateClients = exports.StoreNewClient = exports.GetClientsById = exports.GetAllClients = void 0;
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
    var _a;
    const receive = (_a = req.query.with) !== null && _a !== void 0 ? _a : false;
    const include = receive ? String(receive).toUpperCase() : 'NONE';
    const registrado_por_id = res.locals.payload.id;
    try {
        let nuevoCliente = {};
        yield prisma.$connect();
        if (include === 'SEGURO') {
            const data = req.body;
            let seguro = yield prisma.seguros.findFirst({
                where: { NOT: { OR: [
                            { siglas: data.seguro.siglas },
                            { nombre_corto: data.seguro.nombre_corto },
                            { nombre: data.seguro.nombre }
                        ]
                    } }
            });
            if (seguro === null) {
                seguro = yield prisma.seguros.create({
                    data: Object.assign({}, data.seguro)
                });
            }
            nuevoCliente = yield prisma.clientes.create({
                data: Object.assign(Object.assign({}, data), { seguro: undefined, seguro_id: seguro.id, registrado_por_id })
            });
        }
        else if (include === 'NONE') {
        }
        if (nuevoCliente === null)
            return res.status(404).json({ message: 'Cliente was not created' });
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
exports.UpdateClients = ((_req, res) => {
    res.send('Update a Clientes');
});
exports.DeleteClients = ((_req, res) => {
    res.send('Delete a Clientes');
});
