import { Agentes, Departamentos, Pantallas, PrismaClient, Servicios, Sucursales, Tipado_estados_turnos } from '@prisma/client';
import { Atenciones_turnos_servicios } from '@prisma/client';
import { Turnos, turno_llamada } from "@prisma/client"
import { UUID } from "crypto"
import { stringToUUID } from "../utils/filtering"
import { prismaTodayFilter } from '../utils/time.helpers';
import { DisplayQueue, attendingState } from '../@types/queue';
import { addNewFlowList, getNextServiceId, updatePositionOrderList } from './flow.manage';


// ***** OBJETO CON METODOS QUE SETEAN LOS ESTADOS DE LOS TURNOS ***** //
// ************* TANTO EN ESTADO LOCAL COMO DE LLAMADA *************** //

///// LOGICA DE NEGOCIO /////
/**
 * const QUEUE_STATE
 * Se administra un estado local para las llamadas recurrentes de nuevos turnos
 * El estado local tendra un listado de todos los turnos filtrando:
 * - Solo turnos del dia presente
 * - Solo turnos activos (sin finalizar o cancelados)
 * Ademas de guardar:
 * - Los estados de atencion de cada turno por agente y por servicio atendidos
 * - Un id secuencial para busqueda
 * - El id de la pantalla que presentara el turno
 * 
 * Cuando se actualice uno de los registros por actividad de las pantallas o agentes,
 * se ejecutara una funcion asincrona para actualizar o registrar los datos en la base de datos.
 * 
 * const PERSISTENT_DATA
 * Se tendra en una constante local los datos persistentes de las sucursales, sus pantallas y agentes
 * la cual se mantendra actualizandose segun cambios por controladores.
 */

/**
 ✅ El agente cambia su estado de esperando a true
     indicando que esta libre y esperando atender un nuevo turno. > "setWaitingState"
 ✅ El loop de la Pantalla mantiene una llamada a turnos en estado NUEVA_SESION o ESPERANDO, "getCallQueueState"
     si coincide la sucursal + servicio_actual + estado libre de agente y cola_posicion en 1,
    el loop de la pantalla realiza las sigueintes acciones:
 ✅ - Devuelve los datos del turno en tipo DisplayQueue "getCallQueueState"
 ✅ - Crea (si no existe) un Atenciones_Turnos_Llamada en CALLING usando como referencia: "setCallQueueState"
      -- El primer AGENTE libre de la sucursal y departamento
      -- El servicio actual del turno (como servicio subsiguiente)
 ✅ El agente obtiene mediante el loop getAttendingQueueByUserId el turno que esta siendo llamado para su estacion
     y procede a cambiar el estatus del turno y de la llamada a ATENDIENDO
     y la pantalla setea la llamada a CALLED
 ✅ Si el agente desea volver a llamar el turno, el mismo debe estar en ESPERANDO o EN_ESPERA
 *  poniendo tambien el estado de la llamada en UNCALLED.
 */

/**
 * TurnosActivos: Filtra los que no tienen hora_fin,
 * setAttendingState: Agrega el tiempo de hora_inicio cuando cambia el estado a ATENDIENDO,
 * cuando termina el turno, cambia el estado a:
 * - Si servicio_actual es igual a servicio_destino > TERMINADO
 * - Si servicio_actual no es igual a servicio_destino > ESPERANDO
 * 
 * Propiedades: [Queue_State: {Turnos > TurnosActivos} ]
 * Metodos: [setWaitingState, getCallQueueState, setCallQueueState, getActiveQueueList, setAttendingState]
 */



interface TurnosActivos extends Atenciones_turnos_servicios {
    state_id: number
    departamento: Departamentos
    estado_turno_name?: Tipado_estados_turnos
    servicio: Servicios;
    agente: Agentes;
}

interface QueueStateType extends Turnos {
    atencion: Array< TurnosActivos >
    displaysUUID: Array< UUID >
    estado_turno_name?: Tipado_estados_turnos
}

interface AgentesWithService extends Agentes {
    esperando_servicios_destino_id?: Array <number>,
    grupo_servicio_id: number
}

interface GlobalOffices extends Sucursales {
    conjunto_agentes: Array < AgentesWithService >
    conjunto_servicios: Array < Servicios >
    conjunto_departamentos: Array < Departamentos >
    conjunto_pantallas: Array < Pantallas > 
}


const QUEUE_STATE: Array <QueueStateType>  = []
const PERSISTENT_DATA: Array <GlobalOffices> = []

const prisma = new PrismaClient();

/**
 * Metodo con ejecucion asincrona para inicializar
 * las constantes en caso de que esten vacias.
 */
export const initData = () => {
    if (PERSISTENT_DATA.length === 0) refreshPersistentData()
    if (QUEUE_STATE.length === 0) refreshQueueState()
}

/**
 * Metodo con ejecucion asincrona para actualizar
 * o setear los datos en la constante PERSISTENT_DATA
 */
export const refreshPersistentData = () => {
    new Promise(  async (resolve, reject) => {
        try {
            const data = await prisma.sucursales.findMany({
                include: {
                    departamentos_sucursales: {
                        select: {
                            agentes: {
                                include: {
                                    tipo_agente: {
                                        select: {
                                            grupo_servicio_id: true
                                        }
                                    }
                                }
                            },
                            servicios_departamentos_sucursales: {
                                select: { servicio: true,
                                    departamento_sucursal: {
                                        select: { departamento: true }
                                    }
                                }
                            }
                        }
                    },
                    pantallas: true
                },
                where: {
                    estatus: true,
                    departamentos_sucursales: {
                        some: {
                            agentes: { some: { estatus: true } },
                            servicios_departamentos_sucursales: {
                                some: { servicio: { estatus: true } }
                            }
                        }
                    },
                    servicios_sucursales: { some: { disponible: true } },
                    pantallas: { some: { estatus: true } }
                }
            })
            .finally(async () => {
                await prisma.$disconnect()
            })

            if (data === null) throw new Error("data got from database is empty.")
            console.log({data})
            PERSISTENT_DATA.length = 0

            data.map(sucursal => {

                const conjunto_agentes = sucursal.departamentos_sucursales
                        .map(depsuc => {
                            return {
                                ...depsuc.agentes.map(agente => {
                                    return {
                                        ...agente,
                                        grupo_servicio_id: agente.tipo_agente.grupo_servicio_id
                                    }
                                })
                            }
                        })[0]
                        .filter(entry => entry !== null);
                        
                const conjunto_servicios = sucursal.departamentos_sucursales
                        .map(depsuc => depsuc.servicios_departamentos_sucursales
                            .filter(entry => entry !== null)
                            .map(serdepsuc => serdepsuc.servicio))
                        .filter(entry => entry !== null)[0]

                const conjunto_departamentos = sucursal.departamentos_sucursales
                        .map(depsuc => depsuc.servicios_departamentos_sucursales
                            .filter(entry => entry !== null)
                            .map(serdepsuc => serdepsuc.departamento_sucursal.departamento))
                        .filter(entry => entry !== null)[0]
                
                const entry: GlobalOffices = {
                    ...sucursal,
                    conjunto_servicios,
                    conjunto_departamentos,
                    conjunto_agentes,
                    conjunto_pantallas: sucursal.pantallas
                }
                PERSISTENT_DATA.push(entry)
            })
            resolve(PERSISTENT_DATA)
            return true

        } catch (error) {

            console.error("Error trying setting up PERSISTEN_DATA on state", {error})
            reject(error)

            return false
        } finally {
            console.log("Async refresh PERSISTENT_DATA", {length: PERSISTENT_DATA.length})
        }
    })
}

/**
 * Metodo con ejecucion asincrona para subir el nuevo estado
 * del la constante PERSISTENT_DATA a la base de datos y refrescar el local
 */
const updatePersistentData = (newState: typeof PERSISTENT_DATA) => {
    new Promise ( async (resolve, reject) => {
        try {
            if (newState.length === 0) throw new Error('new state data is empty.')

            const agentes: Agentes[] = newState.flatMap(sucursal => {
                    if (sucursal.conjunto_agentes !== undefined) return sucursal.conjunto_agentes
                    return undefined
                }).filter(entry => entry !== undefined) as Agentes[]
            
            const pantallas: Pantallas[] = newState.flatMap(sucursal => {
                if (sucursal.conjunto_pantallas !== undefined) return sucursal.conjunto_pantallas
                return undefined
            }).filter(entry => entry !== undefined) as Pantallas[]

            const servicios: Servicios[] = newState.flatMap(sucursal => {
                if (sucursal.conjunto_servicios !== undefined) return sucursal.conjunto_servicios
                return undefined
            }).filter(entry => entry !== undefined) as Servicios[]

            const departamentos: Departamentos[] = newState.flatMap(sucursal => {
                if (sucursal.conjunto_departamentos !== undefined) return sucursal.conjunto_departamentos
                return undefined
            }).filter(entry => entry !== undefined) as Departamentos[]

            const result = await prisma.$transaction([
                ...newState.map(sucursal => prisma.sucursales.update({
                        data: {...sucursal},
                        where: { id: sucursal.id}
                    })),
                ...agentes.map(agente => prisma.agentes.update({
                        data: {...agente},
                        where: { id: agente.id}
                    })),
                ...pantallas.map(pantalla => prisma.pantallas.update({
                        data: {...pantalla},
                        where: { id: pantalla.id}
                    })),
                ...servicios.map(servicio => prisma.servicios.update({
                        data: {...servicio},
                        where: { id: servicio.id}
                    })),
                ...departamentos.map(departamento => prisma.departamentos.update({
                        data: {...departamento},
                        where: { id: departamento.id}
                    })),
            ])
            .finally(async () => {
                await prisma.$disconnect()
            })

            resolve(result)
            return true

        } catch (error) {

            console.error("Error trying massive update persistent state data to database.", {error})
            reject(error)

            return false
        }
    })
}

/**
 * Metodo con ejecucion asincrona para actualizar
 * o setear el estado en la constante QUEUE_STATE
 */
export const refreshQueueState = () => {
    new Promise(  async (resolve, reject) => {
        try {
            const turnosActivos = await prisma.turnos.findMany({
                where: {
                    fecha_turno: prismaTodayFilter()
                },
                include: {
                    estado_turno: true,
                    atenciones_turnos_servicios: {
                        include: {
                            servicio: true,
                            agente: {
                                include: {
                                    departamento_sucursal: {
                                        select: {
                                            sucursal: {
                                                select: {
                                                    id: true,
                                                    pantallas: {
                                                        select: {
                                                            key: true
                                                        }
                                                    }
                                                }
                                            },
                                            departamento: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            })
            .finally(async () => {
                await prisma.$disconnect()
            })

            if (turnosActivos === null) throw new Error("data got from database is empty.")

            QUEUE_STATE.length = 0

            turnosActivos.map( turno => {
                const displaysUUID = turno.atenciones_turnos_servicios
                        .map(atenciones => atenciones.agente.departamento_sucursal.sucursal.pantallas)[0]
                        .map(pantalla => pantalla.key)
                        .map(key => stringToUUID(key))
                        .filter(entry => entry !== null) as Array< UUID >;

                const atencion: Array <TurnosActivos> = turno.atenciones_turnos_servicios
                        .map((atencion, index) => {
                            return {
                                ...atencion,
                                state_id: index,
                                servicio: atencion.servicio,
                                departamento: atencion.agente.departamento_sucursal.departamento,
                                agente: atencion.agente,
                                estado_turno_name: turno.estado_turno?.descripcion
                            }
                        })
                        .filter(entry => entry !== null)
                
                const entry: QueueStateType = {
                    ...turno,
                    estado_turno_name: turno.estado_turno?.descripcion,
                    atencion,
                    displaysUUID
                }

                QUEUE_STATE.push(entry)
            })
            resolve(PERSISTENT_DATA)
            return true

        } catch (error) {

            console.error("Error trying setting up PERSISTEN_DATA on state", {error})
            reject(error)

            return false
        } finally {
            console.log("Async refresh QUEUE_STATE", {length: QUEUE_STATE.length})
        }
    })
}

/**
 * Metodo con ejecucion asincrona para subir el nuevo estado
 * del la constante QUEUE_STATE a la base de datos y refrescar el local
 */
const updateQueueState = (newState: typeof QUEUE_STATE) => {
    new Promise ( async (resolve, reject) => {
        try {
            if (newState.length === 0) throw new Error('new state data is empty.')

            const atenciones: Atenciones_turnos_servicios[] = newState.flatMap(turnos => turnos.atencion)

            const result = await prisma.$transaction([
                ...newState.map(turno => prisma.turnos.update({
                    data: {...turno},
                    where: { id: turno.id }
                })),
                ...atenciones.map(atencion => prisma.atenciones_turnos_servicios.update({
                    data: {...atencion},
                    where: {
                        turno_id_agente_id_servicio_id: {
                            turno_id: atencion.turno_id,
                            agente_id: atencion.agente_id,
                            servicio_id: atencion.servicio_id
                        }
                    }
                })),
            ])
            .finally(async () => {
                await prisma.$disconnect()
            })

            resolve(result)
            refreshQueueState()
            return true

        } catch (error) {

            console.error("Error trying massive update persistent state data to database.", {error})
            reject(error)

            return false
        }
    })
}

/**
 * Devuelve el servicio que coincida con la ID
 * @param id servicio
 * @returns Servicio
 */
export const getServiceById = (id: number) => {
    return PERSISTENT_DATA.map(sucursal => 
        sucursal.conjunto_servicios?.filter(servicio => servicio.id === id)[0]
    )[0] ?? null
}

/**
 * Devuelve el listado de turnos activos en la sucursal
 * @param id sucursal
 * @returns 
 */
export const getQueuesListByService = (
    {sucursal_id, servicio_destino_id, servicio_actual_id}:
    {sucursal_id: number, servicio_destino_id?: number, servicio_actual_id?: number}) => {
    return QUEUE_STATE.filter(turno => 
        turno.sucursal_id === sucursal_id
        && (servicio_actual_id) ? turno.servicio_actual_id === servicio_actual_id : true
        && (servicio_destino_id) ? turno.servicio_destino_id === servicio_destino_id : true
    )
}

export const getSucursalByUserId = (id: number) => {
    return PERSISTENT_DATA.filter(sucursal =>
        sucursal.conjunto_agentes?.filter(agente => agente.usuario_id === id)[0]
    )[0] as Sucursales
}

type availableServs = {
    sucursal_id: number
    grupo_id?: number
    es_seleccionable?: boolean
}

export const GetAllAvailableServicesInSucursal = ({sucursal_id, grupo_id, es_seleccionable}: availableServs) => {
    const result = PERSISTENT_DATA.flatMap(sucursal => {
        if (sucursal.id === sucursal_id) {
            return  sucursal.conjunto_servicios
                ?.filter(servicio => (
                    grupo_id ? servicio.grupo_id === grupo_id : true
                    && servicio.es_seleccionable === (es_seleccionable === undefined ? true : es_seleccionable)
                )) ?? null
        }
        return null
    }).filter(entry => entry !== null)

    if (result.length === 0) return null
    return result as Servicios[]
}

type agentStateType = {
    agente_id: number,
    usuario_id: number,
    servicios_destino_id?: Array <number>,
    esperando?: boolean
}
/**
 * Metodo sincrono para modificar la disponibilidad del agente.
 * opcionalmente puede establecer con que grupo de servicios el agente
 * va a trabajar, si no lo setea se le asigna del flujo.
 * @param param0 
 * @returns 
 */
export const setWaitingState = ({agente_id, usuario_id, esperando = true, servicios_destino_id}: agentStateType): boolean => {
    const found = PERSISTENT_DATA.map(sucursal => {
        if (sucursal.conjunto_agentes !== undefined){
            return sucursal.conjunto_agentes.filter(agente => (
                agente.id === agente_id
                && agente.usuario_id === usuario_id // Valida que el agente tenga relacion con el usuario logeado
            ))[0]
        }
        return null
    }).filter(entry => entry !== null)[0]

    if (found === null) return false
    
    const newState = PERSISTENT_DATA.map(sucursal => {
        if (sucursal.conjunto_agentes !== undefined) {
            const newAgentes = sucursal.conjunto_agentes.map(agente => {
                if (agente.id === found.id) {
                    agente.esperando = esperando // Setear el estado
                    agente.esperando_servicios_destino_id = servicios_destino_id
                }
                return agente
            })
            return {
                ...sucursal,
                agentes: newAgentes
            }
        }
        return sucursal
    })

    updatePersistentData(newState)
    
    return true
}

/**
 * Metodo ejecutado por la pantalla en loop
 * Crea (si no existe) un Atenciones_Turnos_Llamada en UNCALLED usando como referencia: "getCallQueueState"
 * -- El primer AGENTE libre de la sucursal y departamento
 * -- El servicio actual del turno (como servicio subsiguiente)
 * Devuelve el primer turno sin llamar del estado que cumple las siguientes:
 * - pantalla sucursal
 * - turnos en estado NUEVA_SESION o ESPERANDO
 * - cola_posicion en 1
 * - servicio_actual
 * - estado libre de agente
 * - la llamada en UNCALLED
 * @param param0 
 * @returns 
 */
export const getCallQueueState = ({displayUUID}: {displayUUID: UUID}): DisplayQueue | null => {
    
    if (PERSISTENT_DATA.length === 0) refreshPersistentData()
    if (QUEUE_STATE.length === 0) refreshQueueState()

    const firstFilter: QueueStateType | null = QUEUE_STATE.filter( turno => {
        return (
            turno.displaysUUID?.includes(displayUUID) // Filtro de sucursal por pantalla
            && turno.estado_turno_name !== undefined
            && ['NUEVA_SESION', 'ESPERANDO'].includes(turno.estado_turno_name)
            && turno.cola_posicion === 1 // La posicion del turno en la cola es 1, osea el primero.
        )
    } )[0] ?? null
        
    if (firstFilter === null) return null

    const firstUncalled = firstFilter.atencion
        .filter(entry => (
            entry.estatus_llamada === "UNCALLED"
            &&  entry.estado_turno_name !== undefined
            &&  ['NUEVA_SESION','ESPERANDO'].includes(entry.estado_turno_name)
        ))[0] ?? null


    if (firstUncalled === null) {

        // Filtrar todos agente con columna esperando en true
        // en la sucursal y servicio correspondiente al turno
        const freeAgents = PERSISTENT_DATA
        .filter(sucursal => sucursal !== null)
        .map(sucursal => {
            if (sucursal.conjunto_servicios !== undefined
                && sucursal.conjunto_agentes !== undefined
                && sucursal.conjunto_pantallas !== undefined
                && sucursal.id === firstFilter.sucursal_id) {
                    const servicio = sucursal.conjunto_servicios.filter(servicio => (
                        servicio.id === firstFilter.servicio_actual_id
                    ))[0]
                    return sucursal.conjunto_agentes.filter(agente => (
                        (agente.esperando_servicios_destino_id === undefined ||
                            agente.esperando_servicios_destino_id.includes(firstFilter.servicio_destino_id))
                        && servicio.grupo_id === agente.grupo_servicio_id
                        && agente.esperando
                    ))
            }
            return null
        })[0]

        if (freeAgents === null) return null

        const firstFreeAgent = freeAgents.filter( agente => agente !== null)[0]
        const turno: Turnos = {...firstFilter} as Turnos

        findOrCreateAttendingReg({turno, agente_id: firstFreeAgent.id, servicio_id: turno.servicio_actual_id})
            
        return null
    }

    const [letters, numbers] = firstFilter.secuencia_ticket.match(/([a-zA-Z]+)|(\d+)/g) ?? []
    
    const newCall: DisplayQueue = {
        id: firstUncalled.state_id,
        tittle: getDisplayCallTittle({turno: firstFilter}),
        callStatus: firstUncalled.estatus_llamada,
        message: {
            servicio: firstUncalled.servicio.descripcion,
            departamento: firstUncalled.departamento.descripcion
        },
        voice: {
            uri: `/audio/stream-queue?
                    letters=${letters}
                    &number=${numbers}
                    &department=${firstUncalled.departamento.siglas}`
        }
    }

    return newCall
}

/**
 * Metodo ejecutado por la pantalla
 * Actualizacion del estado de la llamada a travez de la coincidencia
 * @param param0 
 * @returns 
 */
export const setCallQueueState = ({state_id, displayUUID, estatus}: {state_id: number, displayUUID: UUID, estatus: turno_llamada}): boolean => { 
    const firstFilter: QueueStateType | null = QUEUE_STATE.filter( entry => 
        entry.displaysUUID?.includes(displayUUID) )[0]

    
    const attendReg = firstFilter.atencion.filter(attend => attend.state_id === state_id)[0] ?? null
    if (attendReg === null) return false

    attendReg.estatus_llamada = estatus

    const newState = QUEUE_STATE.map(turno => {
        if (turno.id === firstFilter.id && turno.atencion !== null) {
            const atencion = turno.atencion.map(atencion => {
                if (atencion.state_id === state_id)  return attendReg
                return atencion
            })
            return {
                ...turno,
                atencion
            }
        }
        return turno
    })

    updateQueueState(newState)

    /*
    new Promise( async (resolve, rejected) => {
        await prisma.atenciones_turnos_servicios.update({
            data: {
                estatus
            },
            where: {
                turno_id_agente_id_servicio_id: {
                    turno_id: firstFilter.id,
                    agente_id: attendReg.agente_id,
                    servicio_id: attendReg.servicio_id,
                },
                turno: {
                    sucursal: {
                        pantallas: {
                            some: {
                                key: displayUUID
                            }
                        }
                    }
                }
            }
        })
        .then(result => {
            resolve({result})
            refreshQueueState()
        })
        .catch(error => {
            console.log("Error updating Atenciones_Turnos_Servicios.estatus by Display", {error})
            rejected(error)
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
    })
    */

    return true
}

interface activeQueueStateType extends Omit<QueueStateType, 'atencion'> {
    activo: TurnosActivos
} 

/**
 * Metodo ejecutado por la pantalla en loop
 * para actualizar la lista de turnos que estan siendo atendidos
 * o esperando a atender
 * @param param0 
 * @returns 
 */
export const getActiveQueueList = ({displayUUID}: {displayUUID: UUID}): Array<activeQueueStateType> | null => {
    
    const activeTurnosBySucursal = QUEUE_STATE.filter( turno => {
        return (
            turno.displaysUUID?.includes(displayUUID) // Filtro de turno por pantalla
            && turno.estado_turno_name !== undefined
            && ['ESPERANDO', 'ATENDIENDO', 'EN_ESPERA'].includes(turno.estado_turno_name)
        )
    })
    if (activeTurnosBySucursal.length === 0) return null

    const filterActiveAttending = activeTurnosBySucursal.map(turno => {

        return {
            ...turno,
            activo: turno.atencion.filter(entry => entry.servicio_id === turno.servicio_actual_id )[0]
        }
    })

    return filterActiveAttending as Array <activeQueueStateType>
}

/**
 * Metodo ejecutado en loop por el agente mientras su estado de Esperando esta en true
 * mediante el id del usuario logueado correspondiente al agente de servicio
 * devuelve el turno activo que cumpla con las siguientes condiciones:
 * - registro de atencion (creado por la pantalla) con el id del agente
 * - estado de la llamada diferente a UNCALLED, indicando que no ha sido llamado
 * - id del estado de la antencion en 1 o 2 indicando que es NUEVO o ESPERANDO
 * @param usuario_id 
 * @returns Turno
 */
export const getAttendingQueueByUserId = ({usuario_id}: {usuario_id: number}) => {

    const agente = PERSISTENT_DATA.map(sucursal => 
        sucursal.conjunto_agentes?.filter(agente => (
            agente.usuario_id === usuario_id
            && agente.esperando === true
        ))[0]
    )[0]
    if (agente === undefined) return null
    
    const turnoActivo = QUEUE_STATE.map(turno =>
        turno.atencion.filter(atencion => (
            atencion.agente_id === agente.id
            && atencion.estatus_llamada !== 'UNCALLED'
            && atencion.estado_turno_name !== undefined
            && ['NUEVA_SESION', 'ESPERANDO'].includes(atencion.estado_turno_name)
        ))[0] ?? null
    )[0] ?? null

    return turnoActivo
}

/**
 * Metodo ejecutado por el agente
 * Agrega el tiempo de hora_inicio cuando cambia el estado a ATENDIENDO,
 * si se pone EN_ESPERA, DESCANSANDO se setea la HORA_FIN y al reanudar se hace lo siguiente:
 * - Se toma la diferencia entre la hora actual con la HORA_FIN en segundos
 * y se guarda en el campo ESPERA_SEGUNDOS.
 * cuando termina el turno, cambia el estado a:
 * - Si servicio_actual es igual a servicio_destino > TERMINADO
 * - Si servicio_actual no es igual a servicio_destino > ESPERANDO
 */
export const setAttendingState = async ({agente_id, servicio_id, turno_id, estado_turno_id, razon_cancelado_id}: attendingState): Promise<boolean> => {
    const firstFilter = QUEUE_STATE.filter(entry => entry.id === turno_id)[0] ?? null;
    if (firstFilter === null) return false

    const attendReg = firstFilter.atencion
        .filter(entry => (
                entry.agente_id === agente_id
                && entry.servicio_id === servicio_id
            ))[0] ?? null
    if (attendReg === null) return false

    const estado_turno = await prisma.estados_turnos.findFirst({
        where: { id: estado_turno_id }
    })

    if (estado_turno === null) return false

    firstFilter.estado_turno_id = estado_turno.id
    firstFilter.estado_turno_name = estado_turno.descripcion

    attendReg.estado_turno_id = estado_turno.id
    attendReg.estado_turno_name = estado_turno.descripcion

    const nowTime = new Date()
    const preWaitSeconds = attendReg.espera_segundos ?? 0
    const endTime = attendReg.hora_fin ?? nowTime
    const waitTimeSeconds =  preWaitSeconds + Math.floor((nowTime.getTime() - endTime.getTime()) / 1000)
    const {descripcion: estado} = estado_turno
    
    let attendWillDelete: boolean = false
    
    /**
     * El agente devuelve el turno a la cola para el mismo servicio
     * - Elimina la atencion registrada
     * - Situa el orden del turno X posiciones atras
     */
    if (['NUEVA_SESION'].includes(estado)) {
        attendWillDelete = true
        updatePositionOrderList({turno_id, nueva_posicion: 3}).then(result => {
            console.log(`Rows updated when turno_id: ${turno_id} was reset to NUEVA_SESION`, result)
        })
    }

    /**
     * El agente inicia o reinicia los procesos con el cliente
     * - Pone el orden del cliente en 0
     * - Adelanta el orden de los demas turnos 
     */
    if (['ATENDIENDO'].includes(estado)) {
        attendReg.espera_segundos = waitTimeSeconds
        if (attendReg.hora_inicio === null) {
            attendReg.hora_inicio = nowTime
            updatePositionOrderList({turno_id})
        }
        attendReg.estatus_llamada = 'CALLED'
    }

    /**
     * EN_ESPERA    > El cliente espera a que el agente termine una tarea sin relacion
     * ESPERANDO    > El agente espera a que el cliente termine una tarea
     * DESCANSANDO  > El cliente salio a almorzar o hacer una pausa prolongada
     * TERMINADO    > El agente concluye las tareas con el cliente
     * CANCELADO    > El agente cancela las tareas con razon
     * - Agrega la hora actual como hora_fin en la atencion actual
     */
    if (['EN_ESPERA','ESPERANDO','DESCANSANDO','TERMINADO','CANCELADO'].includes(estado)) {
        attendReg.hora_fin = nowTime
    }

    /**
     * El agente espera a que el cliente termine una tarea
     * Por lo regular es llamado por la pantalla
     * - Pone el estado de llamada de la atencion en UNCALLED
     */
    if (['ESPERANDO'].includes(estado)) {
        attendReg.estatus_llamada = 'UNCALLED'
    }

    /**
     * El cliente salio a almorzar o hacer una pausa prolongada
     * - Sin accion implicita aun
     */
    if (['DESCANSANDO'].includes(estado)) {
        
    }

    /**
     * El agente concluye las actividades con el cliente
     * - Accede al objeto flow.manage.ts, obtiene el siguiente servicio
     * y realiza lo siguiente:
     ** > Si el servicio_actual no es igual al servicio_destino:
     * -- Obtiene el siguiente servicio segun el protocolo
     * -- Posiciona el orden del turno al final
     * -- Pone el estado del turno en NUEVA_SESION
     * -- Cambia el servicio actual por el servicio siguiente
     ** > Si el servicio_actual es igual al servicio_destino:
     * -- Pone el estado en TERMINADO
     */
    if (['TERMINADO'].includes(estado)) {
        const nextServiceId = await getNextServiceId({turno_id})
        if (nextServiceId === null) throw new Error('next service id returns null')

        if (nextServiceId !== firstFilter.servicio_destino_id) {
            const cantTurnosSiguientes = QUEUE_STATE.map(turno => {
                if (turno.servicio_actual_id === nextServiceId
                    && turno.sucursal_id === firstFilter.sucursal_id) {
                        return turno
                    }
                return null
            }).filter(entry => entry !== null).length

            firstFilter.servicio_actual_id = nextServiceId
            firstFilter.estado_turno_id = 1
            firstFilter.cola_posicion = cantTurnosSiguientes + 1
        }
    }

    if (['CANCELADO'].includes(estado)) {
        if (razon_cancelado_id === undefined) return false
        attendReg.razon_cancelado_id = razon_cancelado_id
    }


    // Actualiza el estado y el turno con los parametros previamente
    // modificados, en caso de ser eliminado no se incluye
    const newState = QUEUE_STATE.map(turno => {
        if (turno.id === firstFilter.id && turno.atencion !== null) {
            const atencion = turno.atencion.map(atencion => {
                if (atencion.agente_id === agente_id) {
                    if (attendWillDelete) return null
                    return attendReg
                }
                return atencion
            }).filter(entry => entry !== null) as TurnosActivos[]

            return {
                ...turno,
                atencion
            }
        }
        return turno
    })

    updateQueueState(newState)

    return true
}

/**
 * Metodo ejecutado por la emision de nuevo turno.
 * Crea un registro de turno en el estado de acuerdo al nuevo turno emitido.
 * Asigna las pantallas segun la sucursal y los agentes asignados al servicio segun su grupo.
 * @param param0 
 */
export const addNewQueueState = ({turno}: {turno: Turnos}) => {
    
    new Promise(async (resolve, reject) => {
        try {
            const turnoEstado = QUEUE_STATE.filter(entry => entry.id === turno.id)[0] ?? null
            if (turnoEstado === null) {
                const nuevoTurno = await prisma.turnos.findFirst({ where: { id: turno.id }  })
                if (nuevoTurno === null) throw new Error("Not Turnos was found")
                
                refreshQueueState()
                return addNewQueueState({turno})
            }

            addNewFlowList({turno})

            resolve(turnoEstado)
            
            console.log({turnoEstado})
            return true

        } catch (error) {

            console.log("Error while add new queue to state", {error})
            reject(error)
            return false
        }

    })
}

/**
 * Funcion asincrona de busqueda y creacion de estado de atencion.
 * Encuentra o crea en la base de datos el registro de asistencia dado los parametros de busqueda
 * y agrega al estado (si no existe) el registro de turno y/o de asistencia al turno.
 * @param turno 
 * @param agente_id
 * @param servicio_id
 */
const findOrCreateAttendingReg = ({turno, agente_id, servicio_id}: {turno: Turnos, agente_id: number, servicio_id: number}) => {
    
    ( async () => {
        const founded: Atenciones_turnos_servicios | null =  await prisma.atenciones_turnos_servicios.findFirst({
            where: {
                agente_id,
                turno_id: turno.id 
            }
        })
        .then(result => result)
        .catch(error => {
            console.log("Error while find Atenciones_Turnos_Activos", {error})
            return null
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
    
        if (founded !== null)  return founded

        // Attended registry was not found, so will be create.
        const created =  await prisma.atenciones_turnos_servicios.create({
            data: {
                turno_id: turno.id,
                agente_id,
                servicio_id: servicio_id
            }
        })
        .then(result => result)
        .catch(error => {
            console.log("Error while adding new Atencion_Turno_Servicio", {error})
            return null
        })
        .finally(async () => {
            await prisma.$disconnect()
        })

        if (created === null) throw new Error("Error: cannot create a new Atencio_Turno_Servicio")
        return created

    })().then( () => refreshQueueState())
    
}

const getDisplayCallTittle = ({turno}: {turno: QueueStateType}): string => {
    const sufix = turno?.secuencia_ticket ?? ""

    return "TURNO " + sufix
}
