import { PrismaClient, Turnos } from '@prisma/client';
import { TurnoYCliente } from '../types/queue';

const prisma = new PrismaClient();
const turnos = prisma.turnos;

export const GetAll = async (): Promise<Turnos[]> => {
    const queues = await turnos.findMany({
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return queues;
    
  }
  
  export const GetById = async (id: number): Promise<Turnos> => {
    const findQueue = await turnos.findFirstOrThrow({
      where: { id: id },
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return findQueue;
  }
  
  export const GetBy = async (params: {}): Promise<Turnos>  => {
    const filterQueue = await turnos.findFirstOrThrow({
      where: params,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return filterQueue;
  }
  
  export const GetsBy = async (params: {}): Promise<Turnos[]>  => {
    const filterQueues = await turnos.findMany({
      where: params,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
    console.log({filterQueues})
    return filterQueues;
  }
  
  export const Store = async (data: Turnos): Promise<Turnos> => {
  
    const newUser: Turnos = await turnos.create({
      data
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return newUser;
  }

  

  export const StoreWithClient = async (data: TurnoYCliente): Promise<Turnos> => {
  
    const newQueue: Turnos = await turnos.create({
      data: {
        
        secuencia_ticket: data.secuencia_ticket,
        servicio_actual_id: data.servicio_actual_id,
        cola_posicion: data.cola_posicion,

        servicio_destino: { connect: { id: data.servicio_destino_id }},
        estado_turno: { connect: { id: data.estado_turno_id }},
        sucursal: { connect: { id: data.sucursal_id }},
        registrado_por: { connect: {id: data.registrado_por_id }},
        
        cliente: {
          connectOrCreate: {
            where: {
              identificacion: data.cliente.identificacion
            },
            create: {
              ...data.cliente
            },
          },
        },
      },
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return newQueue;
  }
  
  export const Update = async (id: number, data: {}): Promise<Turnos> => {
    
    const update = await turnos.update({
      where: { id: id }, 
      data: data,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    });
  
    
    return update;
  }
  
  export const Delete = async (id: number): Promise<Turnos> => {

    return await turnos.delete({
      where: { id}
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  }