import { PrismaClient, Clientes } from '@prisma/client';

const prisma = new PrismaClient();
const clientes = prisma.clientes;

export const GetAll = async (): Promise<Clientes[]> => {
    const clients = await clientes.findMany({
      // Connect with all related tables
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return clients;
    
  }
  
  export const GetById = async (id: number): Promise<Clientes> => {
    const findClient = await clientes.findFirstOrThrow({
      where: { id: id },
      // Connect with all related tables
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return findClient;
  }
  
  export const GetBy = async (params: {}): Promise<Clientes>  => {
    const filterClient = await clientes.findFirstOrThrow({
      where: params,
      // Connect with all related tables
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return filterClient;
  }
  
  export const GetsBy = async (params: {}): Promise<Clientes[]>  => {
    const filterClients = await clientes.findMany({
      where: params,
      // Connect with all related tables
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return filterClients;
  }
  
  export const Store = async (data: Clientes): Promise<Clientes> => {
  
    const newUser: Clientes = await clientes.create({
      data
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return newUser;
  }

  export const FindOrCreate = async (params: Partial<Clientes>, data: Clientes): Promise<Clientes> => {
  
    const newUser: Clientes = await clientes.upsert({
      where: params,
      update: {},
      create: data,
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return newUser;
  }
  
  
  export const Update = async (id: number, data: {}): Promise<Clientes> => {
    
    const update = await clientes.update({
      where: { id: id }, 
      data: data,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    });
  
    
    return update;
  }
  
  export const Delete = async (id: number): Promise<Clientes> => {

    return await clientes.delete({
      where: { id}
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  }