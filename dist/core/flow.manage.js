"use strict";
// ***** OBJETO CON METODOS QUE ADMINSTRAN LA SECUENCIA DE SERVICIOS ***** //
// ****** PREPARAN UNA LISTA DE SERVICIOS POR TURNO EN ESTADO LOCAL ****** //
// *** MODIFICAN EL ORDEN DE LOS SERVICIOS LOCALMENTE (Y EN BASE DE DATOS) *** //
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
exports.updatePositionOrderList = exports.addNewFlowList = exports.getUnrelatedFirstService = exports.getNextServiceId = void 0;
const client_1 = require("@prisma/client");
const time_helpers_1 = require("../utils/time.helpers");
const prisma = new client_1.PrismaClient();
const getAvailableRelatedServices = ({ turno }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (turno !== undefined) {
            return yield prisma.servicios_seguros.findMany({
                where: {
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
                .finally(() => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.$disconnect();
            }));
        }
        return yield prisma.servicios_seguros.findMany({
            where: { estatus: true },
            select: {
                protocolo_id: true,
                servicio: true,
                cobertura: true,
                prioridad: true,
            },
            orderBy: { prioridad: 'asc' }
        })
            .finally(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.$disconnect();
        }));
    }
    catch (error) {
        console.error(`Error trying get services in Servicios_Seguros, turno_id: ${turno === null || turno === void 0 ? void 0 : turno.id}`, { error });
        return null;
    }
});
/* Sin uso por el momento, mover al controlador
const getAllRelatedServices = async () => {
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
*/
const getRelatedServicesListByQueue = ({ turno_id }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lista = yield prisma.servicios_dependientes.findFirst({
            where: { turno_id },
        })
            .finally(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.$disconnect();
        }));
        if (lista === null)
            return null;
        if (lista.serie_servicios &&
            typeof lista.serie_servicios === 'object' &&
            Array.isArray(lista.serie_servicios)) {
            return Object.assign(Object.assign({}, lista), { serie_servicios: lista.serie_servicios });
        }
        return null;
    }
    catch (error) {
        console.error(`Error trying get Servicios_Dependientes by turno_id: ${turno_id}`, { error });
        return null;
    }
});
/**
 * Acepta el id del turno y devuelve el id del siguiente servicio
 * segun el orden en la tabla Servicios_dependientes y el servicio_actual,
 * si no hay mas servicios en la lista devuelve el id del servicio_actual
 * @param turno_id
 * @returns Promise servicio_id or null
 */
const getNextServiceId = ({ turno_id }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const turno = yield prisma.turnos.findFirst({
            where: { id: turno_id }
        })
            .finally(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.$disconnect();
        }));
        if (turno === null)
            return null;
        if (turno.servicio_actual_id === turno.servicio_destino_id)
            return turno.servicio_destino_id;
        const servicesList = yield getRelatedServicesListByQueue({ turno_id });
        if (servicesList === null)
            return null;
        const current = servicesList.serie_servicios
            .filter(serie => serie.servicio_id === turno.servicio_actual_id)[0];
        const next = servicesList.serie_servicios
            .filter(servicio => servicio.orden === current.orden + 1)[0];
        if (next === null)
            throw new Error("Cant get next service according to orden column");
        return next.servicio_id;
    }
    catch (error) {
        console.error(`Error getting next service id in Turno_id: ${turno_id}`, { error });
    }
    return null;
});
exports.getNextServiceId = getNextServiceId;
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
const getUnrelatedFirstService = ({ seguro_id, sucursal_id, servicio_destino_id }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findService = yield prisma.servicios_seguros.findFirst({
            where: {
                seguro_id: seguro_id !== null && seguro_id !== void 0 ? seguro_id : 0,
                servicio_destino_id: servicio_destino_id,
                servicio: {
                    servicios_sucursales: {
                        some: {
                            sucursal_id: sucursal_id
                        }
                    }
                }
            },
            select: {
                servicio: true
            }
        });
        if (findService === null)
            throw new Error('Filtered servicio was not found');
        return findService.servicio.id;
    }
    catch (error) {
        console.error(`Error trying get unrelated first service_id using:
            seguro_id=${seguro_id}, 
            sucursal_id=${sucursal_id} and
            servicio_destino_id=${servicio_destino_id}`, { error });
        return 1;
    }
});
exports.getUnrelatedFirstService = getUnrelatedFirstService;
/**
 * Evento disparando por la creacion de un nuevo turno en el sistema
 * obtiene la lista de servicios relacionados al seguro del cliente del turno
 * y crea un nuevo registro con el id del turno y la lista ordenada por prioridad
 * en el campo JSON correspondiente.
 * @param turno
 * @returns
 */
const addNewFlowList = ({ turno }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const relatedService = yield getAvailableRelatedServices({ turno });
        if (relatedService === null)
            return null;
        relatedService.sort((a, b) => {
            return a.prioridad - b.prioridad; // sort asc (a is minor to b)
        });
        const serie_servicios = relatedService.map(lista => {
            return {
                orden: lista.prioridad,
                servicio_id: lista.servicio.id
            };
        });
        return yield prisma.servicios_dependientes.create({
            data: {
                turno_id: turno.id,
                serie_servicios
            }
        })
            .finally(() => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.$disconnect();
        }));
    }
    catch (error) {
        return null;
    }
});
exports.addNewFlowList = addNewFlowList;
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
const updatePositionOrderList = ({ turno_id, servicio_actual_id, nueva_posicion }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const find = yield prisma.turnos.findFirst({
            where: { id: turno_id }
        });
        if (find === null)
            throw new Error(`No turnos was found with id: ${turno_id}`);
        // Si se paso un numero mayor a 0 en el argumento nueva_posicion se incluye la condicional
        const lowerThan = (nueva_posicion && nueva_posicion > 0) ? { cola_posicion: { lte: nueva_posicion } } : {};
        // Se filtran todos los turnos registrados activos en la sucursal 
        const allActiveUpdatableTurnos = yield prisma.turnos.findMany({
            where: Object.assign(Object.assign({}, lowerThan), { fecha_turno: (0, time_helpers_1.prismaTodayFilter)(), sucursal_id: find.sucursal_id, estado_turno: { descripcion: { notIn: ['TERMINADO', 'CANCELADO'] } }, servicio_actual_id: servicio_actual_id !== null && servicio_actual_id !== void 0 ? servicio_actual_id : find.servicio_actual_id, cola_posicion: { not: 0 } })
        });
        // Se actualizara el orden mediante la doble ternaria
        // Ternaria 1) Turno mapeando es igual al turno recibido ?
        // verdadero: Ternaria 2) Nueva_posicion es un numero mayor a cero ?
        // verdadero: verdadero: Cola_posicion es igual a nueva_posicion.
        // verdadero: falso: Cola_posicion es igual a cero
        // falso: Cola_posicion es igual a la cola_posicion menos 1
        const result = yield prisma.$transaction([
            ...allActiveUpdatableTurnos.map(turno => {
                return prisma.turnos.update({
                    where: { id: turno.id },
                    data: {
                        cola_posicion: turno.id === turno_id
                            ? (nueva_posicion && nueva_posicion > 0)
                                ? nueva_posicion
                                : 0
                            : turno.cola_posicion - 1
                    }
                });
            })
        ]);
        return { rowsAffected: result.length };
    }
    catch (error) {
        console.error(`Error updating cola_posicion for all related Turnos with turno_id: ${turno_id}`, { error });
        return null;
    }
    finally {
        yield prisma.$disconnect();
    }
});
exports.updatePositionOrderList = updatePositionOrderList;
