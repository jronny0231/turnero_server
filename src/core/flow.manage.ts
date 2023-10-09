
// ***** OBJETO CON METODOS QUE ADMINSTRAN LA SECUENCIA DE SERVICIOS ***** //
// ****** PREPARAN UNA LISTA DE SERVICIOS POR TURNO EN ESTADO LOCAL ****** //
// *** MODIFICAN EL ORDEN DE LOS SERVICIOS LOCALMENTE (Y EN BASE DE DATOS) *** //

import { PrismaClient, Servicios_dependientes, Turnos } from "@prisma/client";
import { prismaTodayFilter } from "../utils/time.helpers";

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
 ✅ > metodo publico getUnrelatedFirstService
 * Devuelve el id del primer servicio sin relacion con turno creado
 * segun la relacion en el protocolo almacenado en la tabla Servicios_seguros
 * mediante la conjetura de los siguientes campos:
 * - Seguro_id: del cliente, si no tiene se usa 1 (NO ASEGURADO)
 * - Sucursal_id
 * - Servicio_destino_id: disponible en sucursal
 * y devuelve el id del siguiente servicio.
 * Si no encuentra ningun servicio devuelve el servicio_id 1
 * 
 ✅ > metodo publico addNewFlowList
 * Evento disparando por la creacion de un nuevo turno en el sistema
 * obtiene la lista de servicios relacionados al seguro del cliente del turno
 * y crea un nuevo registro con el id del turno y la lista ordenada por prioridad
 * en el campo JSON correspondiente.
 * 
 ✅  > metodo publico updatePositionOrderList
 * Disparado por el cambio de estado de un turno o por condiciones especiales
 * por un agente en la cola de un servicio particular para actualizar en todos
 * los turnos que cumplan con la siguiente condicion:
 * - Fecha del dia presente
 * - Servicio_actual
 * - Sucursal
 * Requiere el turno_id y la nueva posicion (opcional), en caso de mandar una
 * nueva posicion, el turno ocupa ese posicion y los turnos anteriores se mueven
 * hacia delante.
 * 
 * > metodo publico updateFlowList
 * Modifica la lista de servicios vinculados en un registro de Servicios_dependientes
 * mediante una coleccion de objetos del tipo {orden: number, servicio_id: number}.
 * 
 * > metodo publico removeFlowList
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
        return await prisma.servicios_seguros.findMany({
            where: (turno === undefined) ?  { estatus: true } : {
                estatus: true,
                servicio_destino_id: turno.servicio_destino_id,
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
                servicio_destino_id: true,
                servicio: true,
                cobertura: true,
                prioridad: true,
            }, orderBy: { prioridad: 'asc' }
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
        
        
    } catch (error) {
        console.error(`Error trying get services in Servicios_Seguros, turno_id: ${turno?.id}`, {error})
        return null
    }
}
/* Sin uso por el momento, mover al controlador
const getAllRelatedServices = async () => {
    try {

        const listas = await prisma.servicios_dependientes.findMany()
        
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
*/

const getRelatedServicesListByQueue = async ({turno_id}: {turno_id: number}) => {
    try {
        const lista = await prisma.servicios_dependientes.findFirst({
            where: { turno_id },
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


type UnrelatedFilter = {
    seguro_id?:number | null,
    sucursal_id:number,
    servicio_destino_id:number
}
/**
 * Devuelve el id del primer servicio segun la relacion en el protocolo
 * almacenado en la tabla Servicios_seguros mediante la conjetura de los
 * siguientes campos:
 * - Seguro_id: del cliente, si no tiene se usa 1 (NO ASEGURADO)
 * - Sucursal_id
 * - Servicio_destino_id: disponible en sucursal
 * y devuelve el id del siguiente servicio.
 * Si no encuentra ningun servicio devuelve el servicio_id 1
 * @param seguro_id number
 * @param sucursal_id number
 * @param servicio_destino_id number
 * @returns servicio_actual_id
 */
export const getUnrelatedFirstService = async ({seguro_id, sucursal_id, servicio_destino_id}: UnrelatedFilter): Promise <number> => {
    try {
        const findService = await prisma.servicios_seguros.findFirst({
            where: {
                seguro_id: seguro_id ?? 0,
                servicio_destino_id: servicio_destino_id,
                servicio: {
                    Servicios_departamentos_sucursales: {
                        some: {
                            departamento_sucursal: {
                                sucursal_id: sucursal_id
                            }
                        }
                    }
                }
            },
            select: {
                servicio: true
            }
        })
        if (findService === null) throw new Error('Filtered servicio was not found')

        return findService.servicio.id

    } catch (error) {
        console.error(`Error trying get unrelated first service_id using:
            seguro_id=${seguro_id}, 
            sucursal_id=${sucursal_id} and
            servicio_destino_id=${servicio_destino_id}`, {error} )

        return 1
    }    
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
        

    } catch (error) {
        return null
    }
}

type PosicionOrderType = {
    turno_id: number, 
    nueva_posicion?: number
    servicio_actual_id?: number
}

/**
 * Disparado por el cambio de estado de un turno o por condiciones especiales
 * por un agente en la cola de un servicio particular para actualizar en todos
 * los turnos que cumplan con la siguiente condicion:
 * - Fecha del dia presente
 * - Servicio_actual
 * - Sucursal
 * Requiere el turno_id y la nueva posicion (opcional), en caso de mandar una
 * nueva posicion, el turno ocupa ese posicion y los turnos anteriores se mueven
 * hacia delante.
 * @param turno_id
 * @param servicio_actual_id
 * @param nueva_posicion
 * @returns 
 */
export const updatePositionOrderList = async ({turno_id, servicio_actual_id, nueva_posicion}: PosicionOrderType) => {
    try {
        const find = await prisma.turnos.findFirst({
            where: { id: turno_id}
        })
        

        if (find === null) throw new Error(`No turnos was found with id: ${turno_id}`)

        // Si se paso un numero mayor a 0 en el argumento nueva_posicion se incluye la condicional
        const lowerThan = (nueva_posicion && nueva_posicion > 0) ? {cola_posicion: { lte: nueva_posicion}} : {}
        
        // Se filtran todos los turnos registrados activos en la sucursal 
        const allActiveUpdatableTurnos = await prisma.turnos.findMany({
            where: {
                ...lowerThan,
                fecha_turno: prismaTodayFilter(),
                sucursal_id: find.sucursal_id,
                estado_turno: { descripcion: { notIn: [ 'TERMINADO', 'CANCELADO' ]} },
                servicio_actual_id: servicio_actual_id ?? find.servicio_actual_id,
                cola_posicion: { not: 0 }
            }
        })
        

        // Se actualizara el orden mediante la doble ternaria
        // Ternaria 1) Turno mapeando es igual al turno recibido ?
        // verdadero: Ternaria 2) Nueva_posicion es un numero mayor a cero ?
        // verdadero: verdadero: Cola_posicion es igual a nueva_posicion.
        // verdadero: falso: Cola_posicion es igual a cero
        // falso: Cola_posicion es igual a la cola_posicion menos 1
        const result = await prisma.$transaction([
            ...allActiveUpdatableTurnos.map( turno => {
                return prisma.turnos.update({
                    where: { id: turno.id },
                    data: {
                        cola_posicion:
                            turno.id === turno_id
                                ? (nueva_posicion && nueva_posicion > 0)
                                    ? nueva_posicion
                                    : 0
                                : turno.cola_posicion - 1
                    }
                })
            })   
        ])

        return {rowsAffected: result.length}
        
    } catch (error) {
        console.error(`Error updating cola_posicion for all related Turnos with turno_id: ${turno_id}`, {error})
        return null

    } finally {
         await prisma.$disconnect()
    }
}