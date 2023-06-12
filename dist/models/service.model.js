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
exports.Delete = exports.Update = exports.Store = exports.GetsBy = exports.GetById = exports.GetAllDependentsBySelectableId = exports.GetAllInGroups = exports.GetAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const servicios = prisma.servicios;
const GetAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const services = yield servicios.findMany({
        include: { grupo: true }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return services;
});
exports.GetAll = GetAll;
const GetAllInGroups = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const servicesInGroups = yield prisma.grupos_servicios.findMany({
        where: params,
        include: {
            servicio: {
                where: params,
            }
        }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return servicesInGroups;
});
exports.GetAllInGroups = GetAllInGroups;
const GetAllDependentsBySelectableId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const dependents = yield prisma.servicios_dependientes.findMany({
        where: { servicio_seleccionable_id: id },
    }).then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return dependents;
});
exports.GetAllDependentsBySelectableId = GetAllDependentsBySelectableId;
const GetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findService = yield servicios.findFirstOrThrow({
        where: { id: id },
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return findService;
});
exports.GetById = GetById;
const GetsBy = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const filterServices = yield servicios.findMany({
        where: params,
        include: { grupo: true }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterServices;
});
exports.GetsBy = GetsBy;
const Store = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newService = yield servicios.create({
        data
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return newService;
});
exports.Store = Store;
const Update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield servicios.update({
        where: { id: id },
        data: data,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return update;
});
exports.Update = Update;
const Delete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield servicios.delete({
        where: { id }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
});
exports.Delete = Delete;
