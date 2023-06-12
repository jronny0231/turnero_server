"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.DeleteService = exports.UpdateService = exports.StoreNewService = exports.GetServiceById = exports.GetAllSeletableServicesByServiceGroup = exports.GetAllServicesByServiceGroup = exports.GetAllServices = void 0;
const ServicesModel = __importStar(require("../models/service.model"));
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
    ServicesModel.GetAll().then((services => {
        const data = services.map((service) => {
            return (0, filtering_1.ObjectFiltering)(service, OUTPUT_TYPES_SERVICIOS);
        });
        return res.json({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        return res.status(404).json({ error: error.message });
    }));
});
exports.GetAllServicesByServiceGroup = ((req, res) => {
    const grupo_id = Number(req.params.id);
    ServicesModel.GetsBy({ grupo_id }).then((services => {
        const data = services.map((service) => {
            return (0, filtering_1.ObjectFiltering)(service, OUTPUT_TYPES_SERVICIOS);
        });
        return res.json({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        return res.status(404).json({ error: error.message });
    }));
});
/**
 * Debe buscar todos los servicios que cumplan con los siguientes criterios:
 * - Servicios.es_seleccionable = true,
 * - JOIN (Servicios_Sucursales) donde:
 * -- sucursal_id = sucursal actual
 * -- disponible = true
 */
exports.GetAllSeletableServicesByServiceGroup = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const grupo_id = Number(req.params.id);
    if (grupo_id === 0)
        return ServicesModel.GetAllInGroups({ es_seleccionable: true }).then((servicesInGroups) => {
            return res.json({ success: true, data: servicesInGroups });
        }).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
            return res.status(404).json({ error: error.message });
        }));
    return ServicesModel.GetsBy({ grupo_id, es_seleccionable: true }).then((services => {
        const data = services.map((service) => {
            return (0, filtering_1.ObjectFiltering)(service, OUTPUT_TYPES_SERVICIOS);
        });
        return res.json({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        return res.status(404).json({ error: error.message });
    }));
}));
exports.GetServiceById = ((_req, res) => {
    res.json('Get Servicios by ID');
});
exports.StoreNewService = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if ((0, filtering_1.ObjectDifferences)(data, INPUT_TYPES_SERVICIOS).length > 0) {
        return res.status(400).json({ message: 'Incorrect or incomplete data in request', valid: INPUT_TYPES_SERVICIOS });
    }
    ServicesModel.Store(data).then((newService) => {
        const data = (0, filtering_1.ObjectFiltering)(newService, OUTPUT_TYPES_SERVICIOS);
        return res.json({ message: 'Service created successfully!', data });
    }).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error.code === 'P2000')
            return res.status(400).json({ error: 'A field is too longer.', message: error.message });
        return res.status(400).json({ error: error.message });
    }));
    return;
}));
exports.UpdateService = ((_req, res) => {
    return res.json('Update a Servicios');
});
exports.DeleteService = ((_req, res) => {
    return res.json('Delete a Servicios');
});
