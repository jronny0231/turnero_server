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
exports.DeleteService = exports.UpdateService = exports.StoreNewService = exports.GetServiceById = exports.GetAllServices = void 0;
const service_model_1 = require("../models/service.model");
const filtering_1 = require("../utils/filtering");
/**
    id: number;
    descripcion: string;
    nombre_corto: string;
    prefijo: string;
    grupo_id: number;
    es_seleccionable: boolean;
    estatus: boolean;
 */
const INPUT_TYPES_SERVICIOS = ['descripcion', 'nombre_corto', 'prefijo', 'grupo_id', 'es_seleccionable'];
const OUTPUT_TYPES_SERVICIOS = ['id', 'descripcion', 'nombre_corto', 'prefijo', 'grupo', 'es_seleccionable'];
exports.GetAllServices = ((_req, res) => {
    (0, service_model_1.GetAll)().then((services => {
        const data = services.map((service) => {
            return (0, filtering_1.ObjectFiltering)(service, OUTPUT_TYPES_SERVICIOS);
        });
        res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        res.status(404).send({ error: error.message });
    }));
});
exports.GetServiceById = ((_req, res) => {
    res.send('Get Servicios by ID');
});
exports.StoreNewService = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if ((0, filtering_1.ObjectDifferences)(data, INPUT_TYPES_SERVICIOS).length > 0) {
        return res.status(400).json({ message: 'Incorrect or incomplete data in request', valid: INPUT_TYPES_SERVICIOS });
    }
    (0, service_model_1.Store)(data).then((newService) => {
        const data = (0, filtering_1.ObjectFiltering)(newService, OUTPUT_TYPES_SERVICIOS);
        return res.send({ message: 'Service created successfully!', data });
    }).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error.code === 'P2000')
            return res.status(400).send({ error: 'A field is too longer.', message: error.message });
        return res.status(400).send({ error: error.message });
    }));
    return;
}));
exports.UpdateService = ((_req, res) => {
    res.send('Update a Servicios');
});
exports.DeleteService = ((_req, res) => {
    res.send('Delete a Servicios');
});
