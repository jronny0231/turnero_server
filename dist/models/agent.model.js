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
const agentes = prisma.agentes;
/*
    id: number;
    nombre: string;
    descripcion: string;
    grupo_servicio_id: number;
    tipo_agente_id: number;
    departamento_sucursal_id: number;
    usuario_id: number;
    estatus: boolean | null;
    createdAt: Date;
    updatedAt: Date | null;
*/
const GetAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const agents = yield agentes.findMany({
        include: {
            grupo_servicio: true,
            tipo_agente: true,
            departamento_sucursal: true,
        }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return agents;
});
exports.GetAll = GetAll;
const GetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findAgent = yield agentes.findFirstOrThrow({
        where: { id: id },
        include: {
            grupo_servicio: true,
            tipo_agente: true,
        }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    const departamento = yield prisma.departamentos_sucursales.findFirst({
        where: {
            refId: findAgent.departamento_sucursal_id
        }
    }).departamento();
    const sucursal = yield prisma.departamentos_sucursales.findFirst({
        where: {
            refId: findAgent.departamento_sucursal_id
        }
    }).sucursal();
    findAgent.departamento_sucursal = { departamento: departamento, sucursal: sucursal };
    return findAgent;
});
exports.GetById = GetById;
const GetBy = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const filterAgent = yield agentes.findFirstOrThrow({
        where: params,
        include: {
            grupo_servicio: true,
            tipo_agente: true,
            departamento_sucursal: true
        }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterAgent;
});
exports.GetBy = GetBy;
const GetsBy = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const filterAgents = yield agentes.findMany({
        where: params,
        include: {
            grupo_servicio: true,
            tipo_agente: true,
            departamento_sucursal: true,
        }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterAgents;
});
exports.GetsBy = GetsBy;
const Store = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newAgent = yield agentes.create({
        data: {
            nombre: data.nombre,
            descripcion: data.descripcion,
            grupo_servicio: { connect: { id: data.grupo_servicio_id } },
            tipo_agente: { connect: { id: data.tipo_agente_id } },
            departamento_sucursal: { connect: { refId: data.departamento_sucursal_id } },
            usuario: { connect: { id: data.usuario_id } }
        }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return newAgent;
});
exports.Store = Store;
const Update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield agentes.update({
        where: { id: id },
        data: data,
        include: {
            grupo_servicio: true,
            tipo_agente: true,
            departamento_sucursal: true,
        }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return update;
});
exports.Update = Update;
const Delete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield agentes.delete({
        where: { id }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
});
exports.Delete = Delete;
/*
async function main() {

  await agentes.create({
    data: {
      nombres: 'Alice',
      correo: 'alice@prisma.io',
      agentname: 'alice02',
      password: 'asddlasmdlkm123@#$',
      token: "",
      rol: {
        create: {
          nombre: 'agente',
          descripcion: 'Usuario asignado a sericios.'
        },

      }
    },

  })


  const allagents = await agentes.findMany({

    include: {

      rol: true,

    },

  })

  return allagents;

}

/*
main()

  .then(async (res) => {
    console.log(res, { depth: null });

  })

  .catch(async (e) => {


    console.error({prisma_error: e})
  })

  .finally(async () => {
    await prisma.$disconnect()
  })
  */ 
