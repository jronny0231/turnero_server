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
exports.DeleteClients = exports.UpdateClients = exports.StoreNewClients = exports.GetClientsById = exports.GetAllClients = void 0;
const client_model_1 = require("../models/client.model");
const filtering_1 = require("../utils/filtering");
/**
    id: number;
    nombre: string;
    apellidos: string;
    tipo_identificacion_id: number;
    identificacion: string;
    seguro_id: number;
    nombre_tutorado: string | null;
    fecha_ultima_visita: Date | null;
    estatus: boolean;
    registrado_por_id: number;
    modificado_por_id: number | null;
    createdAt: Date;
    updatedAt: Date;
 */
const INPUT_TYPES_CLIENTES = ['nombre', 'apellidos', 'tipo_identificacion_id', 'identificacion', 'seguro_id', 'nombre_tutorado'];
const OUTPUT_TYPES_CLIENTES = ['id', 'nombre', 'apellidos', 'tipo_identificacion', 'identificacion', 'seguro', 'nombre_tutorado', 'fecha_ultima_visita', 'estatus', 'registrado_por_id', 'createdAt'];
exports.GetAllClients = ((_req, res) => {
    (0, client_model_1.GetAll)().then((Clients => {
        const data = Clients.map((Clients) => {
            return (0, filtering_1.ObjectFiltering)(Clients, OUTPUT_TYPES_CLIENTES);
        });
        res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send({ error: error.message });
    }));
});
exports.GetClientsById = ((req, res) => {
    const id = Number(req.params.id);
    (0, client_model_1.GetById)(id).then((user => {
        const data = (0, filtering_1.ObjectFiltering)(user, OUTPUT_TYPES_CLIENTES);
        res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send({ error: error.message });
    }));
});
exports.StoreNewClients = ((req, res) => {
    const data = req.body;
    if ((0, filtering_1.ObjectDifferences)(data, INPUT_TYPES_CLIENTES).length > 0) {
        return res.status(400).json({ message: 'Incorrect or incomplete data in request', valid: INPUT_TYPES_CLIENTES });
    }
    (0, client_model_1.Store)(data).then((newClients) => {
        const data = (0, filtering_1.ObjectFiltering)(newClients, OUTPUT_TYPES_CLIENTES);
        return res.send({ message: 'Clients created successfully!', data });
    }).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error.code === 'P2000')
            return res.status(400).send({ error: 'A field is too longer.', message: error.message });
        return res.status(400).send({ error: error.message });
    }));
    return;
});
exports.UpdateClients = ((_req, res) => {
    res.send('Update a Clientes');
});
exports.DeleteClients = ((_req, res) => {
    res.send('Delete a Clientes');
});
