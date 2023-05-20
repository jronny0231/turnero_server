import { PrismaClient, Agentes, Departamentos, Sucursales } from '@prisma/client';

const prisma = new PrismaClient();
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
export const GetAll = async (): Promise<Agentes[]> => {
  const agents = await agentes.findMany({
    include: {
      grupo_servicio: true,
      tipo_agente: true,
      departamento_sucursal: true,
    }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })

  return agents;
  
}

interface AgenteySucursal extends Agentes {
  departamento_sucursal?: {
    departamento: Departamentos | null,
    sucursal: Sucursales | null,
  }
}

export const GetById = async (id: number): Promise<AgenteySucursal> => {
  const findAgent: AgenteySucursal = await agentes.findFirstOrThrow({
    where: { id: id },
    include: {
      grupo_servicio: true,
      tipo_agente: true,
    }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })

  const departamento = await prisma.departamentos_sucursales.findFirst({
    where: {
      refId: findAgent.departamento_sucursal_id
    }
  }).departamento()

  const sucursal = await prisma.departamentos_sucursales.findFirst({
    where: {
      refId: findAgent.departamento_sucursal_id
    }
  }).sucursal()
  
  findAgent.departamento_sucursal = {departamento: departamento, sucursal: sucursal}

  return findAgent;
}

export const GetBy = async (params: {}): Promise<Agentes>  => {
  const filterAgent = await agentes.findFirstOrThrow({
    where: params,

    include: {
      grupo_servicio: true,
      tipo_agente: true,
      departamento_sucursal:  true
    }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })

  return filterAgent;
}

export const GetsBy = async (params: {}): Promise<Agentes[]>  => {
  const filterAgents = await agentes.findMany({
    where: params,
    include: {
      grupo_servicio: true,
      tipo_agente: true,
      departamento_sucursal: true,
    }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })

  return filterAgents;
}

export const Store = async (data: Agentes): Promise<Agentes> => {

  const newAgent: Agentes = await agentes.create({
    data: {
      nombre: data.nombre,
      descripcion: data.descripcion,
      grupo_servicio: { connect: { id: data.grupo_servicio_id}},
      tipo_agente: { connect: { id: data.tipo_agente_id }},
      departamento_sucursal: { connect: { refId: data.departamento_sucursal_id }},
      usuario: { connect: { id: data.usuario_id }}
    }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })

  return newAgent;
}

export const Update = async (id: number, data: {}): Promise<Agentes> => {
  
  const update = await agentes.update({
    where: { id: id }, 
    data: data,
    include: {
      grupo_servicio: true,
      tipo_agente: true,
      departamento_sucursal: true,
    }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  });

  
  return update;
}

export const Delete = async (id: number): Promise<Agentes> => {

  return await agentes.delete({
    where: { id }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })
}

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