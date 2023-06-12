import { Grupos_servicios, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const gruposervicios = prisma.grupos_servicios;

export const GetAll = async (): Promise<Grupos_servicios[]> => {
    const gruposervicio = await gruposervicios.findMany({
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return gruposervicio;
    
  }
  
  export const GetById = async (id: number): Promise<Grupos_servicios> => {
    const findServiceGroup = await gruposervicios.findFirstOrThrow({
      where: { id: id },
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return findServiceGroup;
  }

  export const GetsBy = async (params: Partial<Grupos_servicios>): Promise<Grupos_servicios[]> => {
    const findServiceGroup = await gruposervicios.findMany({
      where: params,
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })

    return findServiceGroup;
  }

  export const Store = async (data: Grupos_servicios): Promise<Grupos_servicios> => {
  
    const newServiceGroup: Grupos_servicios = await gruposervicios.create({
      data
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return newServiceGroup;
  }
  
  export const Update = async (id: number, data: {}): Promise<Grupos_servicios> => {
    
    const update = await gruposervicios.update({
      where: { id: id }, 
      data: data,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    });
  
    
    return update;
  }
  
  export const Delete = async (id: number): Promise<Grupos_servicios> => {

    return await gruposervicios.delete({
      where: { id}
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  }