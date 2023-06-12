import { PrismaClient, Usuarios } from '@prisma/client';

const prisma = new PrismaClient();
const usuarios = prisma.usuarios;

export const GetAll = async (): Promise<Usuarios[]> => {
  const users = await usuarios.findMany({
    include: { rol: true }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })

  return users;
  
}

export const GetById = async (id: number): Promise<Usuarios> => {
  const findUser = await usuarios.findFirstOrThrow({
    where: { id: id },
    include: { rol: true }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })

  return findUser;
}

export const GetBy = async (params: {}): Promise<Usuarios>  => {
  const filterUser = await usuarios.findFirstOrThrow({
    where: params,
    include: { rol: true }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })

  return filterUser;
}

export const GetsBy = async (params: Partial<Usuarios>): Promise<Usuarios[]>  => {
  const filterUsers = await usuarios.findMany({
    where: params,
    include: { rol: true }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })

  return filterUsers;
}

export const Store = async (data: Usuarios): Promise<Usuarios> => {

  const newUser: Usuarios = await usuarios.create({
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
  .finally(async () => {
    await prisma.$disconnect()
  })

  return newUser;
}

export const Update = async (id: number, data: {}): Promise<Usuarios> => {
  
  const update = await usuarios.update({
    where: { id: id }, 
    data: data,
    include: { rol: true }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  });

  
  return update;
}

export const Delete = async (id: number): Promise<Usuarios> => {

  return await usuarios.delete({
    where: { id}
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })
}

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