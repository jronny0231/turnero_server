import { Grupos_servicios, PrismaClient, Servicios, Servicios_dependientes } from '@prisma/client';

const prisma = new PrismaClient();
const servicios = prisma.servicios;

export const GetAll = async (): Promise<Servicios[]> => {
    const services = await servicios.findMany({
      include: { grupo: true }
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return services;
    
  }

  export const GetAllInGroups = async (params: {}): Promise<Grupos_servicios[]> => {
    const servicesInGroups = await prisma.grupos_servicios.findMany({
      where: params,
      include: { 
        servicio: {
          where: params,
        }
      }
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return servicesInGroups;
    
  }

export const GetAllDependentsBySelectableId = async (id: number): Promise<Servicios_dependientes[]> => {
  const dependents: Servicios_dependientes[] = await prisma.servicios_dependientes.findMany({
    where: { servicio_seleccionable_id: id },
    
  }).then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })

  return dependents;
}
  
  export const GetById = async (id: number): Promise<Servicios> => {
    const findService = await servicios.findFirstOrThrow({
      where: { id: id },
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return findService;
  }

  export const GetsBy = async (params: {}): Promise<Servicios[]>  => {
    const filterServices = await servicios.findMany({
      where: params,
      include: { grupo: true }
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return filterServices;
  }

  export const Store = async (data: Servicios): Promise<Servicios> => {
  
    const newService: Servicios = await servicios.create({
      data
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return newService;
  }
  
  export const Update = async (id: number, data: {}): Promise<Servicios> => {
    
    const update = await servicios.update({
      where: { id: id }, 
      data: data,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    });
  
    
    return update;
  }
  
  export const Delete = async (id: number): Promise<Servicios> => {

    return await servicios.delete({
      where: { id}
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  }