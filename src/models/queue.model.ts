import { Horarios, PrismaClient, Servicios, Turnos } from '@prisma/client';
import { PantallaTurnos, SucursalTurnos, TurnoYCliente } from '../@types/queue';
import { DisplayFilterParams } from '../@types/global';

const prisma = new PrismaClient();
const turnos = prisma.turnos;

const selectableFields = {
  estado_turno: true,
  cliente: {
    select: {
      id: true,
      nombre: true,
      identificacion: true,
      seguro: {
        select: {
          nombre: true,
        }
      }
    }
  },
  servicio_destino: {
    select: {
      id: true,
      nombre_corto: true,
      descripcion: true,
    }
  },
  sucursal: {
    select: {
      id: true,
      descripcion: true,
      siglas: true
    }
  },
  registrado_por: {
    select: {
      id: true,
      username: true,
    }
  }
}

interface TurnoExport extends Turnos {
  servicio_actual?: Partial<Servicios> | null;
}

export const setHorarios = async (id: number, data: Horarios): Promise<Horarios> => {
    const newHorario = await prisma.horarios.update({
      data,
      where: {
        id
      }
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })

    return newHorario
}

export const getHorarios = async (id: number): Promise<{} | null> => {
  const horario = await prisma.horarios.findFirst({
    where: {
      id
    }
  })
  .then((result) => result)
  .finally(async () => {
    await prisma.$disconnect()
  })
  const newHorario: {} = {
    ...horario,
    hora_inicio: horario?.hora_inicio?.toLocaleTimeString(),
    hora_fin: horario?.hora_fin?.toLocaleTimeString()
  }
  return newHorario
}

export const GetAll = async (): Promise<TurnoExport[]> => {
    const queues: TurnoExport[] = await turnos.findMany({
      include: selectableFields,
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    const servicio_actual: Partial<Servicios> | null = await prisma.servicios.findFirst({
      where: {
        id: queues[0].servicio_actual_id
      },
      select: selectableFields.servicio_destino.select
    })

    const result: any = queues.map((queue: TurnoExport) => {
      queue.servicio_actual = servicio_actual
      return queue
    })

    return result as TurnoExport[];
    
  }
  
  export const GetById = async (id: number): Promise<Turnos> => {
    const findQueue = await turnos.findFirstOrThrow({
      where: { id: id },
      include: selectableFields,
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
      include: selectableFields,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return filterQueue;
  }

  export const GetsBy = async (where: Partial<Turnos>, match?: {param: string, values: Array<string>}): Promise<Turnos[]>  => {
    const matchParams = match ? {[match?.param as string]: {in: match?.values}} : {}
    const filterQueues: SucursalTurnos[] = await turnos.findMany({
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

    return filterQueues;
  }

  export const GetsByWithDisplayKey = async ({key, where, match}: DisplayFilterParams): Promise<PantallaTurnos[]> => {
    const sucursal = await prisma.pantallas.findFirst({
      where: {
        key,
      }
    }).sucursal()

    const queueAttenting: PantallaTurnos[] = await turnos.findMany({
      where: {
        ...where,
        sucursal_id: sucursal?.id,

        [match?.param as string]: {
          [match?.field as string]: {in: match?.values}
        }
      },
      select: {
        id: true,
        secuencia_ticket: true,
        servicio_destino: true,
        atenciones_turnos_servicios: {
          select: {
            agente: {
              select: {
                nombre: true,
                departamento_sucursal: {
                  select: {
                    departamento: {
                      select: {
                        siglas: true,
                        descripcion: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
    
    return queueAttenting;
    
    /*
    const filterQueues: PantallaTurnos[] = await turnos.findMany({
      where: {
        ...where,
        sucursal_id: sucursal?.id,
        
        [match?.param as string]: {
          [match?.field as string]: {in: match?.values}
        }
      },
      include: selectableFields,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })

    const departamento_agente = await prisma.servicios_departamentos_sucursales.findFirst({
      where: {
        servicio_id: filterQueues[0].servicio_actual_id,
        departamento_sucursal: {
          sucursal: {id: filterQueues[0].sucursal_id}
        }
      },
      select: {
        departamento_sucursal: {
          select: {
            departamento: {
              select: {
                id: true,
                descripcion: true,
                siglas: true
              }
            },
            agentes: {
              select: {
                id: true,
                nombre: true,
              }
            }
          }
          }
        }
    })

    const result: any = filterQueues.map(queue => {
      queue.departamento = departamento_agente?.departamento_sucursal?.departamento
      queue.agente = departamento_agente?.departamento_sucursal?.agentes[0]
      return queue
    }) as any[]

    return result as PantallaTurnos[];
    */
    
  }
  
  export const GetsByWithDepartamento = async (where: Partial<Turnos>, match: {param: string, field: string, values: Array<string>}): Promise<SucursalTurnos[]>  => {
    const filterQueues: SucursalTurnos[] = await turnos.findMany({
      where: {
        ...where,
        
        [match?.param as string]: {
          [match?.field as string]: {in: match?.values}
        }
      },
      include: selectableFields,
      
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })

    const departamento = await prisma.servicios_departamentos_sucursales.findFirst({
      where: {
        servicio_id: filterQueues[0].servicio_actual_id,
        departamento_sucursal: {
          sucursal: {id: filterQueues[0].sucursal_id}
        }
      },
      select: {
        departamento_sucursal: {
          select: {
            departamento: {
              select: {
                id: true,
                descripcion: true,
                siglas: true
              }
            }
          }
          }
        }
    }).departamento_sucursal().departamento()

    const result: any = filterQueues.map(queue => {
      queue.departamento = departamento
      return queue
    }) as any[]

    return result as SucursalTurnos[];
  }


  export const Store = async (data: Turnos): Promise<Turnos> => {
  
    const newQueue: Turnos = await turnos.create({
      data
    })
    .then((result) => result)
    .finally(async () => {
      await prisma.$disconnect()
    })
  
    return newQueue;
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