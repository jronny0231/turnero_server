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
exports.Delete = exports.Update = exports.Store = exports.GetsBy = exports.GetBy = exports.GetById = exports.GetAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const pantallas = prisma.pantallas;
const selectableFields = {
    estilo: true,
    sucursal: {
        select: {
            id: true,
            descripcion: true,
            siglas: true
        }
    },
};
const GetAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const displays = yield pantallas.findMany({
        include: selectableFields,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return displays;
});
exports.GetAll = GetAll;
const GetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findDisplay = yield pantallas.findFirstOrThrow({
        where: { id: id },
        include: selectableFields,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return findDisplay;
});
exports.GetById = GetById;
const GetBy = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const filterDisplay = yield pantallas.findFirstOrThrow({
        where: params,
        include: selectableFields,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterDisplay;
});
exports.GetBy = GetBy;
const GetsBy = (where, match) => __awaiter(void 0, void 0, void 0, function* () {
    const matchParams = match ? { [match === null || match === void 0 ? void 0 : match.param]: { in: match === null || match === void 0 ? void 0 : match.values } } : {};
    const filterDisplays = yield pantallas.findMany({
        where: Object.assign(Object.assign({}, where), matchParams),
        include: selectableFields,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterDisplays;
});
exports.GetsBy = GetsBy;
const Store = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newDisplay = yield pantallas.create({
        data
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return newDisplay;
});
exports.Store = Store;
const Update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield pantallas.update({
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
    return yield pantallas.delete({
        where: { id }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
});
exports.Delete = Delete;
