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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activeToken_middlewares_1 = require("../middlewares/activeToken.middlewares");
const smartTV_middlewares_1 = require("../middlewares/smartTV.middlewares");
const activeUser_middlewares_1 = require("../middlewares/activeUser.middlewares");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient;
const secMiddleware = [activeToken_middlewares_1.authToken, activeUser_middlewares_1.validateActiveUser];
/**
 * RUTAS PARA CARGA DE DATOS INICIALES SEGUN TABLA DE CONFIGURACIONES
 */
router.get('/init/web', secMiddleware);
router.get('/init/display', smartTV_middlewares_1.getDisplayProps, (_req, res) => {
    const displayUUID = res.locals.display;
    const data = {
        display_uuid: displayUUID,
        title: "Instituto Internacional de la Visión",
        sucursal: "Suc. Millon",
        logo: "pkg:/images/brand_logo.jpg",
        music: [
            "https://cdn.pixabay.com/download/audio/2023/04/27/audio_d6ce814591.mp3?filename=reflected-light-147979.mp3&g-recaptcha-response=03AL8dmw91gDnDnGKDfT5yOGkGZSNIa3pVffVMUkTRup4vARFIktDzZGDTGxsXZo3OMdKYmfCPKNLONoDDfbyfHC0XiQK599BUDvK8rGaKJv-UlBoYqtbN_QFvQ_2MOMjRAtmq0RlQGt5Zh6CWgWDkY60Ws6r2gu9A1MctMTenQiA5xF5Jbpz3GFzzRED6A5p8zog7XLUpyMKiaYdK8oMas7mDTugLE6HVTzTpb8uId84JrfUXFUfYQCRtiX4UUkiD0BORp9XnsFVVU7ZDk3fGJHVeVuBZfe_Va18FcpwZxyal2m8STN-IPjHwUFJvKRtoAX9fqQeIXy5SdE6zOyv3V_q7Jr0jHxIiOsnJhAD1c2ikRtBion2wvuNN_WqlTcHekZDcwgYbK_ufTbvedipjg2QlIEjxy_4NjcM68mk6Fk8MKn4Ir6KntkiKDsuvYUyJXUrUJJO0NK-1GpcpOYcDxCEAcoJPHiyAokY9-5dnUDCZ9c0mHnAxcH_ssgOz4EAc4i4OaeU99TbaZapb53-fYUwXuWN08GJLGw&remote_template=1",
            "https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=the-beat-of-nature-122841.mp3&g-recaptcha-response=03AAYGu2R8SgHHf3oD8zGS1JmSnzFCyTOwiBaMjBB8PQijbeU4l0ssPtv3vGXNHfSc5vL4EBWI1s3uI6xzJVgdlfxakQ28TLlz6hLTcP-6f-3Fatl9_Zrjhym4Bzksd-8b-h7qezQXfN6eYbolpFpznlk5xntEttvY0nFtBq41vGObFBZV7043VPKmoWQ1YsSqDNDMd92-ghbnBv_S9-zp4JoOhC-fgb1mmVTFX_gUI354gWUKqjkIF3Xlh2LZCvkKnpxezrg_vyo_6l9agnuABGcOvxT5dZLZ2Wtf7ypb7WjoxamYRvUSUmmgrp6nMGkuZrSk2vcwSnK5u4PDQwldvqqYKCv21P56RgL_b3axEzCnIrUvUHqonJE_BwvqkmEiM6mdGgmQUdNNECArdNY3dD37o-i1SIV5pq0BSpIK_-_CLzng_7Ks9Zq3CcqL8Dv2_XPaJNXUe1uuW06yfpf9O8I6zREnJ_F48AzNXBlNNKc1na7oj3IaXzlx9RDgJQLNdgWnqh4Q5aAP2N9MF7fVW4hN6UfBCrHIxOMQepmmK5MpNwGx0RDTEqo&remote_template=1",
        ],
        anouncements: [
            "Los bebés no lloran con lágrimas durante las primeras semanas. La glándula lagrimal se desarrolla entre la 6ª y la 7ª semana de gestación. Al nacimiento, las glándulas lagrimales son pequeñas y no funcionan hasta seis semanas después de nacer, esto explica por qué los recién nacidos no producen lágrimas cuando lloran.",
            "El ojo seco será cada vez más frecuente entre la población joven y adultos debido al exceso de uso de pantallas de visualización (ordenadores, tablets, móviles, etc.).",
            "En condiciones normales las personas parpadeamos entre 16 y 20 veces por minuto. Cuando vemos una pantalla, este ritmo se reduce a la mitad.",
            "Los lentes de contactos no pueden desaparecer dentro del ojo como erróneamente se suele pensar.",
            "No es malo ver la televisión de cerca, no se daña el ojo para nada. Lo que sí puede ocurrir es que aparezca astenopia, cansancio ocular y cefalea si se hace de manera prolongada. Si los niños lo hacen de modo habitual, podría esconder un problema refractivo que debería ser revisado por un oftalmólogo. Lo mismo ocurre al leer con poca luz, no se daña el ojo pero podría producirse fatiga ocular y dolor de cabeza.",
            "Utilizar las gafas de otra persona de manera ocasional en adultos, en contra de lo que la gente pueda pensar, no ocasiona daño al ojo. Las gafas lo único que hacen es regular y modificar la luz que entra a través del ojo. Lo que sí puede ocurrir es que, al no ser la graduación adecuada aparezcan síntomas de cansancio ocular y dolor de cabeza.",
        ],
    };
    res.send({ success: true, data });
});
/**
 * RUTAS PARA SETEO DE DATOS INICIALES DE LA BASE DE DATOS
 * Tales como permisos
 */
router.post('/init/system', secMiddleware, (req, res) => {
    const dataPayload = req.body();
    const authUser = res.locals.payloay;
    const commons = {
        roles: [
            { nombre: "", descripcion: "" }
        ]
    };
    console.log({ dataPayload, authUser });
    res.json({ success: true, data: commons });
});
router.post('/init/dictionaries', secMiddleware, (req, res) => {
    const dataPayload = req.body;
    const authUser = res.locals.payloay;
    const commons = {
        estados_turnos: [
            { descripcion: "NUEVA_SESION", siglas: "NEW", color_hex: "#a3a345" },
            { descripcion: "ESPERANDO", siglas: "WAIT", color_hex: "#a3a345" },
            { descripcion: "ATENDIENDO", siglas: "ON", color_hex: "#a3a345" },
            { descripcion: "EN_ESPERA", siglas: "OFF", color_hex: "#a3a345" },
            { descripcion: "DESCANSANDO", siglas: "FREE", color_hex: "#a3a345" },
            { descripcion: "CANCELADO", siglas: "OUT", color_hex: "#a3a345" },
            { descripcion: "TERMINADO", siglas: "END", color_hex: "#a3a345" },
        ],
        tipos_identificaciones: [
            { nombre: "Cedula", regex_formato: "###-########-#", long_minima: 11, long_maxima: 13 },
            { nombre: "RNC", regex_formato: "###-#####-#", long_minima: 9, long_maxima: 11 },
            { nombre: "Pasaporte", regex_formato: "*", long_minima: 10, long_maxima: 20 },
        ],
        grupos_servicios: [
            { descripcion: "SISTEMA", color_hex: "#f1d123", es_seleccionable: false },
            { descripcion: "Recepcion", color_hex: "#a1d312", es_seleccionable: false },
            { descripcion: "Consultas", color_hex: "#b1d123" },
            { descripcion: "Estudios", color_hex: "#c1d123" },
            { descripcion: "Optica", color_hex: "#d1d123" },
            { descripcion: "Procedimientos", color_hex: "#e1d123" },
        ],
        tipos_agentes: [
            { nombre: "Registro", nombre_corto: "Reg", descripcion: "Agentes de registro de nuevos turnos" },
            { nombre: "Atencion", nombre_corto: "Aten", descripcion: "Agentes de atencion al paciente" },
            { nombre: "Servicio", nombre_corto: "Serv", descripcion: "Agentes de servicio generales" },
        ],
        estilos_pantallas: [
            { detalle: "Diseño simple y minimalista", siglas: "EASY", tv_brand: "ROKU_TV", filepath: "SimpleScreen.xml" },
            { detalle: "Diseño simple y minimalista", siglas: "EASY", tv_brand: "SAMSUNG_TV", filepath: "SimpleScreen.html" }
        ],
        direcciones: [
            { calle: "Aut. Ramon Caceres", numero: 5, piso: 1, sector: "Plaza City Center, Local A-1.3", estado_provincia: "Moca", latitud_decimal: "19.38991602310967", longitud_decimal: "-70.528942384656" },
        ],
        tipos_grabaciones: [
            { detalle: "Numeros cardinales", nombre_corto: "Numbers" },
            { detalle: "Servicios Prefijo", nombre_corto: "Prefix" },
            { detalle: "Servicios Descripcion", nombre_corto: "Services" },
            { detalle: "Agentes Nombre", nombre_corto: "Agent" },
            { detalle: "Departamento Descripcion", nombre_corto: "Area" },
        ],
        tipos_multimedia: [
            { nombre: "Texto Plano", siglas: "TXT", icono: "document.svg", color_hex: "#3abbff" },
            { nombre: "Musica Instrumental", siglas: "MUS", icono: "music.svg", color_hex: "#3fbfdf" },
            { nombre: "Imagenes y Poster", siglas: "IMG", icono: "images.svg", color_hex: "#1fffed" },
            { nombre: "Videos Sin Audio", siglas: "VID", icono: "videos.svg", color_hex: "#ffbb2a" },
            { nombre: "Peliculas", siglas: "MOV", icono: "movie.svg", color_hex: "#cf1bbf" },
        ],
        colecciones_multimedia: [
            { detalle: "Anuncios Generales de Internet", nombre_corto: "Anounces" },
            { detalle: "Juan Luis Guerra - Variada", nombre_corto: "JL Guerra" },
            { detalle: "Musica Clasica - Piano", nombre_corto: "Piano" },
            { detalle: "Poster de Redes Sociales", nombre_corto: "Posters" },
            { detalle: "Peliculas de Comedia", nombre_corto: "Comedy" },
        ]
    };
    const response = Object.keys(commons).map((table) => __awaiter(void 0, void 0, void 0, function* () {
        const data = commons[table];
        return Promise.allSettled([
            (table === "estados_turnos") && (yield prisma.estados_turnos.createMany({ data }).finally(() => __awaiter(void 0, void 0, void 0, function* () { yield prisma.$disconnect(); }))),
            //(table === "tipos_identificaciones") && await prisma.tipos_identificaciones.createMany({data}).finally(async () => { await prisma.$disconnect() }),
            //(table === "grupos_servicios") && await prisma.grupos_servicios.createMany({data}).finally(async () => { await prisma.$disconnect() }),
            //(table === "tipos_agentes") && await prisma.tipos_agentes.createMany({data}).finally(async () => { await prisma.$disconnect() }),
            //(table === "estilos_pantallas") && await prisma.estilos_pantallas.createMany({data}).finally(async () => { await prisma.$disconnect() }),
            (table === "direcciones") && (yield prisma.direcciones.createMany({ data }).finally(() => __awaiter(void 0, void 0, void 0, function* () { yield prisma.$disconnect(); }))),
            //(table === "tipos_grabaciones") && await prisma.tipos_grabaciones.createMany({data}).finally(async () => { await prisma.$disconnect() }),
            //(table === "tipos_multimedia") && await prisma.tipos_multimedia.createMany({data}).finally(async () => { await prisma.$disconnect() }),
            //(table === "colecciones_multimedia") && await prisma.colecciones_multimedia.createMany({data}).finally(async () => { await prisma.$disconnect() }),
        ]).then(results => {
            return results;
        });
    }));
    console.log({ dataPayload, authUser });
    res.json({ success: true, data: response });
});
router.put('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id || 1);
    try {
        const request = Object.assign(Object.assign({}, req.body), { hora_inicio: ("2000-01-01T" + req.body.hora_inicio + "Z"), hora_fin: ("2000-01-01T" + req.body.hora_fin + "Z") });
        const data = request;
        const response = yield prisma.horarios.update({
            where: { id }, data
        }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
        return res.json({ success: true, data: response });
    }
    catch (error) {
        console.error(`Error trying update Horario id: ${id}`, { error });
        return res.status(500).json({ success: false, message: `Error trying update Horario id: ${id}`, data: error });
    }
}));
router.get('/get/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id || 1);
    const data = yield prisma.horarios.findFirst({
        where: { id }
    }).finally(() => __awaiter(void 0, void 0, void 0, function* () { return yield prisma.$disconnect(); }));
    if (data === null)
        return res.status(404).send({ success: false, message: `Horario id: ${id} not found`, data: null });
    return res.json({ success: true, data });
}));
exports.default = router;
