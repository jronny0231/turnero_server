"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNewQueueState = exports.setAttendingState = exports.getAttendingQueueByUserId = exports.getActiveQueueList = exports.setCallQueueState = exports.getCallQueueState = exports.setWaitingState = exports.GetAllAvailableServicesInSucursal = exports.getSucursalByUserId = exports.getQueuesListByService = exports.getServiceById = exports.refreshQueueState = exports.refreshPersistentData = exports.initData = void 0;
const client_1 = require("@prisma/client");
const filtering_1 = require("../utils/filtering");
const time_helpers_1 = require("../utils/time.helpers");
const flow_manage_1 = require("./flow.manage");
const QUEUE_STATE = [];
const PERSISTENT_DATA = [];
const prisma = new client_1.PrismaClient();
/**
 * Metodo con ejecucion asincrona para inicializar
 * las constantes en caso de que esten vacias.
 */
const initData = () => {
    if (PERSISTENT_DATA.length === 0)
        (0, exports.refreshPersistentData)();
    if (QUEUE_STATE.length === 0)
        (0, exports.refreshQueueState)();
};
exports.initData = initData;
/**
 * Metodo con ejecucion asincrona para actualizar
 * o setear los datos en la constante PERSISTENT_DATA
 */
const refreshPersistentData = () => {
    new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield prisma.sucursales.findMany({
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
                .finally(() => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.$disconnect();
            }));
            if (data === null)
                throw new Error("data got from database is empty.");
            console.log({ data });
            PERSISTENT_DATA.length = 0;
            data.map(sucursal => {
                const conjunto_agentes = sucursal.departamentos_sucursales
                    .map(depsuc => {
                    return Object.assign({}, depsuc.agentes.map(agente => {
                        return Object.assign(Object.assign({}, agente), { grupo_servicio_id: agente.tipo_agente.grupo_servicio_id });
                    }));
                })[0]
                    .filter(entry => entry !== null);
                const conjunto_servicios = sucursal.departamentos_sucursales
                    .map(depsuc => depsuc.servicios_departamentos_sucursales
                    .filter(entry => entry !== null)
                    .map(serdepsuc => serdepsuc.servicio))
                    .filter(entry => entry !== null)[0];
                const conjunto_departamentos = sucursal.departamentos_sucursales
                    .map(depsuc => depsuc.servicios_departamentos_sucursales
                    .filter(entry => entry !== null)
                    .map(serdepsuc => serdepsuc.departamento_sucursal.departamento))
                    .filter(entry => entry !== null)[0];
                const entry = Object.assign(Object.assign({}, sucursal), { conjunto_servicios,
                    conjunto_departamentos,
                    conjunto_agentes, conjunto_pantallas: sucursal.pantallas });
                PERSISTENT_DATA.push(entry);
            });
            resolve(PERSISTENT_DATA);
            return true;
        }
        catch (error) {
            console.error("Error trying setting up PERSISTEN_DATA on state", { error });
            reject(error);
            return false;
        }
        finally {
            console.log("Async refresh PERSISTENT_DATA", { length: PERSISTENT_DATA.length });
        }
    }));
};
exports.refreshPersistentData = refreshPersistentData;
/**
 * Metodo con ejecucion asincrona para subir el nuevo estado
 * del la constante PERSISTENT_DATA a la base de datos y refrescar el local
 */
const updatePersistentData = (newState) => {
    new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (newState.length === 0)
                throw new Error('new state data is empty.');
            const agentes = newState.flatMap(sucursal => {
                if (sucursal.conjunto_agentes !== undefined)
                    return sucursal.conjunto_agentes;
                return undefined;
            }).filter(entry => entry !== undefined);
            const pantallas = newState.flatMap(sucursal => {
                if (sucursal.conjunto_pantallas !== undefined)
                    return sucursal.conjunto_pantallas;
                return undefined;
            }).filter(entry => entry !== undefined);
            const servicios = newState.flatMap(sucursal => {
                if (sucursal.conjunto_servicios !== undefined)
                    return sucursal.conjunto_servicios;
                return undefined;
            }).filter(entry => entry !== undefined);
            const departamentos = newState.flatMap(sucursal => {
                if (sucursal.conjunto_departamentos !== undefined)
                    return sucursal.conjunto_departamentos;
                return undefined;
            }).filter(entry => entry !== undefined);
            const result = yield prisma.$transaction([
                ...newState.map(sucursal => prisma.sucursales.update({
                    data: Object.assign({}, sucursal),
                    where: { id: sucursal.id }
                })),
                ...agentes.map(agente => prisma.agentes.update({
                    data: Object.assign({}, agente),
                    where: { id: agente.id }
                })),
                ...pantallas.map(pantalla => prisma.pantallas.update({
                    data: Object.assign({}, pantalla),
                    where: { id: pantalla.id }
                })),
                ...servicios.map(servicio => prisma.servicios.update({
                    data: Object.assign({}, servicio),
                    where: { id: servicio.id }
                })),
                ...departamentos.map(departamento => prisma.departamentos.update({
                    data: Object.assign({}, departamento),
                    where: { id: departamento.id }
                })),
            ])
                .finally(() => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.$disconnect();
            }));
            resolve(result);
            return true;
        }
        catch (error) {
            console.error("Error trying massive update persistent state data to database.", { error });
            reject(error);
            return false;
        }
    }));
};
/**
 * Metodo con ejecucion asincrona para actualizar
 * o setear el estado en la constante QUEUE_STATE
 */
const refreshQueueState = () => {
    new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const turnosActivos = yield prisma.turnos.findMany({
                where: {
                    fecha_turno: (0, time_helpers_1.prismaTodayFilter)()
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
                .finally(() => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.$disconnect();
            }));
            if (turnosActivos === null)
                throw new Error("data got from database is empty.");
            QUEUE_STATE.length = 0;
            turnosActivos.map(turno => {
                var _a;
                const displaysUUID = turno.atenciones_turnos_servicios
                    .map(atenciones => atenciones.agente.departamento_sucursal.sucursal.pantallas)[0]
                    .map(pantalla => pantalla.key)
                    .map(key => (0, filtering_1.stringToUUID)(key))
                    .filter(entry => entry !== null);
                const atencion = turno.atenciones_turnos_servicios
                    .map((atencion, index) => {
                    var _a;
                    return Object.assign(Object.assign({}, atencion), { state_id: index, servicio: atencion.servicio, departamento: atencion.agente.departamento_sucursal.departamento, agente: atencion.agente, estado_turno_name: (_a = turno.estado_turno) === null || _a === void 0 ? void 0 : _a.descripcion });
                })
                    .filter(entry => entry !== null);
                const entry = Object.assign(Object.assign({}, turno), { estado_turno_name: (_a = turno.estado_turno) === null || _a === void 0 ? void 0 : _a.descripcion, atencion,
                    displaysUUID });
                QUEUE_STATE.push(entry);
            });
            resolve(PERSISTENT_DATA);
            return true;
        }
        catch (error) {
            console.error("Error trying setting up PERSISTEN_DATA on state", { error });
            reject(error);
            return false;
        }
        finally {
            console.log("Async refresh QUEUE_STATE", { length: QUEUE_STATE.length });
        }
    }));
};
exports.refreshQueueState = refreshQueueState;
/**
 * Metodo con ejecucion asincrona para subir el nuevo estado
 * del la constante QUEUE_STATE a la base de datos y refrescar el local
 */
const updateQueueState = (newState) => {
    new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (newState.length === 0)
                throw new Error('new state data is empty.');
            const atenciones = newState.flatMap(turnos => turnos.atencion);
            const result = yield prisma.$transaction([
                ...newState.map(turno => prisma.turnos.update({
                    data: Object.assign({}, turno),
                    where: { id: turno.id }
                })),
                ...atenciones.map(atencion => prisma.atenciones_turnos_servicios.update({
                    data: Object.assign({}, atencion),
                    where: {
                        turno_id_agente_id_servicio_id: {
                            turno_id: atencion.turno_id,
                            agente_id: atencion.agente_id,
                            servicio_id: atencion.servicio_id
                        }
                    }
                })),
            ])
                .finally(() => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.$disconnect();
            }));
            resolve(result);
            (0, exports.refreshQueueState)();
            return true;
        }
        catch (error) {
            console.error("Error trying massive update persistent state data to database.", { error });
            reject(error);
            return false;
        }
    }));
};
/**
 * Devuelve el servicio que coincida con la ID
 * @param id servicio
 * @returns Servicio
 */
const getServiceById = (id) => {
    var _a;
    return (_a = PERSISTENT_DATA.map(sucursal => { var _a; return (_a = sucursal.conjunto_servicios) === null || _a === void 0 ? void 0 : _a.filter(servicio => servicio.id === id)[0]; })[0]) !== null && _a !== void 0 ? _a : null;
};
exports.getServiceById = getServiceById;
/**
 * Devuelve el listado de turnos activos en la sucursal
 * @param id sucursal
 * @returns
 */
const getQueuesListByService = ({ sucursal_id, servicio_destino_id, servicio_actual_id }) => {
    return QUEUE_STATE.filter(turno => turno.sucursal_id === sucursal_id
        && (servicio_actual_id) ? turno.servicio_actual_id === servicio_actual_id : true
        && (servicio_destino_id) ? turno.servicio_destino_id === servicio_destino_id : true);
};
exports.getQueuesListByService = getQueuesListByService;
const getSucursalByUserId = (id) => {
    return PERSISTENT_DATA.filter(sucursal => { var _a; return (_a = sucursal.conjunto_agentes) === null || _a === void 0 ? void 0 : _a.filter(agente => agente.usuario_id === id)[0]; })[0];
};
exports.getSucursalByUserId = getSucursalByUserId;
const GetAllAvailableServicesInSucursal = ({ sucursal_id, grupo_id, es_seleccionable }) => {
    const result = PERSISTENT_DATA.flatMap(sucursal => {
        var _a, _b;
        if (sucursal.id === sucursal_id) {
            return (_b = (_a = sucursal.conjunto_servicios) === null || _a === void 0 ? void 0 : _a.filter(servicio => (grupo_id ? servicio.grupo_id === grupo_id : true
                && servicio.es_seleccionable === (es_seleccionable === undefined ? true : es_seleccionable)))) !== null && _b !== void 0 ? _b : null;
        }
        return null;
    }).filter(entry => entry !== null);
    if (result.length === 0)
        return null;
    return result;
};
exports.GetAllAvailableServicesInSucursal = GetAllAvailableServicesInSucursal;
/**
 * Metodo sincrono para modificar la disponibilidad del agente.
 * opcionalmente puede establecer con que grupo de servicios el agente
 * va a trabajar, si no lo setea se le asigna del flujo.
 * @param param0
 * @returns
 */
const setWaitingState = ({ agente_id, usuario_id, esperando = true, servicios_destino_id }) => {
    const found = PERSISTENT_DATA.map(sucursal => {
        if (sucursal.conjunto_agentes !== undefined) {
            return sucursal.conjunto_agentes.filter(agente => (agente.id === agente_id
                && agente.usuario_id === usuario_id // Valida que el agente tenga relacion con el usuario logeado
            ))[0];
        }
        return null;
    }).filter(entry => entry !== null)[0];
    if (found === null)
        return false;
    const newState = PERSISTENT_DATA.map(sucursal => {
        if (sucursal.conjunto_agentes !== undefined) {
            const newAgentes = sucursal.conjunto_agentes.map(agente => {
                if (agente.id === found.id) {
                    agente.esperando = esperando; // Setear el estado
                    agente.esperando_servicios_destino_id = servicios_destino_id;
                }
                return agente;
            });
            return Object.assign(Object.assign({}, sucursal), { agentes: newAgentes });
        }
        return sucursal;
    });
    updatePersistentData(newState);
    return true;
};
exports.setWaitingState = setWaitingState;
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
const getCallQueueState = ({ displayUUID }) => {
    var _a, _b, _c;
    if (PERSISTENT_DATA.length === 0)
        (0, exports.refreshPersistentData)();
    if (QUEUE_STATE.length === 0)
        (0, exports.refreshQueueState)();
    const firstFilter = (_a = QUEUE_STATE.filter(turno => {
        var _a;
        return (((_a = turno.displaysUUID) === null || _a === void 0 ? void 0 : _a.includes(displayUUID) // Filtro de sucursal por pantalla
        )
            && turno.estado_turno_name !== undefined
            && ['NUEVA_SESION', 'ESPERANDO'].includes(turno.estado_turno_name)
            && turno.cola_posicion === 1 // La posicion del turno en la cola es 1, osea el primero.
        );
    })[0]) !== null && _a !== void 0 ? _a : null;
    if (firstFilter === null)
        return null;
    const firstUncalled = (_b = firstFilter.atencion
        .filter(entry => (entry.estatus_llamada === "UNCALLED"
        && entry.estado_turno_name !== undefined
        && ['NUEVA_SESION', 'ESPERANDO'].includes(entry.estado_turno_name)))[0]) !== null && _b !== void 0 ? _b : null;
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
                const servicio = sucursal.conjunto_servicios.filter(servicio => (servicio.id === firstFilter.servicio_actual_id))[0];
                return sucursal.conjunto_agentes.filter(agente => ((agente.esperando_servicios_destino_id === undefined ||
                    agente.esperando_servicios_destino_id.includes(firstFilter.servicio_destino_id))
                    && servicio.grupo_id === agente.grupo_servicio_id
                    && agente.esperando));
            }
            return null;
        })[0];
        if (freeAgents === null)
            return null;
        const firstFreeAgent = freeAgents.filter(agente => agente !== null)[0];
        const turno = Object.assign({}, firstFilter);
        findOrCreateAttendingReg({ turno, agente_id: firstFreeAgent.id, servicio_id: turno.servicio_actual_id });
        return null;
    }
    const [letters, numbers] = (_c = firstFilter.secuencia_ticket.match(/([a-zA-Z]+)|(\d+)/g)) !== null && _c !== void 0 ? _c : [];
    const newCall = {
        id: firstUncalled.state_id,
        tittle: getDisplayCallTittle({ turno: firstFilter }),
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
    };
    return newCall;
};
exports.getCallQueueState = getCallQueueState;
/**
 * Metodo ejecutado por la pantalla
 * Actualizacion del estado de la llamada a travez de la coincidencia
 * @param param0
 * @returns
 */
const setCallQueueState = ({ state_id, displayUUID, estatus }) => {
    var _a;
    const firstFilter = QUEUE_STATE.filter(entry => { var _a; return (_a = entry.displaysUUID) === null || _a === void 0 ? void 0 : _a.includes(displayUUID); })[0];
    const attendReg = (_a = firstFilter.atencion.filter(attend => attend.state_id === state_id)[0]) !== null && _a !== void 0 ? _a : null;
    if (attendReg === null)
        return false;
    attendReg.estatus_llamada = estatus;
    const newState = QUEUE_STATE.map(turno => {
        if (turno.id === firstFilter.id && turno.atencion !== null) {
            const atencion = turno.atencion.map(atencion => {
                if (atencion.state_id === state_id)
                    return attendReg;
                return atencion;
            });
            return Object.assign(Object.assign({}, turno), { atencion });
        }
        return turno;
    });
    updateQueueState(newState);
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
    return true;
};
exports.setCallQueueState = setCallQueueState;
/**
 * Metodo ejecutado por la pantalla en loop
 * para actualizar la lista de turnos que estan siendo atendidos
 * o esperando a atender
 * @param param0
 * @returns
 */
const getActiveQueueList = ({ displayUUID }) => {
    const activeTurnosBySucursal = QUEUE_STATE.filter(turno => {
        var _a;
        return (((_a = turno.displaysUUID) === null || _a === void 0 ? void 0 : _a.includes(displayUUID) // Filtro de turno por pantalla
        )
            && turno.estado_turno_name !== undefined
            && ['ESPERANDO', 'ATENDIENDO', 'EN_ESPERA'].includes(turno.estado_turno_name));
    });
    if (activeTurnosBySucursal.length === 0)
        return null;
    const filterActiveAttending = activeTurnosBySucursal.map(turno => {
        return Object.assign(Object.assign({}, turno), { activo: turno.atencion.filter(entry => entry.servicio_id === turno.servicio_actual_id)[0] });
    });
    return filterActiveAttending;
};
exports.getActiveQueueList = getActiveQueueList;
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
const getAttendingQueueByUserId = ({ usuario_id }) => {
    var _a;
    const agente = PERSISTENT_DATA.map(sucursal => {
        var _a;
        return (_a = sucursal.conjunto_agentes) === null || _a === void 0 ? void 0 : _a.filter(agente => (agente.usuario_id === usuario_id
            && agente.esperando === true))[0];
    })[0];
    if (agente === undefined)
        return null;
    const turnoActivo = (_a = QUEUE_STATE.map(turno => {
        var _a;
        return (_a = turno.atencion.filter(atencion => (atencion.agente_id === agente.id
            && atencion.estatus_llamada !== 'UNCALLED'
            && atencion.estado_turno_name !== undefined
            && ['NUEVA_SESION', 'ESPERANDO'].includes(atencion.estado_turno_name)))[0]) !== null && _a !== void 0 ? _a : null;
    })[0]) !== null && _a !== void 0 ? _a : null;
    return turnoActivo;
};
exports.getAttendingQueueByUserId = getAttendingQueueByUserId;
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
const setAttendingState = ({ agente_id, servicio_id, turno_id, estado_turno_id, razon_cancelado_id }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const firstFilter = (_a = QUEUE_STATE.filter(entry => entry.id === turno_id)[0]) !== null && _a !== void 0 ? _a : null;
    if (firstFilter === null)
        return false;
    const attendReg = (_b = firstFilter.atencion
        .filter(entry => (entry.agente_id === agente_id
        && entry.servicio_id === servicio_id))[0]) !== null && _b !== void 0 ? _b : null;
    if (attendReg === null)
        return false;
    const estado_turno = yield prisma.estados_turnos.findFirst({
        where: { id: estado_turno_id }
    });
    if (estado_turno === null)
        return false;
    firstFilter.estado_turno_id = estado_turno.id;
    firstFilter.estado_turno_name = estado_turno.descripcion;
    attendReg.estado_turno_id = estado_turno.id;
    attendReg.estado_turno_name = estado_turno.descripcion;
    const nowTime = new Date();
    const preWaitSeconds = (_c = attendReg.espera_segundos) !== null && _c !== void 0 ? _c : 0;
    const endTime = (_d = attendReg.hora_fin) !== null && _d !== void 0 ? _d : nowTime;
    const waitTimeSeconds = preWaitSeconds + Math.floor((nowTime.getTime() - endTime.getTime()) / 1000);
    const { descripcion: estado } = estado_turno;
    let attendWillDelete = false;
    /**
     * El agente devuelve el turno a la cola para el mismo servicio
     * - Elimina la atencion registrada
     * - Situa el orden del turno X posiciones atras
     */
    if (['NUEVA_SESION'].includes(estado)) {
        attendWillDelete = true;
        (0, flow_manage_1.updatePositionOrderList)({ turno_id, nueva_posicion: 3 }).then(result => {
            console.log(`Rows updated when turno_id: ${turno_id} was reset to NUEVA_SESION`, result);
        });
    }
    /**
     * El agente inicia o reinicia los procesos con el cliente
     * - Pone el orden del cliente en 0
     * - Adelanta el orden de los demas turnos
     */
    if (['ATENDIENDO'].includes(estado)) {
        attendReg.espera_segundos = waitTimeSeconds;
        if (attendReg.hora_inicio === null) {
            attendReg.hora_inicio = nowTime;
            (0, flow_manage_1.updatePositionOrderList)({ turno_id });
        }
        attendReg.estatus_llamada = 'CALLED';
    }
    /**
     * EN_ESPERA    > El cliente espera a que el agente termine una tarea sin relacion
     * ESPERANDO    > El agente espera a que el cliente termine una tarea
     * DESCANSANDO  > El cliente salio a almorzar o hacer una pausa prolongada
     * TERMINADO    > El agente concluye las tareas con el cliente
     * CANCELADO    > El agente cancela las tareas con razon
     * - Agrega la hora actual como hora_fin en la atencion actual
     */
    if (['EN_ESPERA', 'ESPERANDO', 'DESCANSANDO', 'TERMINADO', 'CANCELADO'].includes(estado)) {
        attendReg.hora_fin = nowTime;
    }
    /**
     * El agente espera a que el cliente termine una tarea
     * Por lo regular es llamado por la pantalla
     * - Pone el estado de llamada de la atencion en UNCALLED
     */
    if (['ESPERANDO'].includes(estado)) {
        attendReg.estatus_llamada = 'UNCALLED';
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
        const nextServiceId = yield (0, flow_manage_1.getNextServiceId)({ turno_id });
        if (nextServiceId === null)
            throw new Error('next service id returns null');
        if (nextServiceId !== firstFilter.servicio_destino_id) {
            const cantTurnosSiguientes = QUEUE_STATE.map(turno => {
                if (turno.servicio_actual_id === nextServiceId
                    && turno.sucursal_id === firstFilter.sucursal_id) {
                    return turno;
                }
                return null;
            }).filter(entry => entry !== null).length;
            firstFilter.servicio_actual_id = nextServiceId;
            firstFilter.estado_turno_id = 1;
            firstFilter.cola_posicion = cantTurnosSiguientes + 1;
        }
    }
    if (['CANCELADO'].includes(estado)) {
        if (razon_cancelado_id === undefined)
            return false;
        attendReg.razon_cancelado_id = razon_cancelado_id;
    }
    // Actualiza el estado y el turno con los parametros previamente
    // modificados, en caso de ser eliminado no se incluye
    const newState = QUEUE_STATE.map(turno => {
        if (turno.id === firstFilter.id && turno.atencion !== null) {
            const atencion = turno.atencion.map(atencion => {
                if (atencion.agente_id === agente_id) {
                    if (attendWillDelete)
                        return null;
                    return attendReg;
                }
                return atencion;
            }).filter(entry => entry !== null);
            return Object.assign(Object.assign({}, turno), { atencion });
        }
        return turno;
    });
    updateQueueState(newState);
    return true;
});
exports.setAttendingState = setAttendingState;
/**
 * Metodo ejecutado por la emision de nuevo turno.
 * Crea un registro de turno en el estado de acuerdo al nuevo turno emitido.
 * Asigna las pantallas segun la sucursal y los agentes asignados al servicio segun su grupo.
 * @param param0
 */
const addNewQueueState = ({ turno }) => {
    new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const turnoEstado = (_a = QUEUE_STATE.filter(entry => entry.id === turno.id)[0]) !== null && _a !== void 0 ? _a : null;
            if (turnoEstado === null) {
                const nuevoTurno = yield prisma.turnos.findFirst({ where: { id: turno.id } });
                if (nuevoTurno === null)
                    throw new Error("Not Turnos was found");
                (0, exports.refreshQueueState)();
                return (0, exports.addNewQueueState)({ turno });
            }
            (0, flow_manage_1.addNewFlowList)({ turno });
            resolve(turnoEstado);
            console.log({ turnoEstado });
            return true;
        }
        catch (error) {
            console.log("Error while add new queue to state", { error });
            reject(error);
            return false;
        }
    }));
};
exports.addNewQueueState = addNewQueueState;
/**
 * Funcion asincrona de busqueda y creacion de estado de atencion.
 * Encuentra o crea en la base de datos el registro de asistencia dado los parametros de busqueda
 * y agrega al estado (si no existe) el registro de turno y/o de asistencia al turno.
 * @param turno
 * @param agente_id
 * @param servicio_id
 */
const findOrCreateAttendingReg = ({ turno, agente_id, servicio_id }) => {
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const founded = yield prisma.atenciones_turnos_servicios.findFirst({
            where: {
                agente_id,
                turno_id: turno.id
            }
        })
            .then(result => result)
            .catch(error => {
            console.log("Error while find Atenciones_Turnos_Activos", { error });
            return null;
        })
            .finally(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.$disconnect();
        }));
        if (founded !== null)
            return founded;
        // Attended registry was not found, so will be create.
        const created = yield prisma.atenciones_turnos_servicios.create({
            data: {
                turno_id: turno.id,
                agente_id,
                servicio_id: servicio_id
            }
        })
            .then(result => result)
            .catch(error => {
            console.log("Error while adding new Atencion_Turno_Servicio", { error });
            return null;
        })
            .finally(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.$disconnect();
        }));
        if (created === null)
            throw new Error("Error: cannot create a new Atencio_Turno_Servicio");
        return created;
    }))().then(() => (0, exports.refreshQueueState)());
};
const getDisplayCallTittle = ({ turno }) => {
    var _a;
    const sufix = (_a = turno === null || turno === void 0 ? void 0 : turno.secuencia_ticket) !== null && _a !== void 0 ? _a : "";
    return "TURNO " + sufix;
};
