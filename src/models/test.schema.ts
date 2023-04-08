import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()


async function main() {

  await prisma.usuarios.create({
    data: {
      nombres: 'Alice',
      correo: 'alice@prisma.io',
      username: 'alice02',
      password: 'asddlasmdlkm123@#$',
      rol: {
        create: {
          nombre: 'agente',
          descripcion: 'Usuario asignado a sericios.'
        },

      }
    },

  })


  const allUsers = await prisma.usuarios.findMany({

    include: {

      rol: true,

    },

  })

  return allUsers;

}


main()

  .then(async (res) => {
    console.log(res, { depth: null });

  })

  .catch(async (e) => {


    console.error(e)
    process.exit(1)
  })

  .finally(async () => {
    await prisma.$disconnect()
  })