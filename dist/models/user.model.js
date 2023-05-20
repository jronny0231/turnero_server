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
const usuarios = prisma.usuarios;
const GetAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield usuarios.findMany({
        include: { rol: true }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return users;
});
exports.GetAll = GetAll;
const GetById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const findUser = yield usuarios.findFirstOrThrow({
        where: { id: id },
        include: { rol: true }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return findUser;
});
exports.GetById = GetById;
const GetBy = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const filterUser = yield usuarios.findFirstOrThrow({
        where: params,
        include: { rol: true }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterUser;
});
exports.GetBy = GetBy;
const GetsBy = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const filterUsers = yield usuarios.findMany({
        where: params,
        include: { rol: true }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return filterUsers;
});
exports.GetsBy = GetsBy;
const Store = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield usuarios.create({
        data: {
            nombres: data.nombres,
            correo: data.correo,
            username: data.username,
            password: data.password,
            token: "",
            rol: {
                connect: {
                    id: data.rol_id
                }
            }
        }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return newUser;
});
exports.Store = Store;
const Update = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield usuarios.update({
        where: { id: id },
        data: data,
        include: { rol: true }
    })
        .then((result) => result)
        .finally(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    return update;
});
exports.Update = Update;
const Delete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield usuarios.delete({
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

  await usuarios.create({
    data: {
      nombres: 'Alice',
      correo: 'alice@prisma.io',
      username: 'alice02',
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


  const allUsers = await usuarios.findMany({

    include: {

      rol: true,

    },

  })

  return allUsers;

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
