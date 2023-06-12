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
exports.Delete = exports.Update = exports.FindOrCreate = exports.Store = exports.GetsBy = exports.GetBy = exports.GetById = exports.GetAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const clientes = prisma.clientes;
const GetAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const clients = yield clientes.findMany({
    // Connect with all related tables
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return clients;
});
exports.GetAll = GetAll;
const GetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findClient = yield clientes.findFirstOrThrow({
        where: { id: id },
        // Connect with all related tables
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return findClient;
});
exports.GetById = GetById;
const GetBy = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const filterClient = yield clientes.findFirstOrThrow({
        where: params,
        // Connect with all related tables
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterClient;
});
exports.GetBy = GetBy;
const GetsBy = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const filterClients = yield clientes.findMany({
        where: params,
        // Connect with all related tables
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterClients;
});
exports.GetsBy = GetsBy;
const Store = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield clientes.create({
        data
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return newUser;
});
exports.Store = Store;
const FindOrCreate = (params, data) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield clientes.upsert({
        where: params,
        update: {},
        create: data,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return newUser;
});
exports.FindOrCreate = FindOrCreate;
const Update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield clientes.update({
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
    return yield clientes.delete({
        where: { id }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
});
exports.Delete = Delete;
