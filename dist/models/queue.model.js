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
exports.Delete = exports.Update = exports.StoreWithClient = exports.Store = exports.GetsByWithDepartamento = exports.GetsBy = exports.GetBy = exports.GetById = exports.GetAll = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const turnos = prisma.turnos;
const selectableFields = {
    estado_turno: true,
    cliente: {
        select: {
            id: true,
            nombre: true,
            identificacion: true,
            seguro: {
                select: {
                    nombre: true,
                }
            }
        }
    },
    servicio_destino: {
        select: {
            id: true,
            nombre_corto: true,
            descripcion: true,
        }
    },
    sucursal: {
        select: {
            id: true,
            descripcion: true,
            siglas: true
        }
    },
    registrado_por: {
        select: {
            id: true,
            username: true,
        }
    }
};
const GetAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const queues = yield turnos.findMany({
        include: selectableFields,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    const servicio_actual = yield prisma.servicios.findFirst({
        where: {
            id: queues[0].servicio_actual_id
        },
        select: selectableFields.servicio_destino.select
    });
    const result = queues.map((queue) => {
        queue.servicio_actual = servicio_actual;
        return queue;
    });
    return result;
});
exports.GetAll = GetAll;
const GetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findQueue = yield turnos.findFirstOrThrow({
        where: { id: id },
        include: selectableFields,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return findQueue;
});
exports.GetById = GetById;
const GetBy = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const filterQueue = yield turnos.findFirstOrThrow({
        where: params,
        include: selectableFields,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterQueue;
});
exports.GetBy = GetBy;
const GetsBy = (where, match) => __awaiter(void 0, void 0, void 0, function* () {
    const matchParams = match ? { [match === null || match === void 0 ? void 0 : match.param]: { in: match === null || match === void 0 ? void 0 : match.values } } : {};
    const filterQueues = yield turnos.findMany({
        where: Object.assign(Object.assign({}, where), matchParams),
        include: selectableFields,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterQueues;
});
exports.GetsBy = GetsBy;
const GetsByWithDepartamento = (where, match) => __awaiter(void 0, void 0, void 0, function* () {
    const filterQueues = yield turnos.findMany({
        where: Object.assign(Object.assign({}, where), { [match === null || match === void 0 ? void 0 : match.param]: {
                [match === null || match === void 0 ? void 0 : match.field]: { in: match === null || match === void 0 ? void 0 : match.values }
            } }),
        include: selectableFields,
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    const departamento = yield prisma.servicios_departamentos_sucursales.findFirst({
        where: {
            servicio_id: filterQueues[0].servicio_actual_id,
            departamento_sucursal: {
                sucursal: { id: filterQueues[0].sucursal_id }
            }
        },
        select: {
            departamento_sucursal: {
                select: {
                    departamento: {
                        select: {
                            id: true,
                            descripcion: true,
                            siglas: true
                        }
                    }
                }
            }
        }
    }).departamento_sucursal().departamento();
    const result = filterQueues.map(queue => {
        queue.departamento = departamento;
        return queue;
    });
    return result;
});
exports.GetsByWithDepartamento = GetsByWithDepartamento;
/*
export const syncQueuesToDisplay = async (sucursalId: number): Promise<Turnos[]> => {
  const queues: Turnos[] = await prisma.$sub
}
*/
const Store = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newQueue = yield turnos.create({
        data
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return newQueue;
});
exports.Store = Store;
const StoreWithClient = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newQueue = yield turnos.create({
        data: {
            secuencia_ticket: data.secuencia_ticket,
            servicio_actual_id: data.servicio_actual_id,
            cola_posicion: data.cola_posicion,
            servicio_destino: { connect: { id: data.servicio_destino_id } },
            estado_turno: { connect: { id: data.estado_turno_id } },
            sucursal: { connect: { id: data.sucursal_id } },
            registrado_por: { connect: { id: data.registrado_por_id } },
            cliente: {
                connectOrCreate: {
                    where: {
                        identificacion: data.cliente.identificacion
                    },
                    create: Object.assign({}, data.cliente),
                },
            },
        },
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return newQueue;
});
exports.StoreWithClient = StoreWithClient;
const Update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield turnos.update({
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
    return yield turnos.delete({
        where: { id }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
});
exports.Delete = Delete;
