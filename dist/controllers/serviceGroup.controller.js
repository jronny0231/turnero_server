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
exports.DeleteServiceGroup = exports.UpdateServiceGroup = exports.StoreNewServiceGroup = exports.GetServiceGroupById = exports.GetAllSelectableServicesGroup = exports.GetAllServicesGroup = void 0;
const serviceGroup_model_1 = require("../models/serviceGroup.model");
const filtering_1 = require("../utils/filtering");
/**
    id: number;
    descripcion: string;
    color_hex: string;
 */
const INPUT_TYPES_GRUPOSERVICIOS = ['descripcion', 'color_hex'];
const OUTPUT_TYPES_GRUPOSERVICIOS = ['id', 'descripcion', 'color_hex'];
exports.GetAllServicesGroup = ((_req, res) => {
    (0, serviceGroup_model_1.GetAll)().then((serviceGroups => {
        const data = serviceGroups.map((serviceGroup) => {
            return (0, filtering_1.ObjectFiltering)(serviceGroup, OUTPUT_TYPES_GRUPOSERVICIOS);
        });
        return res.send({ success: true, data });
    })).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        return res.status(404).send({ error: error.message });
    }));
});
exports.GetAllSelectableServicesGroup = ((_req, res) => {
    (0, serviceGroup_model_1.GetsBy)({ es_seleccionable: true }).then((serviceGroups) => {
        const data = serviceGroups.map((serviceGroup) => {
            return (0, filtering_1.ObjectFiltering)(serviceGroup, OUTPUT_TYPES_GRUPOSERVICIOS);
        });
        return res.send({ success: true, data });
    }).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        return res.status(404).send({ error: error.message });
    }));
});
exports.GetServiceGroupById = ((_req, res) => {
    return res.send('Get Grupos Servicios by ID');
});
exports.StoreNewServiceGroup = ((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if ((0, filtering_1.ObjectDifferences)(data, INPUT_TYPES_GRUPOSERVICIOS).length > 0) {
        return res.status(400).json({ message: 'Incorrect or incomplete data in request', valid: INPUT_TYPES_GRUPOSERVICIOS });
    }
    (0, serviceGroup_model_1.Store)(data).then((newServiceGroup) => {
        const data = (0, filtering_1.ObjectFiltering)(newServiceGroup, OUTPUT_TYPES_GRUPOSERVICIOS);
        return res.send({ message: 'Service created successfully!', data });
    }).catch((error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error.code === 'P2000')
            return res.status(400).send({ error: 'A field is too longer.', message: error.message });
        return res.status(400).send({ error: error.message });
    }));
    return;
}));
exports.UpdateServiceGroup = ((_req, res) => {
    return res.send('Update a Grupo Servicios');
});
exports.DeleteServiceGroup = ((_req, res) => {
    return res.send('Delete a Grupo Servicios');
});
