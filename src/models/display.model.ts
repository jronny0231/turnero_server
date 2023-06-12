import { PrismaClient, Pantallas } from '@prisma/client';

const prisma = new PrismaClient();
const pantallas = prisma.pantallas;

const selectableFields = {
  estilo: true,
  sucursal: {
    select: {
      id: true,
      descripcion: true,
      siglas: true
    }
  },
}

export const GetAll = async (): Promise<Pantallas[]> => {
    const displays: Pantallas[] = await pantallas.findMany({
      include: selectableFields,
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })


    return displays;
    
}
  
export const GetById = async (id: number): Promise<Pantallas> => {
    const findDisplay = await pantallas.findFirstOrThrow({
      where: { id: id },
      include: selectableFields,
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return findDisplay;
}
  
  export const GetBy = async (params: Partial<Pantallas>): Promise<Pantallas>  => {
    const filterDisplay = await pantallas.findFirstOrThrow({
      where: params,
      include: selectableFields,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return filterDisplay;
  }

  export const GetsBy = async (where: Partial<Pantallas>, match?: {param: string, values: Array<string>}): Promise<Pantallas[]>  => {
    
    const matchParams = match ? {[match?.param as string]: {in: match?.values}} : {}
    
    const filterDisplays: Pantallas[] = await pantallas.findMany({
      where: {
        ...where,
        ...matchParams
      },
      include: selectableFields,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })

    return filterDisplays;
  }
  
  export const Store = async (data: Pantallas): Promise<Pantallas> => {
  
    const newDisplay: Pantallas = await pantallas.create({
      data
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return newDisplay;
  }

  export const Update = async (id: number, data: {}): Promise<Pantallas> => {
    
    const update = await pantallas.update({
      where: { id: id }, 
      data: data,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    });
  
    
    return update;
  }
  
  export const Delete = async (id: number): Promise<Pantallas> => {

    return await pantallas.delete({
      where: { id}
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  }