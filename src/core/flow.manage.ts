
// ***** OBJETO CON METODOS QUE ADMINSTRAN LA SECUENCIA DE SERVICIOS ***** //
// ****** PREPARAN UNA LISTA DE SERVICIOS POR TURNO EN ESTADO LOCAL ****** //
// *** MODIFICAN EL ORDEN DE LOS SERVICIOS LOCALMENTE (Y EN BASE DE DATOS) *** //

import { PrismaClient, Servicios_dependientes, Turnos } from "@prisma/client";

///// LOGICA DE NEGOCIO /////
/**
 ✅ > metodo privado getAvailableRelatedServices
 * Devuelve una lista de objetos con referencias de seguro y servicios
 * relacionados segun el protocolo creado en la base de datos en la tabla
 * Servicios_seguro buscados por el id del seguro, si no se digita el id
 * se devolveran todos los registros.
 * 
 ✅ > metodo privado getRelatedServicesListByQueue | getAllRelatedServicesList
 * Devuelve una lista de objetos con referencias de turnos y los servicios 
 * relacionados en el orden como se encuentran registrados en la base de datos
 * si se le pasa el argumento id de turno, filtra el arreglo y solo devuelve
 * el objeto relacionado al turno usando la tabla Servicios_dependientes.
 * 
 ✅ > metodo publico getNextService
 * Acepta el id del turno y devuelve el id del siguiente servicio
 * segun el orden en la tabla Servicios_dependientes y el servicio_actual,
 * si no hay mas servicios en la lista devuelve el id del servicio_actual.
 * 
 * > metodo public addNewFlowList
 * Evento disparando por la creacion de un nuevo turno en el sistema
 * obtiene la lista de servicios relacionados al seguro del cliente del turno
 * y crea un nuevo registro con el id del turno y la lista ordenada por prioridad
 * en el campo JSON correspondiente.
 * 
 * > metodo public updateFlowList
 * Modifica la lista de servicios vinculados en un registro de Servicios_dependientes
 * mediante una coleccion de objetos del tipo {orden: number, servicio_id: number}.
 * 
 * > metodo public removeFlowList
 * Remueve el registro de la base de datos correspondiente a la coincidencia del tunro_id
 * en la tabla Servicio_dependientes por evento de la tabla Turnos (Cascade) o por
 * cancelacion de flujo.
 */

type ListaServiciosJSON = Array <{
    servicio_id: number,
    orden: number
}>

const prisma = new PrismaClient();

const getAvailableRelatedServices = async ({turno}: {turno?: Turnos}) => {
    try {
        if (turno !== undefined) {
            return await prisma.servicios_seguros.findMany({
                where: {
                    estatus: true,
                    servicio: {
                        turnos: {
                            some: {
                                id: turno.id
                            }
                        },
                        Servicios_departamentos_sucursales: {
                            some: {
                                departamento_sucursal: {
                                    sucursal_id: turno.sucursal_id
                                }
                            }
                        }

                    }
                },
                select: {
                    protocolo_id: true,
                    servicio: true,
                    cobertura: true,
                    prioridad: true,
                }, orderBy: { prioridad: 'asc' }
            })
            .finally(async () => {
                await prisma.$disconnect()
            })
        }

        return await prisma.servicios_seguros.findMany({
            where: { estatus: true },
            select: {
                protocolo_id: true,
                servicio: true,
                cobertura: true,
                prioridad: true,
            },
            orderBy: { prioridad: 'asc' }
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
        
    } catch (error) {
        console.error(`Error trying get services in Servicios_Seguros, turno_id: ${turno?.id}`, {error})
        return null
    }
}

export const getAllRelatedServices = async () => {
    try {

        const listas = await prisma.servicios_dependientes.findMany()
        .finally(async () => {
            await prisma.$disconnect()
        })
        if (listas.length = 0) return null

        return listas.map(lista => {
            if (lista.serie_servicios &&
                typeof lista.serie_servicios === 'object' &&
                Array.isArray(lista.serie_servicios)) {
                    return {
                        ...lista,
                        serie_servicios: lista.serie_servicios as ListaServiciosJSON
                    }
            }
            return null
        }).filter(entry => entry !== null)

    } catch (error) {
        console.error('Error trying get all Servicios_Dependientes', {error})
        return null
    }
}

const getRelatedServicesListByQueue = async ({turno_id}: {turno_id: number}) => {
    try {
        const lista = await prisma.servicios_dependientes.findFirst({
            where: { turno_id },
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
        if (lista === null) return null

        if (
            lista.serie_servicios &&
            typeof lista.serie_servicios === 'object' &&
            Array.isArray(lista.serie_servicios)
          ) {
            return {
                ...lista,
                serie_servicios: lista.serie_servicios as ListaServiciosJSON
            }
          }
        return null

    } catch (error) {
        console.error(`Error trying get Servicios_Dependientes by turno_id: ${turno_id}`, {error})
        return null
    }
}

/**
 * Acepta el id del turno y devuelve el id del siguiente servicio
 * segun el orden en la tabla Servicios_dependientes y el servicio_actual,
 * si no hay mas servicios en la lista devuelve el id del servicio_actual
 * @param turno_id 
 * @returns Promise servicio_id or null
 */
export const getNextServiceId = async ({turno_id}: {turno_id: number}): Promise<number | null> => {
    try {
        const turno = await prisma.turnos.findFirst({
                where: { id: turno_id  }
            })
            .finally(async () => {
                await prisma.$disconnect()
            })
        if (turno === null) return null

        if (turno.servicio_actual_id === turno.servicio_destino_id) return turno.servicio_destino_id

        const servicesList = await getRelatedServicesListByQueue({turno_id})
        if (servicesList === null) return null

        const current = servicesList.serie_servicios
            .filter(serie => serie.servicio_id === turno.servicio_actual_id)[0]
        
        const next = servicesList.serie_servicios
            .filter(servicio => servicio.orden === current.orden + 1)[0]

        if (next === null) throw new Error("Cant get next service according to orden column")

        return next.servicio_id

        
    } catch (error) {
        console.error(`Error getting next service id in Turno_id: ${turno_id}`, {error})
    }

    return null
}

/**
 * Evento disparando por la creacion de un nuevo turno en el sistema
 * obtiene la lista de servicios relacionados al seguro del cliente del turno
 * y crea un nuevo registro con el id del turno y la lista ordenada por prioridad
 * en el campo JSON correspondiente.
 * @param turno 
 * @returns 
 */
export const addNewFlowList = async ({turno}: {turno: Turnos}): Promise<Servicios_dependientes | null> => {
    try {
        const relatedService = await getAvailableRelatedServices({turno})
        if (relatedService === null) return null

        relatedService.sort((a, b) => {
            return a.prioridad - b.prioridad // sort asc (a is minor to b)
        })

        const serie_servicios: ListaServiciosJSON = relatedService.map(lista => {
            return {
                orden: lista.prioridad,
                servicio_id: lista.servicio.id
            }
        })

        return await prisma.servicios_dependientes.create({
            data: {
                turno_id: turno.id,
                serie_servicios
            }
        })
        .finally(async () => {
            await prisma.$disconnect()
        })

    } catch (error) {
        return null
    }
}