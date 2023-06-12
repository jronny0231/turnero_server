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
exports.Delete = exports.Update = exports.Store = exports.GetsBy = exports.GetById = exports.GetAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const gruposervicios = prisma.grupos_servicios;
const GetAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const gruposervicio = yield gruposervicios.findMany({})
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return gruposervicio;
});
exports.GetAll = GetAll;
const GetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findServiceGroup = yield gruposervicios.findFirstOrThrow({
        where: { id: id },
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return findServiceGroup;
});
exports.GetById = GetById;
const GetsBy = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const findServiceGroup = yield gruposervicios.findMany({
        where: params,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return findServiceGroup;
});
exports.GetsBy = GetsBy;
const Store = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newServiceGroup = yield gruposervicios.create({
        data
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return newServiceGroup;
});
exports.Store = Store;
const Update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield gruposervicios.update({
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
    return yield gruposervicios.delete({
        where: { id }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
});
exports.Delete = Delete;
