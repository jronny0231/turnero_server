--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3
-- Dumped by pg_dump version 15.3

-- Started on 2023-08-08 22:01:51

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'SQL_ASCII';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: invis_turnero_app_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO invis_turnero_app_user;

--
-- TOC entry 931 (class 1247 OID 17152)
-- Name: Tipado_estados_turnos; Type: TYPE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TYPE public."Tipado_estados_turnos" AS ENUM (
    'NUEVA_SESION',
    'ESPERANDO',
    'ATENDIENDO',
    'EN_ESPERA',
    'DESCANSANDO',
    'CANCELADO',
    'TERMINADO'
);


ALTER TYPE public."Tipado_estados_turnos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 934 (class 1247 OID 17168)
-- Name: Tipado_marcas_tv; Type: TYPE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TYPE public."Tipado_marcas_tv" AS ENUM (
    'ROKU_TV',
    'SAMSUNG_TV',
    'DEFAULT'
);


ALTER TYPE public."Tipado_marcas_tv" OWNER TO invis_turnero_app_user;

--
-- TOC entry 928 (class 1247 OID 17145)
-- Name: Tipado_protocolos; Type: TYPE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TYPE public."Tipado_protocolos" AS ENUM (
    'ARS',
    'SERVICIO',
    'DEFAULT'
);


ALTER TYPE public."Tipado_protocolos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 1081 (class 1247 OID 22305)
-- Name: turno_llamada; Type: TYPE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TYPE public.turno_llamada AS ENUM (
    'UNCALLED',
    'CALLING',
    'CALLED'
);


ALTER TYPE public.turno_llamada OWNER TO invis_turnero_app_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 238 (class 1259 OID 17271)
-- Name: Agentes; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Agentes" (
    id integer NOT NULL,
    nombre character varying(30) NOT NULL,
    descripcion character varying(50) NOT NULL,
    grupo_servicio_id integer NOT NULL,
    tipo_agente_id integer NOT NULL,
    departamento_sucursal_id integer NOT NULL,
    usuario_id integer NOT NULL,
    estatus boolean DEFAULT true,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    esperando boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Agentes" OWNER TO invis_turnero_app_user;

--
-- TOC entry 237 (class 1259 OID 17270)
-- Name: Agentes_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Agentes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Agentes_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3742 (class 0 OID 0)
-- Dependencies: 237
-- Name: Agentes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Agentes_id_seq" OWNED BY public."Agentes".id;


--
-- TOC entry 223 (class 1259 OID 17208)
-- Name: Atenciones_turnos_servicios; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Atenciones_turnos_servicios" (
    turno_id integer NOT NULL,
    agente_id integer NOT NULL,
    servicio_id integer NOT NULL,
    hora_inicio time(0) without time zone,
    hora_fin time(0) without time zone,
    espera_segundos integer,
    estado_turno_id integer DEFAULT 1,
    estatus_llamada public.turno_llamada DEFAULT 'UNCALLED'::public.turno_llamada NOT NULL,
    razon_cancelado_id integer
);


ALTER TABLE public."Atenciones_turnos_servicios" OWNER TO invis_turnero_app_user;

--
-- TOC entry 232 (class 1259 OID 17243)
-- Name: Clientes; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Clientes" (
    id integer NOT NULL,
    nombre character varying(20) DEFAULT 'sin definir'::character varying,
    apellidos character varying(30) DEFAULT 'sin definir'::character varying,
    tipo_identificacion_id integer NOT NULL,
    identificacion character varying(20) NOT NULL,
    seguro_id integer DEFAULT 0,
    nombre_tutorado character varying(40),
    fecha_ultima_visita date,
    estatus boolean DEFAULT true,
    registrado_por_id integer NOT NULL,
    modificado_por_id integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Clientes" OWNER TO invis_turnero_app_user;

--
-- TOC entry 231 (class 1259 OID 17242)
-- Name: Clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Clientes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Clientes_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3743 (class 0 OID 0)
-- Dependencies: 231
-- Name: Clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Clientes_id_seq" OWNED BY public."Clientes".id;


--
-- TOC entry 270 (class 1259 OID 17411)
-- Name: Colecciones_multimedia; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Colecciones_multimedia" (
    id integer NOT NULL,
    detalle character varying(50) NOT NULL,
    nombre_corto character varying(10) NOT NULL
);


ALTER TABLE public."Colecciones_multimedia" OWNER TO invis_turnero_app_user;

--
-- TOC entry 269 (class 1259 OID 17410)
-- Name: Colecciones_multimedia_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Colecciones_multimedia_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Colecciones_multimedia_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3744 (class 0 OID 0)
-- Dependencies: 269
-- Name: Colecciones_multimedia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Colecciones_multimedia_id_seq" OWNED BY public."Colecciones_multimedia".id;


--
-- TOC entry 271 (class 1259 OID 17417)
-- Name: Colecciones_multimedia_pantallas; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Colecciones_multimedia_pantallas" (
    coleccion_multimedia_id integer NOT NULL,
    pantalla_id integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    orden integer NOT NULL,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Colecciones_multimedia_pantallas" OWNER TO invis_turnero_app_user;

--
-- TOC entry 287 (class 1259 OID 17490)
-- Name: Configuraciones; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Configuraciones" (
    id integer NOT NULL,
    clave character varying(30) NOT NULL,
    valor character varying(100) NOT NULL,
    detalle character varying(50) NOT NULL,
    valor_default character varying(100) NOT NULL,
    modificado_por_id integer NOT NULL,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."Configuraciones" OWNER TO invis_turnero_app_user;

--
-- TOC entry 286 (class 1259 OID 17489)
-- Name: Configuraciones_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Configuraciones_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Configuraciones_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3745 (class 0 OID 0)
-- Dependencies: 286
-- Name: Configuraciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Configuraciones_id_seq" OWNED BY public."Configuraciones".id;


--
-- TOC entry 299 (class 1259 OID 17536)
-- Name: Contactos_clientes; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Contactos_clientes" (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    fecha_nacimiento date,
    telefono character varying(10) NOT NULL,
    celular character varying(15) NOT NULL,
    referido_id integer NOT NULL,
    direccion_id integer NOT NULL
);


ALTER TABLE public."Contactos_clientes" OWNER TO invis_turnero_app_user;

--
-- TOC entry 298 (class 1259 OID 17535)
-- Name: Contactos_clientes_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Contactos_clientes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Contactos_clientes_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3746 (class 0 OID 0)
-- Dependencies: 298
-- Name: Contactos_clientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Contactos_clientes_id_seq" OWNED BY public."Contactos_clientes".id;


--
-- TOC entry 250 (class 1259 OID 17323)
-- Name: Departamentos; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Departamentos" (
    id integer NOT NULL,
    descripcion character varying(30) NOT NULL,
    siglas character varying(5) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."Departamentos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 249 (class 1259 OID 17322)
-- Name: Departamentos_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Departamentos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Departamentos_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3747 (class 0 OID 0)
-- Dependencies: 249
-- Name: Departamentos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Departamentos_id_seq" OWNED BY public."Departamentos".id;


--
-- TOC entry 251 (class 1259 OID 17330)
-- Name: Departamentos_sucursales; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Departamentos_sucursales" (
    "refId" oid NOT NULL,
    departamento_id integer NOT NULL,
    sucursal_id integer NOT NULL,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Departamentos_sucursales" OWNER TO invis_turnero_app_user;

--
-- TOC entry 256 (class 1259 OID 17354)
-- Name: Dias_laborales; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Dias_laborales" (
    id integer NOT NULL,
    nombre character varying(10) NOT NULL,
    nombre_corto character varying(3) NOT NULL,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Dias_laborales" OWNER TO invis_turnero_app_user;

--
-- TOC entry 255 (class 1259 OID 17353)
-- Name: Dias_laborales_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Dias_laborales_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Dias_laborales_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3748 (class 0 OID 0)
-- Dependencies: 255
-- Name: Dias_laborales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Dias_laborales_id_seq" OWNED BY public."Dias_laborales".id;


--
-- TOC entry 248 (class 1259 OID 17315)
-- Name: Direcciones; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Direcciones" (
    id integer NOT NULL,
    calle character varying(50) NOT NULL,
    numero integer NOT NULL,
    piso integer NOT NULL,
    sector character varying(50) NOT NULL,
    estado_provincia character varying(30) NOT NULL,
    latitud_decimal character varying(20) NOT NULL,
    longitud_decimal character varying(20) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."Direcciones" OWNER TO invis_turnero_app_user;

--
-- TOC entry 247 (class 1259 OID 17314)
-- Name: Direcciones_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Direcciones_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Direcciones_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3749 (class 0 OID 0)
-- Dependencies: 247
-- Name: Direcciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Direcciones_id_seq" OWNED BY public."Direcciones".id;


--
-- TOC entry 218 (class 1259 OID 17185)
-- Name: Estados_turnos; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Estados_turnos" (
    id integer NOT NULL,
    descripcion public."Tipado_estados_turnos" DEFAULT 'NUEVA_SESION'::public."Tipado_estados_turnos" NOT NULL,
    siglas character varying(5) NOT NULL,
    color_hex character varying(7) NOT NULL
);


ALTER TABLE public."Estados_turnos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 217 (class 1259 OID 17184)
-- Name: Estados_turnos_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Estados_turnos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Estados_turnos_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3750 (class 0 OID 0)
-- Dependencies: 217
-- Name: Estados_turnos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Estados_turnos_id_seq" OWNED BY public."Estados_turnos".id;


--
-- TOC entry 244 (class 1259 OID 17297)
-- Name: Estilos_pantallas; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Estilos_pantallas" (
    id integer NOT NULL,
    detalle character varying(40) NOT NULL,
    siglas character varying(5) NOT NULL,
    tv_brand public."Tipado_marcas_tv" DEFAULT 'DEFAULT'::public."Tipado_marcas_tv",
    filepath character varying(30) NOT NULL,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Estilos_pantallas" OWNER TO invis_turnero_app_user;

--
-- TOC entry 243 (class 1259 OID 17296)
-- Name: Estilos_pantallas_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Estilos_pantallas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Estilos_pantallas_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3751 (class 0 OID 0)
-- Dependencies: 243
-- Name: Estilos_pantallas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Estilos_pantallas_id_seq" OWNED BY public."Estilos_pantallas".id;


--
-- TOC entry 260 (class 1259 OID 17369)
-- Name: Grabaciones; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Grabaciones" (
    id integer NOT NULL,
    archivo character varying(20) NOT NULL,
    formato character varying(5) NOT NULL,
    detalle character varying(50) NOT NULL,
    tipo_grabacion_id integer NOT NULL,
    long time without time zone,
    size_byte integer NOT NULL,
    estatus boolean DEFAULT true,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    slug character varying(200) NOT NULL
);


ALTER TABLE public."Grabaciones" OWNER TO invis_turnero_app_user;

--
-- TOC entry 264 (class 1259 OID 17389)
-- Name: Grabaciones_departamentos; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Grabaciones_departamentos" (
    departamento_id integer NOT NULL,
    grabacion_id integer NOT NULL,
    orden integer NOT NULL
);


ALTER TABLE public."Grabaciones_departamentos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 259 (class 1259 OID 17368)
-- Name: Grabaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Grabaciones_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Grabaciones_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3752 (class 0 OID 0)
-- Dependencies: 259
-- Name: Grabaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Grabaciones_id_seq" OWNED BY public."Grabaciones".id;


--
-- TOC entry 263 (class 1259 OID 17384)
-- Name: Grabaciones_servicios; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Grabaciones_servicios" (
    servicio_id integer NOT NULL,
    grabacion_id integer NOT NULL,
    orden integer NOT NULL
);


ALTER TABLE public."Grabaciones_servicios" OWNER TO invis_turnero_app_user;

--
-- TOC entry 222 (class 1259 OID 17202)
-- Name: Grupos_servicios; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Grupos_servicios" (
    id integer NOT NULL,
    descripcion character varying(25) NOT NULL,
    color_hex character varying(7) NOT NULL,
    es_seleccionable boolean DEFAULT true
);


ALTER TABLE public."Grupos_servicios" OWNER TO invis_turnero_app_user;

--
-- TOC entry 221 (class 1259 OID 17201)
-- Name: Grupos_servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Grupos_servicios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Grupos_servicios_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3753 (class 0 OID 0)
-- Dependencies: 221
-- Name: Grupos_servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Grupos_servicios_id_seq" OWNED BY public."Grupos_servicios".id;


--
-- TOC entry 258 (class 1259 OID 17362)
-- Name: Horarios; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Horarios" (
    id integer NOT NULL,
    nombre character varying(20) NOT NULL,
    nombre_corto character varying(5) NOT NULL,
    hora_inicio time(0) without time zone,
    hora_fin time(0) without time zone
);


ALTER TABLE public."Horarios" OWNER TO invis_turnero_app_user;

--
-- TOC entry 254 (class 1259 OID 17348)
-- Name: Horarios_dias_laborables; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Horarios_dias_laborables" (
    horario_id integer NOT NULL,
    dia_laborable_id integer NOT NULL
);


ALTER TABLE public."Horarios_dias_laborables" OWNER TO invis_turnero_app_user;

--
-- TOC entry 257 (class 1259 OID 17361)
-- Name: Horarios_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Horarios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Horarios_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3754 (class 0 OID 0)
-- Dependencies: 257
-- Name: Horarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Horarios_id_seq" OWNED BY public."Horarios".id;


--
-- TOC entry 253 (class 1259 OID 17342)
-- Name: Horarios_sucursales; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Horarios_sucursales" (
    horario_dia_laborable_id integer NOT NULL,
    sucursal_id integer NOT NULL,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Horarios_sucursales" OWNER TO invis_turnero_app_user;

--
-- TOC entry 226 (class 1259 OID 17221)
-- Name: Opciones_flujo; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Opciones_flujo" (
    id integer NOT NULL,
    nombre_boton character varying(20) NOT NULL,
    funcion_accion character varying(50) NOT NULL,
    color_hex character varying(7) NOT NULL
);


ALTER TABLE public."Opciones_flujo" OWNER TO invis_turnero_app_user;

--
-- TOC entry 225 (class 1259 OID 17220)
-- Name: Opciones_flujo_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Opciones_flujo_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Opciones_flujo_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3755 (class 0 OID 0)
-- Dependencies: 225
-- Name: Opciones_flujo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Opciones_flujo_id_seq" OWNED BY public."Opciones_flujo".id;


--
-- TOC entry 228 (class 1259 OID 17228)
-- Name: Opciones_menu; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Opciones_menu" (
    id integer NOT NULL,
    opciones_id integer NOT NULL,
    opcion_menu_servicios_id integer NOT NULL,
    es_principal boolean DEFAULT true,
    orden integer NOT NULL
);


ALTER TABLE public."Opciones_menu" OWNER TO invis_turnero_app_user;

--
-- TOC entry 227 (class 1259 OID 17227)
-- Name: Opciones_menu_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Opciones_menu_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Opciones_menu_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3756 (class 0 OID 0)
-- Dependencies: 227
-- Name: Opciones_menu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Opciones_menu_id_seq" OWNED BY public."Opciones_menu".id;


--
-- TOC entry 230 (class 1259 OID 17236)
-- Name: Opciones_menu_servicios; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Opciones_menu_servicios" (
    id integer NOT NULL,
    estado_turno_id integer NOT NULL,
    grupo_servicio_id integer NOT NULL
);


ALTER TABLE public."Opciones_menu_servicios" OWNER TO invis_turnero_app_user;

--
-- TOC entry 229 (class 1259 OID 17235)
-- Name: Opciones_menu_servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Opciones_menu_servicios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Opciones_menu_servicios_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3757 (class 0 OID 0)
-- Dependencies: 229
-- Name: Opciones_menu_servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Opciones_menu_servicios_id_seq" OWNED BY public."Opciones_menu_servicios".id;


--
-- TOC entry 242 (class 1259 OID 17288)
-- Name: Pantallas; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Pantallas" (
    id integer NOT NULL,
    nombre character varying(20) NOT NULL,
    detalle character varying(50) NOT NULL,
    estilo_id integer NOT NULL,
    sucursal_id integer NOT NULL,
    estatus boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    key text NOT NULL
);


ALTER TABLE public."Pantallas" OWNER TO invis_turnero_app_user;

--
-- TOC entry 241 (class 1259 OID 17287)
-- Name: Pantallas_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Pantallas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Pantallas_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3758 (class 0 OID 0)
-- Dependencies: 241
-- Name: Pantallas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Pantallas_id_seq" OWNED BY public."Pantallas".id;


--
-- TOC entry 284 (class 1259 OID 17474)
-- Name: Permisos; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Permisos" (
    id integer NOT NULL,
    nombre character varying(15) NOT NULL,
    slug character varying(30) NOT NULL
);


ALTER TABLE public."Permisos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 283 (class 1259 OID 17473)
-- Name: Permisos_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Permisos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Permisos_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3759 (class 0 OID 0)
-- Dependencies: 283
-- Name: Permisos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Permisos_id_seq" OWNED BY public."Permisos".id;


--
-- TOC entry 273 (class 1259 OID 17424)
-- Name: Protocolos; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Protocolos" (
    id integer NOT NULL,
    nombre character varying(30) NOT NULL,
    descripcion character varying(50) NOT NULL,
    tipo_protocolo_id integer NOT NULL,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Protocolos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 272 (class 1259 OID 17423)
-- Name: Protocolos_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Protocolos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Protocolos_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3760 (class 0 OID 0)
-- Dependencies: 272
-- Name: Protocolos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Protocolos_id_seq" OWNED BY public."Protocolos".id;


--
-- TOC entry 302 (class 1259 OID 50865)
-- Name: Razones_Cancelados; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Razones_Cancelados" (
    id integer NOT NULL,
    nombre character varying(30) NOT NULL,
    descripcion character varying(100) NOT NULL
);


ALTER TABLE public."Razones_Cancelados" OWNER TO invis_turnero_app_user;

--
-- TOC entry 301 (class 1259 OID 50864)
-- Name: Razones_Cancelados_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Razones_Cancelados_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Razones_Cancelados_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3761 (class 0 OID 0)
-- Dependencies: 301
-- Name: Razones_Cancelados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Razones_Cancelados_id_seq" OWNED BY public."Razones_Cancelados".id;


--
-- TOC entry 266 (class 1259 OID 17395)
-- Name: Recursos_multimedia; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Recursos_multimedia" (
    id integer NOT NULL,
    archivo character varying(20) NOT NULL,
    tipo_id integer NOT NULL,
    formato character varying(5) NOT NULL,
    detalle character varying(50) NOT NULL,
    coleccion_multimedia_id integer NOT NULL,
    long time without time zone,
    size integer NOT NULL,
    estatus boolean DEFAULT true,
    subido_por_id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone,
    slug character varying(200) NOT NULL
);


ALTER TABLE public."Recursos_multimedia" OWNER TO invis_turnero_app_user;

--
-- TOC entry 265 (class 1259 OID 17394)
-- Name: Recursos_multimedia_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Recursos_multimedia_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Recursos_multimedia_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3762 (class 0 OID 0)
-- Dependencies: 265
-- Name: Recursos_multimedia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Recursos_multimedia_id_seq" OWNED BY public."Recursos_multimedia".id;


--
-- TOC entry 295 (class 1259 OID 17522)
-- Name: Referimientos; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Referimientos" (
    id integer NOT NULL,
    nombre character varying(10) NOT NULL,
    referencia character varying(30) NOT NULL,
    tipo_id integer NOT NULL,
    descripcion character varying(100) NOT NULL,
    localidad character varying(50) NOT NULL,
    sector character varying(50) NOT NULL,
    estado_provincia character varying(30) NOT NULL
);


ALTER TABLE public."Referimientos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 294 (class 1259 OID 17521)
-- Name: Referimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Referimientos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Referimientos_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3763 (class 0 OID 0)
-- Dependencies: 294
-- Name: Referimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Referimientos_id_seq" OWNED BY public."Referimientos".id;


--
-- TOC entry 289 (class 1259 OID 17497)
-- Name: Registros_desactivados; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Registros_desactivados" (
    id integer NOT NULL,
    nombre_entidad character varying(30) NOT NULL,
    id_registro integer NOT NULL,
    razon_desactivado character varying(100) NOT NULL,
    usuario_id integer NOT NULL,
    fecha_hora timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Registros_desactivados" OWNER TO invis_turnero_app_user;

--
-- TOC entry 288 (class 1259 OID 17496)
-- Name: Registros_desactivados_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Registros_desactivados_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Registros_desactivados_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3764 (class 0 OID 0)
-- Dependencies: 288
-- Name: Registros_desactivados_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Registros_desactivados_id_seq" OWNED BY public."Registros_desactivados".id;


--
-- TOC entry 282 (class 1259 OID 17466)
-- Name: Roles; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Roles" (
    id integer NOT NULL,
    nombre character varying(30) NOT NULL,
    descripcion character varying(50) NOT NULL,
    activo boolean DEFAULT true
);


ALTER TABLE public."Roles" OWNER TO invis_turnero_app_user;

--
-- TOC entry 281 (class 1259 OID 17465)
-- Name: Roles_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Roles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Roles_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3765 (class 0 OID 0)
-- Dependencies: 281
-- Name: Roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Roles_id_seq" OWNED BY public."Roles".id;


--
-- TOC entry 285 (class 1259 OID 17480)
-- Name: Roles_permisos; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Roles_permisos" (
    rol_id integer NOT NULL,
    permiso_id integer NOT NULL,
    "create" boolean DEFAULT false NOT NULL,
    read boolean DEFAULT false NOT NULL,
    update boolean DEFAULT false NOT NULL,
    delete boolean DEFAULT false NOT NULL
);


ALTER TABLE public."Roles_permisos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 234 (class 1259 OID 17255)
-- Name: Seguros; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Seguros" (
    id integer NOT NULL,
    nombre character varying(60) NOT NULL,
    nombre_corto character varying(10) NOT NULL,
    siglas character varying(3) NOT NULL,
    estatus boolean DEFAULT true,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Seguros" OWNER TO invis_turnero_app_user;

--
-- TOC entry 233 (class 1259 OID 17254)
-- Name: Seguros_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Seguros_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Seguros_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3766 (class 0 OID 0)
-- Dependencies: 233
-- Name: Seguros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Seguros_id_seq" OWNED BY public."Seguros".id;


--
-- TOC entry 220 (class 1259 OID 17193)
-- Name: Servicios; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Servicios" (
    id integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    nombre_corto character varying(20) NOT NULL,
    prefijo character varying(3) NOT NULL,
    grupo_id integer NOT NULL,
    es_seleccionable boolean DEFAULT true,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Servicios" OWNER TO invis_turnero_app_user;

--
-- TOC entry 252 (class 1259 OID 17336)
-- Name: Servicios_departamentos_sucursales; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Servicios_departamentos_sucursales" (
    servicio_id integer NOT NULL,
    estatus boolean DEFAULT true,
    "departamento_sucursal_refId" integer NOT NULL
);


ALTER TABLE public."Servicios_departamentos_sucursales" OWNER TO invis_turnero_app_user;

--
-- TOC entry 278 (class 1259 OID 17447)
-- Name: Servicios_dependientes; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Servicios_dependientes" (
    id integer NOT NULL,
    serie_servicios jsonb NOT NULL,
    turno_id integer NOT NULL
);


ALTER TABLE public."Servicios_dependientes" OWNER TO invis_turnero_app_user;

--
-- TOC entry 277 (class 1259 OID 17446)
-- Name: Servicios_dependientes_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Servicios_dependientes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Servicios_dependientes_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3767 (class 0 OID 0)
-- Dependencies: 277
-- Name: Servicios_dependientes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Servicios_dependientes_id_seq" OWNED BY public."Servicios_dependientes".id;


--
-- TOC entry 219 (class 1259 OID 17192)
-- Name: Servicios_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Servicios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Servicios_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3768 (class 0 OID 0)
-- Dependencies: 219
-- Name: Servicios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Servicios_id_seq" OWNED BY public."Servicios".id;


--
-- TOC entry 276 (class 1259 OID 17440)
-- Name: Servicios_seguros; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Servicios_seguros" (
    servicio_id integer NOT NULL,
    seguro_id integer NOT NULL,
    protocolo_id integer NOT NULL,
    cobertura character varying(10),
    prioridad integer NOT NULL,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Servicios_seguros" OWNER TO invis_turnero_app_user;

--
-- TOC entry 224 (class 1259 OID 17213)
-- Name: Servicios_sucursales; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Servicios_sucursales" (
    servicio_id integer NOT NULL,
    sucursal_id integer NOT NULL,
    disponible boolean DEFAULT true,
    razon_no_disponible character varying(40) NOT NULL,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Servicios_sucursales" OWNER TO invis_turnero_app_user;

--
-- TOC entry 246 (class 1259 OID 17306)
-- Name: Sucursales; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Sucursales" (
    id integer NOT NULL,
    descripcion character varying(30) NOT NULL,
    siglas character varying(8) NOT NULL,
    direccion_id integer NOT NULL,
    estatus boolean DEFAULT true,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."Sucursales" OWNER TO invis_turnero_app_user;

--
-- TOC entry 245 (class 1259 OID 17305)
-- Name: Sucursales_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Sucursales_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Sucursales_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3769 (class 0 OID 0)
-- Dependencies: 245
-- Name: Sucursales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Sucursales_id_seq" OWNED BY public."Sucursales".id;


--
-- TOC entry 240 (class 1259 OID 17280)
-- Name: Tipos_agentes; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Tipos_agentes" (
    id integer NOT NULL,
    nombre character varying(25) NOT NULL,
    nombre_corto character varying(5) NOT NULL,
    descripcion character varying(50) NOT NULL,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Tipos_agentes" OWNER TO invis_turnero_app_user;

--
-- TOC entry 239 (class 1259 OID 17279)
-- Name: Tipos_agentes_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Tipos_agentes_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tipos_agentes_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3770 (class 0 OID 0)
-- Dependencies: 239
-- Name: Tipos_agentes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Tipos_agentes_id_seq" OWNED BY public."Tipos_agentes".id;


--
-- TOC entry 262 (class 1259 OID 17378)
-- Name: Tipos_grabaciones; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Tipos_grabaciones" (
    id integer NOT NULL,
    detalle character varying(50) NOT NULL,
    nombre_corto character varying(10) NOT NULL
);


ALTER TABLE public."Tipos_grabaciones" OWNER TO invis_turnero_app_user;

--
-- TOC entry 261 (class 1259 OID 17377)
-- Name: Tipos_grabaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Tipos_grabaciones_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tipos_grabaciones_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3771 (class 0 OID 0)
-- Dependencies: 261
-- Name: Tipos_grabaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Tipos_grabaciones_id_seq" OWNED BY public."Tipos_grabaciones".id;


--
-- TOC entry 236 (class 1259 OID 17264)
-- Name: Tipos_identificaciones; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Tipos_identificaciones" (
    id integer NOT NULL,
    nombre character varying(12) NOT NULL,
    regex_formato character varying(20) NOT NULL,
    long_minima integer NOT NULL,
    long_maxima integer NOT NULL
);


ALTER TABLE public."Tipos_identificaciones" OWNER TO invis_turnero_app_user;

--
-- TOC entry 235 (class 1259 OID 17263)
-- Name: Tipos_identificaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Tipos_identificaciones_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tipos_identificaciones_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3772 (class 0 OID 0)
-- Dependencies: 235
-- Name: Tipos_identificaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Tipos_identificaciones_id_seq" OWNED BY public."Tipos_identificaciones".id;


--
-- TOC entry 268 (class 1259 OID 17404)
-- Name: Tipos_multimedia; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Tipos_multimedia" (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL,
    siglas character varying(3) NOT NULL,
    icono character varying(20) NOT NULL,
    color_hex character varying(7) NOT NULL
);


ALTER TABLE public."Tipos_multimedia" OWNER TO invis_turnero_app_user;

--
-- TOC entry 267 (class 1259 OID 17403)
-- Name: Tipos_multimedia_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Tipos_multimedia_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tipos_multimedia_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3773 (class 0 OID 0)
-- Dependencies: 267
-- Name: Tipos_multimedia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Tipos_multimedia_id_seq" OWNED BY public."Tipos_multimedia".id;


--
-- TOC entry 275 (class 1259 OID 17432)
-- Name: Tipos_protocolos; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Tipos_protocolos" (
    id integer NOT NULL,
    tipo public."Tipado_protocolos" DEFAULT 'SERVICIO'::public."Tipado_protocolos" NOT NULL,
    descripcion character varying(50) NOT NULL,
    estatus boolean DEFAULT true
);


ALTER TABLE public."Tipos_protocolos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 274 (class 1259 OID 17431)
-- Name: Tipos_protocolos_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Tipos_protocolos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tipos_protocolos_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3774 (class 0 OID 0)
-- Dependencies: 274
-- Name: Tipos_protocolos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Tipos_protocolos_id_seq" OWNED BY public."Tipos_protocolos".id;


--
-- TOC entry 297 (class 1259 OID 17529)
-- Name: Tipos_referimientos; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Tipos_referimientos" (
    id integer NOT NULL,
    nombre character varying(10) NOT NULL,
    descripcion character varying(50) NOT NULL
);


ALTER TABLE public."Tipos_referimientos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 296 (class 1259 OID 17528)
-- Name: Tipos_referimientos_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Tipos_referimientos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tipos_referimientos_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3775 (class 0 OID 0)
-- Dependencies: 296
-- Name: Tipos_referimientos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Tipos_referimientos_id_seq" OWNED BY public."Tipos_referimientos".id;


--
-- TOC entry 293 (class 1259 OID 17515)
-- Name: Tipos_visitas; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Tipos_visitas" (
    id integer NOT NULL,
    nombre character varying(10) NOT NULL,
    descripcion character varying(50) NOT NULL,
    servicio_destino_id integer NOT NULL
);


ALTER TABLE public."Tipos_visitas" OWNER TO invis_turnero_app_user;

--
-- TOC entry 292 (class 1259 OID 17514)
-- Name: Tipos_visitas_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Tipos_visitas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Tipos_visitas_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3776 (class 0 OID 0)
-- Dependencies: 292
-- Name: Tipos_visitas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Tipos_visitas_id_seq" OWNED BY public."Tipos_visitas".id;


--
-- TOC entry 216 (class 1259 OID 17176)
-- Name: Turnos; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Turnos" (
    id integer NOT NULL,
    secuencia_ticket character varying(5) NOT NULL,
    servicio_actual_id integer NOT NULL,
    servicio_destino_id integer NOT NULL,
    estado_turno_id integer DEFAULT 1,
    cola_posicion integer NOT NULL,
    cliente_id integer NOT NULL,
    sucursal_id integer NOT NULL,
    fecha_turno date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    registrado_por_id integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public."Turnos" OWNER TO invis_turnero_app_user;

--
-- TOC entry 215 (class 1259 OID 17175)
-- Name: Turnos_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Turnos_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Turnos_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3777 (class 0 OID 0)
-- Dependencies: 215
-- Name: Turnos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Turnos_id_seq" OWNED BY public."Turnos".id;


--
-- TOC entry 280 (class 1259 OID 17455)
-- Name: Usuarios; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Usuarios" (
    id integer NOT NULL,
    nombres character varying(50) NOT NULL,
    correo character varying(60) NOT NULL,
    username character varying(15) NOT NULL,
    password text NOT NULL,
    rol_id integer NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    token text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."Usuarios" OWNER TO invis_turnero_app_user;

--
-- TOC entry 279 (class 1259 OID 17454)
-- Name: Usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Usuarios_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Usuarios_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3778 (class 0 OID 0)
-- Dependencies: 279
-- Name: Usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Usuarios_id_seq" OWNED BY public."Usuarios".id;


--
-- TOC entry 291 (class 1259 OID 17505)
-- Name: Visitas_agendadas; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public."Visitas_agendadas" (
    id integer NOT NULL,
    cliente_id integer NOT NULL,
    descripcion character varying(50) NOT NULL,
    tipo_visita_id integer NOT NULL,
    fecha_hora_planificada timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP,
    sucursal_id integer NOT NULL,
    comentario character varying(255) NOT NULL,
    estatus boolean DEFAULT true NOT NULL,
    registrado_por integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone
);


ALTER TABLE public."Visitas_agendadas" OWNER TO invis_turnero_app_user;

--
-- TOC entry 290 (class 1259 OID 17504)
-- Name: Visitas_agendadas_id_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public."Visitas_agendadas_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Visitas_agendadas_id_seq" OWNER TO invis_turnero_app_user;

--
-- TOC entry 3779 (class 0 OID 0)
-- Dependencies: 290
-- Name: Visitas_agendadas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public."Visitas_agendadas_id_seq" OWNED BY public."Visitas_agendadas".id;


--
-- TOC entry 214 (class 1259 OID 17135)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: invis_turnero_app_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO invis_turnero_app_user;

--
-- TOC entry 300 (class 1259 OID 17861)
-- Name: departamentos_sucursales_refid_seq; Type: SEQUENCE; Schema: public; Owner: invis_turnero_app_user
--

CREATE SEQUENCE public.departamentos_sucursales_refid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.departamentos_sucursales_refid_seq OWNER TO invis_turnero_app_user;

--
-- TOC entry 3780 (class 0 OID 0)
-- Dependencies: 300
-- Name: departamentos_sucursales_refid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: invis_turnero_app_user
--

ALTER SEQUENCE public.departamentos_sucursales_refid_seq OWNED BY public."Departamentos_sucursales"."refId";


--
-- TOC entry 3269 (class 2604 OID 17274)
-- Name: Agentes id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Agentes" ALTER COLUMN id SET DEFAULT nextval('public."Agentes_id_seq"'::regclass);


--
-- TOC entry 3259 (class 2604 OID 17246)
-- Name: Clientes id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Clientes" ALTER COLUMN id SET DEFAULT nextval('public."Clientes_id_seq"'::regclass);


--
-- TOC entry 3303 (class 2604 OID 17414)
-- Name: Colecciones_multimedia id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Colecciones_multimedia" ALTER COLUMN id SET DEFAULT nextval('public."Colecciones_multimedia_id_seq"'::regclass);


--
-- TOC entry 3322 (class 2604 OID 17493)
-- Name: Configuraciones id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Configuraciones" ALTER COLUMN id SET DEFAULT nextval('public."Configuraciones_id_seq"'::regclass);


--
-- TOC entry 3332 (class 2604 OID 17539)
-- Name: Contactos_clientes id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Contactos_clientes" ALTER COLUMN id SET DEFAULT nextval('public."Contactos_clientes_id_seq"'::regclass);


--
-- TOC entry 3286 (class 2604 OID 17326)
-- Name: Departamentos id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Departamentos" ALTER COLUMN id SET DEFAULT nextval('public."Departamentos_id_seq"'::regclass);


--
-- TOC entry 3288 (class 2604 OID 17862)
-- Name: Departamentos_sucursales refId; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Departamentos_sucursales" ALTER COLUMN "refId" SET DEFAULT nextval('public.departamentos_sucursales_refid_seq'::regclass);


--
-- TOC entry 3292 (class 2604 OID 17357)
-- Name: Dias_laborales id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Dias_laborales" ALTER COLUMN id SET DEFAULT nextval('public."Dias_laborales_id_seq"'::regclass);


--
-- TOC entry 3284 (class 2604 OID 17318)
-- Name: Direcciones id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Direcciones" ALTER COLUMN id SET DEFAULT nextval('public."Direcciones_id_seq"'::regclass);


--
-- TOC entry 3244 (class 2604 OID 17188)
-- Name: Estados_turnos id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Estados_turnos" ALTER COLUMN id SET DEFAULT nextval('public."Estados_turnos_id_seq"'::regclass);


--
-- TOC entry 3278 (class 2604 OID 17300)
-- Name: Estilos_pantallas id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Estilos_pantallas" ALTER COLUMN id SET DEFAULT nextval('public."Estilos_pantallas_id_seq"'::regclass);


--
-- TOC entry 3295 (class 2604 OID 17372)
-- Name: Grabaciones id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grabaciones" ALTER COLUMN id SET DEFAULT nextval('public."Grabaciones_id_seq"'::regclass);


--
-- TOC entry 3249 (class 2604 OID 17205)
-- Name: Grupos_servicios id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grupos_servicios" ALTER COLUMN id SET DEFAULT nextval('public."Grupos_servicios_id_seq"'::regclass);


--
-- TOC entry 3294 (class 2604 OID 17365)
-- Name: Horarios id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Horarios" ALTER COLUMN id SET DEFAULT nextval('public."Horarios_id_seq"'::regclass);


--
-- TOC entry 3255 (class 2604 OID 17224)
-- Name: Opciones_flujo id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Opciones_flujo" ALTER COLUMN id SET DEFAULT nextval('public."Opciones_flujo_id_seq"'::regclass);


--
-- TOC entry 3256 (class 2604 OID 17231)
-- Name: Opciones_menu id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Opciones_menu" ALTER COLUMN id SET DEFAULT nextval('public."Opciones_menu_id_seq"'::regclass);


--
-- TOC entry 3258 (class 2604 OID 17239)
-- Name: Opciones_menu_servicios id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Opciones_menu_servicios" ALTER COLUMN id SET DEFAULT nextval('public."Opciones_menu_servicios_id_seq"'::regclass);


--
-- TOC entry 3275 (class 2604 OID 17291)
-- Name: Pantallas id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Pantallas" ALTER COLUMN id SET DEFAULT nextval('public."Pantallas_id_seq"'::regclass);


--
-- TOC entry 3317 (class 2604 OID 17477)
-- Name: Permisos id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Permisos" ALTER COLUMN id SET DEFAULT nextval('public."Permisos_id_seq"'::regclass);


--
-- TOC entry 3305 (class 2604 OID 17427)
-- Name: Protocolos id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Protocolos" ALTER COLUMN id SET DEFAULT nextval('public."Protocolos_id_seq"'::regclass);


--
-- TOC entry 3333 (class 2604 OID 50868)
-- Name: Razones_Cancelados id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Razones_Cancelados" ALTER COLUMN id SET DEFAULT nextval('public."Razones_Cancelados_id_seq"'::regclass);


--
-- TOC entry 3299 (class 2604 OID 17398)
-- Name: Recursos_multimedia id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Recursos_multimedia" ALTER COLUMN id SET DEFAULT nextval('public."Recursos_multimedia_id_seq"'::regclass);


--
-- TOC entry 3330 (class 2604 OID 17525)
-- Name: Referimientos id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Referimientos" ALTER COLUMN id SET DEFAULT nextval('public."Referimientos_id_seq"'::regclass);


--
-- TOC entry 3323 (class 2604 OID 17500)
-- Name: Registros_desactivados id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Registros_desactivados" ALTER COLUMN id SET DEFAULT nextval('public."Registros_desactivados_id_seq"'::regclass);


--
-- TOC entry 3315 (class 2604 OID 17469)
-- Name: Roles id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Roles" ALTER COLUMN id SET DEFAULT nextval('public."Roles_id_seq"'::regclass);


--
-- TOC entry 3265 (class 2604 OID 17258)
-- Name: Seguros id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Seguros" ALTER COLUMN id SET DEFAULT nextval('public."Seguros_id_seq"'::regclass);


--
-- TOC entry 3246 (class 2604 OID 17196)
-- Name: Servicios id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios" ALTER COLUMN id SET DEFAULT nextval('public."Servicios_id_seq"'::regclass);


--
-- TOC entry 3311 (class 2604 OID 17450)
-- Name: Servicios_dependientes id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_dependientes" ALTER COLUMN id SET DEFAULT nextval('public."Servicios_dependientes_id_seq"'::regclass);


--
-- TOC entry 3281 (class 2604 OID 17309)
-- Name: Sucursales id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Sucursales" ALTER COLUMN id SET DEFAULT nextval('public."Sucursales_id_seq"'::regclass);


--
-- TOC entry 3273 (class 2604 OID 17283)
-- Name: Tipos_agentes id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_agentes" ALTER COLUMN id SET DEFAULT nextval('public."Tipos_agentes_id_seq"'::regclass);


--
-- TOC entry 3298 (class 2604 OID 17381)
-- Name: Tipos_grabaciones id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_grabaciones" ALTER COLUMN id SET DEFAULT nextval('public."Tipos_grabaciones_id_seq"'::regclass);


--
-- TOC entry 3268 (class 2604 OID 17267)
-- Name: Tipos_identificaciones id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_identificaciones" ALTER COLUMN id SET DEFAULT nextval('public."Tipos_identificaciones_id_seq"'::regclass);


--
-- TOC entry 3302 (class 2604 OID 17407)
-- Name: Tipos_multimedia id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_multimedia" ALTER COLUMN id SET DEFAULT nextval('public."Tipos_multimedia_id_seq"'::regclass);


--
-- TOC entry 3307 (class 2604 OID 17435)
-- Name: Tipos_protocolos id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_protocolos" ALTER COLUMN id SET DEFAULT nextval('public."Tipos_protocolos_id_seq"'::regclass);


--
-- TOC entry 3331 (class 2604 OID 17532)
-- Name: Tipos_referimientos id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_referimientos" ALTER COLUMN id SET DEFAULT nextval('public."Tipos_referimientos_id_seq"'::regclass);


--
-- TOC entry 3329 (class 2604 OID 17518)
-- Name: Tipos_visitas id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_visitas" ALTER COLUMN id SET DEFAULT nextval('public."Tipos_visitas_id_seq"'::regclass);


--
-- TOC entry 3240 (class 2604 OID 17179)
-- Name: Turnos id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Turnos" ALTER COLUMN id SET DEFAULT nextval('public."Turnos_id_seq"'::regclass);


--
-- TOC entry 3312 (class 2604 OID 17458)
-- Name: Usuarios id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Usuarios" ALTER COLUMN id SET DEFAULT nextval('public."Usuarios_id_seq"'::regclass);


--
-- TOC entry 3325 (class 2604 OID 17508)
-- Name: Visitas_agendadas id; Type: DEFAULT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Visitas_agendadas" ALTER COLUMN id SET DEFAULT nextval('public."Visitas_agendadas_id_seq"'::regclass);


--
-- TOC entry 3672 (class 0 OID 17271)
-- Dependencies: 238
-- Data for Name: Agentes; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Agentes" (id, nombre, descripcion, grupo_servicio_id, tipo_agente_id, departamento_sucursal_id, usuario_id, estatus, "createdAt", "updatedAt", esperando) FROM stdin;
1	IT Support	Soporte de Tecnologia	1	1	1	1	t	2023-07-06 21:10:14.401	2023-07-06 21:08:27.882	f
2	Reg Millon	Registro en el Millon	3	2	1	2	t	2023-07-19 02:38:53.585	2023-07-19 02:37:54.499	f
\.


--
-- TOC entry 3657 (class 0 OID 17208)
-- Dependencies: 223
-- Data for Name: Atenciones_turnos_servicios; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Atenciones_turnos_servicios" (turno_id, agente_id, servicio_id, hora_inicio, hora_fin, espera_segundos, estado_turno_id, estatus_llamada, razon_cancelado_id) FROM stdin;
\.


--
-- TOC entry 3666 (class 0 OID 17243)
-- Dependencies: 232
-- Data for Name: Clientes; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Clientes" (id, nombre, apellidos, tipo_identificacion_id, identificacion, seguro_id, nombre_tutorado, fecha_ultima_visita, estatus, registrado_por_id, modificado_por_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3704 (class 0 OID 17411)
-- Dependencies: 270
-- Data for Name: Colecciones_multimedia; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Colecciones_multimedia" (id, detalle, nombre_corto) FROM stdin;
2	Juan Luis Guerra - Variada	JL Guerra
1	Anuncios Generales de Internet	Anounces
3	Musica Clasica - Piano	Piano
4	Poster de Redes Sociales	Posters
5	Peliculas de Comedia	Comedy
\.


--
-- TOC entry 3705 (class 0 OID 17417)
-- Dependencies: 271
-- Data for Name: Colecciones_multimedia_pantallas; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Colecciones_multimedia_pantallas" (coleccion_multimedia_id, pantalla_id, descripcion, orden, estatus) FROM stdin;
\.


--
-- TOC entry 3721 (class 0 OID 17490)
-- Dependencies: 287
-- Data for Name: Configuraciones; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Configuraciones" (id, clave, valor, detalle, valor_default, modificado_por_id, "updatedAt") FROM stdin;
\.


--
-- TOC entry 3733 (class 0 OID 17536)
-- Dependencies: 299
-- Data for Name: Contactos_clientes; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Contactos_clientes" (id, cliente_id, fecha_nacimiento, telefono, celular, referido_id, direccion_id) FROM stdin;
\.


--
-- TOC entry 3684 (class 0 OID 17323)
-- Dependencies: 250
-- Data for Name: Departamentos; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Departamentos" (id, descripcion, siglas, "createdAt", "updatedAt") FROM stdin;
1	Administrativo	ADMIN	2023-07-06 21:09:08.439	2023-07-06 21:09:08.439
\.


--
-- TOC entry 3685 (class 0 OID 17330)
-- Dependencies: 251
-- Data for Name: Departamentos_sucursales; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Departamentos_sucursales" ("refId", departamento_id, sucursal_id, estatus) FROM stdin;
1	1	1	t
\.


--
-- TOC entry 3690 (class 0 OID 17354)
-- Dependencies: 256
-- Data for Name: Dias_laborales; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Dias_laborales" (id, nombre, nombre_corto, estatus) FROM stdin;
\.


--
-- TOC entry 3682 (class 0 OID 17315)
-- Dependencies: 248
-- Data for Name: Direcciones; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Direcciones" (id, calle, numero, piso, sector, estado_provincia, latitud_decimal, longitud_decimal, "createdAt", "updatedAt") FROM stdin;
1	C/ Carmen Celia Balaguer	7	1	El Millon	Santo Domingo	18.4580643	-69.9572666	2023-07-06 21:04:41.28	2023-07-06 21:04:41.28
2	Av. Ortega y Gasset	90	1	Cristo Rey	Distrito Nacional	18.5019339	-69.9225775	2023-07-19 02:30:49.885	2023-07-19 02:46:01.147
3	Aut. Ramon Caceres	5	1	Plaza City Center, Local A-1.3	Moca	19.38991602310967	-70.528942384656	2023-07-19 02:50:44.467	2023-07-19 02:51:18.569
\.


--
-- TOC entry 3652 (class 0 OID 17185)
-- Dependencies: 218
-- Data for Name: Estados_turnos; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Estados_turnos" (id, descripcion, siglas, color_hex) FROM stdin;
1	NUEVA_SESION	NEW	#a3a345
2	ESPERANDO	WAIT	#a3a345
3	ATENDIENDO	ON	#a3a345
4	EN_ESPERA	OFF	#a3a345
5	DESCANSANDO	FREE	#a3a345
6	CANCELADO	OUT	#a3a345
7	TERMINADO	END	#a3a345
\.


--
-- TOC entry 3678 (class 0 OID 17297)
-- Dependencies: 244
-- Data for Name: Estilos_pantallas; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Estilos_pantallas" (id, detalle, siglas, tv_brand, filepath, estatus) FROM stdin;
1	Diseño simple y minimalista	EASY	ROKU_TV	SimpleScreen.xml	t
2	Diseño simple y minimalista	EASY	SAMSUNG_TV	SimpleScreen.html	t
\.


--
-- TOC entry 3694 (class 0 OID 17369)
-- Dependencies: 260
-- Data for Name: Grabaciones; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Grabaciones" (id, archivo, formato, detalle, tipo_grabacion_id, long, size_byte, estatus, "createdAt", "updatedAt", slug) FROM stdin;
\.


--
-- TOC entry 3698 (class 0 OID 17389)
-- Dependencies: 264
-- Data for Name: Grabaciones_departamentos; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Grabaciones_departamentos" (departamento_id, grabacion_id, orden) FROM stdin;
\.


--
-- TOC entry 3697 (class 0 OID 17384)
-- Dependencies: 263
-- Data for Name: Grabaciones_servicios; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Grabaciones_servicios" (servicio_id, grabacion_id, orden) FROM stdin;
\.


--
-- TOC entry 3656 (class 0 OID 17202)
-- Dependencies: 222
-- Data for Name: Grupos_servicios; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Grupos_servicios" (id, descripcion, color_hex, es_seleccionable) FROM stdin;
1	ADMIN	#010101	f
2	SISTEMA	#f1d123	f
3	Recepcion	#a1d312	f
4	Consultas	#b1d123	t
5	Estudios	#c1d123	t
7	Procedimientos	#e1d123	t
6	Optica y Farmacia	#d1d123	t
\.


--
-- TOC entry 3692 (class 0 OID 17362)
-- Dependencies: 258
-- Data for Name: Horarios; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Horarios" (id, nombre, nombre_corto, hora_inicio, hora_fin) FROM stdin;
1	Matutino	Mat	12:00:00	16:00:00
2	Vespertino	Vesp	13:00:00	18:00:00
\.


--
-- TOC entry 3688 (class 0 OID 17348)
-- Dependencies: 254
-- Data for Name: Horarios_dias_laborables; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Horarios_dias_laborables" (horario_id, dia_laborable_id) FROM stdin;
\.


--
-- TOC entry 3687 (class 0 OID 17342)
-- Dependencies: 253
-- Data for Name: Horarios_sucursales; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Horarios_sucursales" (horario_dia_laborable_id, sucursal_id, estatus) FROM stdin;
\.


--
-- TOC entry 3660 (class 0 OID 17221)
-- Dependencies: 226
-- Data for Name: Opciones_flujo; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Opciones_flujo" (id, nombre_boton, funcion_accion, color_hex) FROM stdin;
\.


--
-- TOC entry 3662 (class 0 OID 17228)
-- Dependencies: 228
-- Data for Name: Opciones_menu; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Opciones_menu" (id, opciones_id, opcion_menu_servicios_id, es_principal, orden) FROM stdin;
\.


--
-- TOC entry 3664 (class 0 OID 17236)
-- Dependencies: 230
-- Data for Name: Opciones_menu_servicios; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Opciones_menu_servicios" (id, estado_turno_id, grupo_servicio_id) FROM stdin;
\.


--
-- TOC entry 3676 (class 0 OID 17288)
-- Dependencies: 242
-- Data for Name: Pantallas; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Pantallas" (id, nombre, detalle, estilo_id, sucursal_id, estatus, "createdAt", "updatedAt", key) FROM stdin;
\.


--
-- TOC entry 3718 (class 0 OID 17474)
-- Dependencies: 284
-- Data for Name: Permisos; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Permisos" (id, nombre, slug) FROM stdin;
1	Turnos	adminQueues
\.


--
-- TOC entry 3707 (class 0 OID 17424)
-- Dependencies: 273
-- Data for Name: Protocolos; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Protocolos" (id, nombre, descripcion, tipo_protocolo_id, estatus) FROM stdin;
\.


--
-- TOC entry 3736 (class 0 OID 50865)
-- Dependencies: 302
-- Data for Name: Razones_Cancelados; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Razones_Cancelados" (id, nombre, descripcion) FROM stdin;
\.


--
-- TOC entry 3700 (class 0 OID 17395)
-- Dependencies: 266
-- Data for Name: Recursos_multimedia; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Recursos_multimedia" (id, archivo, tipo_id, formato, detalle, coleccion_multimedia_id, long, size, estatus, subido_por_id, "createdAt", "updatedAt", slug) FROM stdin;
\.


--
-- TOC entry 3729 (class 0 OID 17522)
-- Dependencies: 295
-- Data for Name: Referimientos; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Referimientos" (id, nombre, referencia, tipo_id, descripcion, localidad, sector, estado_provincia) FROM stdin;
\.


--
-- TOC entry 3723 (class 0 OID 17497)
-- Dependencies: 289
-- Data for Name: Registros_desactivados; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Registros_desactivados" (id, nombre_entidad, id_registro, razon_desactivado, usuario_id, fecha_hora) FROM stdin;
\.


--
-- TOC entry 3716 (class 0 OID 17466)
-- Dependencies: 282
-- Data for Name: Roles; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Roles" (id, nombre, descripcion, activo) FROM stdin;
2	AGENTE	Agente de servicio	t
1	ADMIN	Adminstrador del sistema	t
\.


--
-- TOC entry 3719 (class 0 OID 17480)
-- Dependencies: 285
-- Data for Name: Roles_permisos; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Roles_permisos" (rol_id, permiso_id, "create", read, update, delete) FROM stdin;
\.


--
-- TOC entry 3668 (class 0 OID 17255)
-- Dependencies: 234
-- Data for Name: Seguros; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Seguros" (id, nombre, nombre_corto, siglas, estatus, "createdAt", "updatedAt") FROM stdin;
0	NO ASEGURADO	NO  ARS	NA	t	2023-08-07 21:31:56.296	2023-08-07 21:33:05.048
2	ARS SENASA CONTRIBUTIVO	SEN CONTR	SC	t	2023-08-07 21:33:38.625	2023-08-07 21:33:09.305
1	ARS SENASA SUBSIDIADO	SEN SUBSI	SS	t	2023-08-07 21:33:05.048	2023-08-07 21:33:38.625
\.


--
-- TOC entry 3654 (class 0 OID 17193)
-- Dependencies: 220
-- Data for Name: Servicios; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Servicios" (id, descripcion, nombre_corto, prefijo, grupo_id, es_seleccionable, estatus) FROM stdin;
2	COBRO DE SERVICIO	COBRO	SCS	3	f	t
3	CONSULTA OFTALMOLOGICA	PRIMERA VEZ	CPV	4	t	t
4	CONSULTA REFRACTIVA	REFRACTIVA	CRE	4	t	t
5	CONSULTA DE SEGUIMIENTO	SEGUIMIENTO	CSE	4	t	t
6	CONSULTA POST QUIRURGICO	POST QX	CPX	4	t	t
7	ESTUDIO DE CAMPO VISUAL	CAMPO VISUAL	ECV	5	t	t
8	ESTUDIO DE TOPOGRAFIA CORNEAL	TOPOGRAFIA	ETC	5	t	t
9	ESTUDIO DE MICROSCOPIA ESPECULAR	MICROSCOPIA	EME	5	t	t
10	ESTUDIO DE TOMOGRAFIA OCULAR	TOMOGRAFIA	ETO	5	t	t
11	ESTUDIO DE BIOMETRIA OCULAR	BIOMETRIA	EBO	5	t	t
12	ESTUDIO DE FOTOGRAFIA FONDO DE OJO	CAMARA RETINAL	EFO	5	t	t
13	ESTUDIO DE ECOGRAFIA DUPLEX SCANNER	ECO B	ECB	5	t	t
14	ESTUDIOS MULTIPLES	MULTI	EMU	5	t	t
15	OPTICA ORDEN RECETA INTERNA	ORDEN INTERNA	OOI	6	t	t
16	OPTICA ORDEN RECETA EXTERNA	ORDEN EXTERNA	OOE	6	t	t
17	OPTICA RETIRO DE ORDEN	RETIRO	ORO	6	t	t
18	OPTICA COMPRA DE PRODUCTOS	COMPRAS	OCP	6	t	t
19	OPTICA COMPRA DE MEDICAMENTOS	FARMACIA	OCM	6	t	t
20	PROCEDIMIENTO DE CATARATAS	CX CATARATA	PCX	7	t	t
21	PROCEDIMIENTO DE PTERIGION	CX PTERIGION	PPX	7	t	t
22	PROCEDIMIENTO DE TRABECULECTOMIA	CX TRABEC	PTX	7	t	t
23	PROCEDIMIENTO DE ESTRABISMO	CX ESTRABISMO	PEX	7	t	t
24	CAPSULOTOMIA CON YAG LASER	CAPSULOTOMIA	PCY	7	t	t
25	FOTOCOAGULACION CON LASER	FOTOCOAGULACION	PFC	7	t	t
1	REGISTRO DE EXPEDIENTE	REGISTRO	SRE	3	f	t
\.


--
-- TOC entry 3686 (class 0 OID 17336)
-- Dependencies: 252
-- Data for Name: Servicios_departamentos_sucursales; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Servicios_departamentos_sucursales" (servicio_id, estatus, "departamento_sucursal_refId") FROM stdin;
\.


--
-- TOC entry 3712 (class 0 OID 17447)
-- Dependencies: 278
-- Data for Name: Servicios_dependientes; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Servicios_dependientes" (id, serie_servicios, turno_id) FROM stdin;
\.


--
-- TOC entry 3710 (class 0 OID 17440)
-- Dependencies: 276
-- Data for Name: Servicios_seguros; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Servicios_seguros" (servicio_id, seguro_id, protocolo_id, cobertura, prioridad, estatus) FROM stdin;
\.


--
-- TOC entry 3658 (class 0 OID 17213)
-- Dependencies: 224
-- Data for Name: Servicios_sucursales; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Servicios_sucursales" (servicio_id, sucursal_id, disponible, razon_no_disponible, estatus) FROM stdin;
\.


--
-- TOC entry 3680 (class 0 OID 17306)
-- Dependencies: 246
-- Data for Name: Sucursales; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Sucursales" (id, descripcion, siglas, direccion_id, estatus, "createdAt", "updatedAt") FROM stdin;
1	Suc. El Millon	MILLON	1	t	2023-07-06 21:07:27.347	2023-07-06 21:07:09.258
\.


--
-- TOC entry 3674 (class 0 OID 17280)
-- Dependencies: 240
-- Data for Name: Tipos_agentes; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Tipos_agentes" (id, nombre, nombre_corto, descripcion, estatus) FROM stdin;
1	Administrador	ADMIN	Administra los recursos del sistema	t
2	Registro	Reg	Agentes de registro de nuevos turnos	t
3	Atencion	Aten	Agentes de atencion al paciente	t
4	Servicio	Serv	Agentes de servicio generales	t
\.


--
-- TOC entry 3696 (class 0 OID 17378)
-- Dependencies: 262
-- Data for Name: Tipos_grabaciones; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Tipos_grabaciones" (id, detalle, nombre_corto) FROM stdin;
1	Numeros cardinales	Numbers
2	Servicios Prefijo	Prefix
3	Servicios Descripcion	Services
4	Agentes Nombre	Agent
5	Departamento Descripcion	Area
\.


--
-- TOC entry 3670 (class 0 OID 17264)
-- Dependencies: 236
-- Data for Name: Tipos_identificaciones; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Tipos_identificaciones" (id, nombre, regex_formato, long_minima, long_maxima) FROM stdin;
1	Cedula	###-########-#	11	13
2	RNC	###-#####-#	9	11
3	Pasaporte	*	10	20
\.


--
-- TOC entry 3702 (class 0 OID 17404)
-- Dependencies: 268
-- Data for Name: Tipos_multimedia; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Tipos_multimedia" (id, nombre, siglas, icono, color_hex) FROM stdin;
1	Texto Plano	TXT	document.svg	#3abbff
2	Musica Instrumental	MUS	music.svg	#3fbfdf
3	Imagenes y Poster	IMG	images.svg	#1fffed
4	Videos Sin Audio	VID	videos.svg	#ffbb2a
5	Peliculas	MOV	movie.svg	#cf1bbf
6	Texto Plano	TXT	document.svg	#3abbff
7	Musica Instrumental	MUS	music.svg	#3fbfdf
8	Imagenes y Poster	IMG	images.svg	#1fffed
9	Videos Sin Audio	VID	videos.svg	#ffbb2a
10	Peliculas	MOV	movie.svg	#cf1bbf
\.


--
-- TOC entry 3709 (class 0 OID 17432)
-- Dependencies: 275
-- Data for Name: Tipos_protocolos; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Tipos_protocolos" (id, tipo, descripcion, estatus) FROM stdin;
\.


--
-- TOC entry 3731 (class 0 OID 17529)
-- Dependencies: 297
-- Data for Name: Tipos_referimientos; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Tipos_referimientos" (id, nombre, descripcion) FROM stdin;
1	JORNADA	Jornada Social
2	OPERATIVO	Operativo Empresarial
3	CCJ	Dr. Cruz Jiminian
4	INTERNO	A travez del Centro
5	PACIENTE	A travez de Paciente
6	EMPLEADO	A travez de Empleado
7	REDES	A traves de redes sociales
8	PUBLICIDAD	Por publicidad o volanteo
\.


--
-- TOC entry 3727 (class 0 OID 17515)
-- Dependencies: 293
-- Data for Name: Tipos_visitas; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Tipos_visitas" (id, nombre, descripcion, servicio_destino_id) FROM stdin;
1	CONSULTA	Consulta de Primera Vez	3
2	GLAUCOMA	Sospecha de Glaucoma	10
3	CATARATA	Cirugia de Cataratas	20
4	PTERIGION	Cirugia de Pterigion	21
5	TRABEC	Cirugia de Trabec	22
\.


--
-- TOC entry 3650 (class 0 OID 17176)
-- Dependencies: 216
-- Data for Name: Turnos; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Turnos" (id, secuencia_ticket, servicio_actual_id, servicio_destino_id, estado_turno_id, cola_posicion, cliente_id, sucursal_id, fecha_turno, registrado_por_id, "createdAt") FROM stdin;
\.


--
-- TOC entry 3714 (class 0 OID 17455)
-- Dependencies: 280
-- Data for Name: Usuarios; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Usuarios" (id, nombres, correo, username, password, rol_id, activo, token, "createdAt", "updatedAt") FROM stdin;
2	Juana Abreu	millon@invisrd.com	jabreu	$2b$10$rInMd8roueVz6dGmFYGHPew3Pmt7LgGkGBs7ZykQaGqwJq25x4x96	2	t		2023-07-19 02:11:01.696	2023-07-19 02:11:01.696
3	Marcell Abreu	m.abreu@invisrd.com	mabreu	$2b$10$F1GE1cebBLP3w2hXU.L/peBPTNjtu0MW8BMt8ozpkWo2f./tSq2hC	2	t		2023-07-19 02:12:51.33	2023-07-19 02:12:51.33
4	Sebastian De Jesus	s.dejesus@invisrd.com	sdejesus	$2b$10$OXgGnWrsduzczjjoLsAVdugYmCVBTxDFoke9DoSQSY.FmxoTEWO4u	2	t		2023-07-19 02:13:47.577	2023-07-19 02:13:47.577
1	Jersson Martinez	jronny@invisrd.com	rmartinez	$2b$10$zD4.bTd.biFDA4fprBHfc.iAROwluU/.UU1iiT5pVUBpGlTcsZyFq	1	t	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTAyNDE0NzEsImRhdGEiOnsidHlwZSI6InVzZXIiLCJpZCI6MSwiY29ycmVvIjoianJvbm55QGludmlzcmQuY29tIiwidXNlcm5hbWUiOiJybWFydGluZXoifSwiaWF0IjoxNjkwMTk4MjcxfQ.0rRExc5oNTHTTdK9Kob3SAqRfyTiViiZqGL_44DJTAU	2023-07-06 21:03:38.421	2023-07-24 11:31:12.073
\.


--
-- TOC entry 3725 (class 0 OID 17505)
-- Dependencies: 291
-- Data for Name: Visitas_agendadas; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public."Visitas_agendadas" (id, cliente_id, descripcion, tipo_visita_id, fecha_hora_planificada, sucursal_id, comentario, estatus, registrado_por, "createdAt", "updatedAt") FROM stdin;
\.


--
-- TOC entry 3648 (class 0 OID 17135)
-- Dependencies: 214
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: invis_turnero_app_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
deb4fe11-68f1-478e-8a61-18915ac71f68	e5b049862d17d0b888d4555f59827e9fb3fe14fb3c1d2e69e58e4fe948df1e32	2023-06-30 21:48:41.943842+00	20230519013759_new_init	\N	\N	2023-06-30 21:48:40.789189+00	1
a10037e0-82d6-4ca8-ad31-727d4cccf249	c78d25edbb86568adb0588d685d27d6f8249d5b850ef394dd244e3e165c01fe2	2023-06-30 21:48:42.492905+00	20230519150358_increase_field_size_in_some_table	\N	\N	2023-06-30 21:48:42.099803+00	1
78868677-a558-402f-abcf-84c0f6ab5e38	c177b0a4aaa5e6b03bb4443f84e4e9e354383d97640ad578ab045209967abe72	2023-07-28 17:30:33.693368+00	20230728173032_change_agentes_esperando_by_esperando_servicio_id	\N	\N	2023-07-28 17:30:33.151788+00	1
61101df2-17ac-4b58-9d79-59248f78c0c3	1088c5f426a49961da76b8777c1c2e7487a13f6bb50fadbd95c4bc1ec17c63d5	2023-06-30 21:48:42.99574+00	20230521021432_add_boolean_field_es_seleccionable_to_grupo_servicios	\N	\N	2023-06-30 21:48:42.633605+00	1
545d5557-dddd-42fe-8f3c-cfbd5a5696e3	98ac81dfeb3b6c0f564178a2ca9da3b15e2f3b76e79e61ac9dcf8ae763f96058	2023-06-30 21:48:43.510177+00	20230521231707_increase_field_size_in_servicios_dependientes	\N	\N	2023-06-30 21:48:43.148037+00	1
81158e7a-b879-40ae-b3cb-5474fc52ad5f	d8a82aea8ba84d98eca6a7fff8b6ec6770835a44e104d40ee3064e39cd816cd0	2023-06-30 21:48:44.022406+00	20230525013426_fixing_servicios_departamentos_sucursales_id_foreign_referencies	\N	\N	2023-06-30 21:48:43.649153+00	1
51d0b144-970c-4307-bbaf-b4ca2e3ab8cf	727af35be5526003c0553f9415f19afaa8e32ebd59a583b4b0b0684a23735c3b	2023-08-01 13:54:18.303281+00	20230801135417_change_agentes_esperando_bool_and_atenciones_espera_to_number	\N	\N	2023-08-01 13:54:17.906903+00	1
3a57b2cc-e1ce-490a-a3c0-88c22633f179	05b518dc81d2f5a970f17a436b4a8ed66ea4b596a815625b96af94b9e58502ed	2023-06-30 21:48:44.518278+00	20230525193405_increase_size_of_opciones_flujo_field_nombre_accion	\N	\N	2023-06-30 21:48:44.166041+00	1
c88cc5fc-4fff-428e-ba7d-1a4a6a3ec2b3	68ae136d6aafec35af8c9ca13fd2256e7519d6da9a044fed6b35bf1a61cfb50b	2023-06-30 21:48:45.025917+00	20230530210227_update_pantallas_key_fields	\N	\N	2023-06-30 21:48:44.667748+00	1
8a782e99-5b6e-4926-8991-0a6490d7f514	914a2037392bee1901e88ac9e47dae0f90685799907424abdbbf57abfc92b7ba	2023-06-30 21:48:45.53059+00	20230530210918_fix_pantallas_sucursal_references	\N	\N	2023-06-30 21:48:45.175117+00	1
bab56a09-c574-4a11-9db6-70abee5727c4	c7f5d6d9053d79d8f01807e5ec81e937378be40996ff2596de88ab39bffbfccf	2023-08-04 21:22:08.639615+00	20230804212202_alter_table_servicios_dependientes_manage_dynamic_flow_by_turno_as_json	\N	\N	2023-08-04 21:22:07.813201+00	1
6d8adc4c-7f3a-48df-bfd2-aed1a4bb5ea9	a7d1a34c7cf37597a6e5062e4105898da85b262bc8353cb78101188267b68ecf	2023-06-30 21:48:56.665698+00	20230630214855_set_agentes_new_boolean_llamando_field	\N	\N	2023-06-30 21:48:56.291002+00	1
26748e92-aa96-4b02-8aae-280f59808831	06e7f7c5d647086a52f4ef6b5a459ef0c107c1bb816b8ea2f06cbbc63efc39bf	2023-07-09 16:17:07.537949+00	20230709161706_set_queue_calling_status_and_enum	\N	\N	2023-07-09 16:17:07.158875+00	1
94ae457c-91ac-4d95-a17f-27015921d21f	d949ab86ac9b34badc921dcbc4bafe721ba8de332d6adabe0c179f284b205b8c	2023-07-14 11:27:57.226635+00	20230714112756_update_horarios_lenght_fields	\N	\N	2023-07-14 11:27:56.833144+00	1
6929719c-7cf5-4849-9645-40d6929f1726	386a776e916b7b3b989313d6ceed395bb8431d9fe31de4b54eb692ab2d9a8126	2023-08-08 14:06:31.591661+00	20230808140630_update_turnos_and_atenciones_turnos_servicios_estado_turnos_relationship	\N	\N	2023-08-08 14:06:31.167713+00	1
3d7826e7-0f55-4b1b-9d52-363310663877	16a76bca71d1d426cde72f063110cf9188c9154d4cdbf682337afa425846bfd2	2023-07-28 11:56:23.642104+00	20230728115622_change_agentes_calling_field_to_waiting	\N	\N	2023-07-28 11:56:23.262951+00	1
16f0ec98-d759-4935-ad3e-63262ddb54d3	deef1a80578ef0157ea80007e387908cc54d0f10a4e4b6221061e834751f0d99	2023-08-08 15:57:41.210311+00	20230808155740_add_model_razones_cancelados_and_relations	\N	\N	2023-08-08 15:57:40.639699+00	1
\.


--
-- TOC entry 3781 (class 0 OID 0)
-- Dependencies: 237
-- Name: Agentes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Agentes_id_seq"', 2, true);


--
-- TOC entry 3782 (class 0 OID 0)
-- Dependencies: 231
-- Name: Clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Clientes_id_seq"', 1, false);


--
-- TOC entry 3783 (class 0 OID 0)
-- Dependencies: 269
-- Name: Colecciones_multimedia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Colecciones_multimedia_id_seq"', 14, true);


--
-- TOC entry 3784 (class 0 OID 0)
-- Dependencies: 286
-- Name: Configuraciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Configuraciones_id_seq"', 1, false);


--
-- TOC entry 3785 (class 0 OID 0)
-- Dependencies: 298
-- Name: Contactos_clientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Contactos_clientes_id_seq"', 1, false);


--
-- TOC entry 3786 (class 0 OID 0)
-- Dependencies: 249
-- Name: Departamentos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Departamentos_id_seq"', 1, true);


--
-- TOC entry 3787 (class 0 OID 0)
-- Dependencies: 255
-- Name: Dias_laborales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Dias_laborales_id_seq"', 1, false);


--
-- TOC entry 3788 (class 0 OID 0)
-- Dependencies: 247
-- Name: Direcciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Direcciones_id_seq"', 9, true);


--
-- TOC entry 3789 (class 0 OID 0)
-- Dependencies: 217
-- Name: Estados_turnos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Estados_turnos_id_seq"', 7, true);


--
-- TOC entry 3790 (class 0 OID 0)
-- Dependencies: 243
-- Name: Estilos_pantallas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Estilos_pantallas_id_seq"', 4, true);


--
-- TOC entry 3791 (class 0 OID 0)
-- Dependencies: 259
-- Name: Grabaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Grabaciones_id_seq"', 1, false);


--
-- TOC entry 3792 (class 0 OID 0)
-- Dependencies: 221
-- Name: Grupos_servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Grupos_servicios_id_seq"', 13, true);


--
-- TOC entry 3793 (class 0 OID 0)
-- Dependencies: 257
-- Name: Horarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Horarios_id_seq"', 2, true);


--
-- TOC entry 3794 (class 0 OID 0)
-- Dependencies: 225
-- Name: Opciones_flujo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Opciones_flujo_id_seq"', 1, false);


--
-- TOC entry 3795 (class 0 OID 0)
-- Dependencies: 227
-- Name: Opciones_menu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Opciones_menu_id_seq"', 1, false);


--
-- TOC entry 3796 (class 0 OID 0)
-- Dependencies: 229
-- Name: Opciones_menu_servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Opciones_menu_servicios_id_seq"', 1, false);


--
-- TOC entry 3797 (class 0 OID 0)
-- Dependencies: 241
-- Name: Pantallas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Pantallas_id_seq"', 1, false);


--
-- TOC entry 3798 (class 0 OID 0)
-- Dependencies: 283
-- Name: Permisos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Permisos_id_seq"', 1, true);


--
-- TOC entry 3799 (class 0 OID 0)
-- Dependencies: 272
-- Name: Protocolos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Protocolos_id_seq"', 1, false);


--
-- TOC entry 3800 (class 0 OID 0)
-- Dependencies: 301
-- Name: Razones_Cancelados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Razones_Cancelados_id_seq"', 1, false);


--
-- TOC entry 3801 (class 0 OID 0)
-- Dependencies: 265
-- Name: Recursos_multimedia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Recursos_multimedia_id_seq"', 1, false);


--
-- TOC entry 3802 (class 0 OID 0)
-- Dependencies: 294
-- Name: Referimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Referimientos_id_seq"', 1, false);


--
-- TOC entry 3803 (class 0 OID 0)
-- Dependencies: 288
-- Name: Registros_desactivados_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Registros_desactivados_id_seq"', 1, false);


--
-- TOC entry 3804 (class 0 OID 0)
-- Dependencies: 281
-- Name: Roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Roles_id_seq"', 2, true);


--
-- TOC entry 3805 (class 0 OID 0)
-- Dependencies: 233
-- Name: Seguros_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Seguros_id_seq"', 2, true);


--
-- TOC entry 3806 (class 0 OID 0)
-- Dependencies: 277
-- Name: Servicios_dependientes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Servicios_dependientes_id_seq"', 1, false);


--
-- TOC entry 3807 (class 0 OID 0)
-- Dependencies: 219
-- Name: Servicios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Servicios_id_seq"', 25, true);


--
-- TOC entry 3808 (class 0 OID 0)
-- Dependencies: 245
-- Name: Sucursales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Sucursales_id_seq"', 1, true);


--
-- TOC entry 3809 (class 0 OID 0)
-- Dependencies: 239
-- Name: Tipos_agentes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Tipos_agentes_id_seq"', 4, true);


--
-- TOC entry 3810 (class 0 OID 0)
-- Dependencies: 261
-- Name: Tipos_grabaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Tipos_grabaciones_id_seq"', 10, true);


--
-- TOC entry 3811 (class 0 OID 0)
-- Dependencies: 235
-- Name: Tipos_identificaciones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Tipos_identificaciones_id_seq"', 6, true);


--
-- TOC entry 3812 (class 0 OID 0)
-- Dependencies: 267
-- Name: Tipos_multimedia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Tipos_multimedia_id_seq"', 15, true);


--
-- TOC entry 3813 (class 0 OID 0)
-- Dependencies: 274
-- Name: Tipos_protocolos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Tipos_protocolos_id_seq"', 1, false);


--
-- TOC entry 3814 (class 0 OID 0)
-- Dependencies: 296
-- Name: Tipos_referimientos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Tipos_referimientos_id_seq"', 8, true);


--
-- TOC entry 3815 (class 0 OID 0)
-- Dependencies: 292
-- Name: Tipos_visitas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Tipos_visitas_id_seq"', 5, true);


--
-- TOC entry 3816 (class 0 OID 0)
-- Dependencies: 215
-- Name: Turnos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Turnos_id_seq"', 1, false);


--
-- TOC entry 3817 (class 0 OID 0)
-- Dependencies: 279
-- Name: Usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Usuarios_id_seq"', 4, true);


--
-- TOC entry 3818 (class 0 OID 0)
-- Dependencies: 290
-- Name: Visitas_agendadas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public."Visitas_agendadas_id_seq"', 1, false);


--
-- TOC entry 3819 (class 0 OID 0)
-- Dependencies: 300
-- Name: departamentos_sucursales_refid_seq; Type: SEQUENCE SET; Schema: public; Owner: invis_turnero_app_user
--

SELECT pg_catalog.setval('public.departamentos_sucursales_refid_seq', 1, true);


--
-- TOC entry 3363 (class 2606 OID 17278)
-- Name: Agentes Agentes_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Agentes"
    ADD CONSTRAINT "Agentes_pkey" PRIMARY KEY (id);


--
-- TOC entry 3345 (class 2606 OID 17212)
-- Name: Atenciones_turnos_servicios Atenciones_turnos_servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Atenciones_turnos_servicios"
    ADD CONSTRAINT "Atenciones_turnos_servicios_pkey" PRIMARY KEY (turno_id, agente_id, servicio_id);


--
-- TOC entry 3357 (class 2606 OID 17253)
-- Name: Clientes Clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Clientes"
    ADD CONSTRAINT "Clientes_pkey" PRIMARY KEY (id);


--
-- TOC entry 3406 (class 2606 OID 17422)
-- Name: Colecciones_multimedia_pantallas Colecciones_multimedia_pantallas_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Colecciones_multimedia_pantallas"
    ADD CONSTRAINT "Colecciones_multimedia_pantallas_pkey" PRIMARY KEY (coleccion_multimedia_id, pantalla_id);


--
-- TOC entry 3404 (class 2606 OID 17416)
-- Name: Colecciones_multimedia Colecciones_multimedia_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Colecciones_multimedia"
    ADD CONSTRAINT "Colecciones_multimedia_pkey" PRIMARY KEY (id);


--
-- TOC entry 3428 (class 2606 OID 17495)
-- Name: Configuraciones Configuraciones_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Configuraciones"
    ADD CONSTRAINT "Configuraciones_pkey" PRIMARY KEY (id);


--
-- TOC entry 3440 (class 2606 OID 17541)
-- Name: Contactos_clientes Contactos_clientes_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Contactos_clientes"
    ADD CONSTRAINT "Contactos_clientes_pkey" PRIMARY KEY (id);


--
-- TOC entry 3377 (class 2606 OID 17329)
-- Name: Departamentos Departamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Departamentos"
    ADD CONSTRAINT "Departamentos_pkey" PRIMARY KEY (id);


--
-- TOC entry 3379 (class 2606 OID 17335)
-- Name: Departamentos_sucursales Departamentos_sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Departamentos_sucursales"
    ADD CONSTRAINT "Departamentos_sucursales_pkey" PRIMARY KEY (departamento_id, sucursal_id);


--
-- TOC entry 3388 (class 2606 OID 17360)
-- Name: Dias_laborales Dias_laborales_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Dias_laborales"
    ADD CONSTRAINT "Dias_laborales_pkey" PRIMARY KEY (id);


--
-- TOC entry 3375 (class 2606 OID 17321)
-- Name: Direcciones Direcciones_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Direcciones"
    ADD CONSTRAINT "Direcciones_pkey" PRIMARY KEY (id);


--
-- TOC entry 3339 (class 2606 OID 17191)
-- Name: Estados_turnos Estados_turnos_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Estados_turnos"
    ADD CONSTRAINT "Estados_turnos_pkey" PRIMARY KEY (id);


--
-- TOC entry 3370 (class 2606 OID 17304)
-- Name: Estilos_pantallas Estilos_pantallas_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Estilos_pantallas"
    ADD CONSTRAINT "Estilos_pantallas_pkey" PRIMARY KEY (id);


--
-- TOC entry 3398 (class 2606 OID 17393)
-- Name: Grabaciones_departamentos Grabaciones_departamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grabaciones_departamentos"
    ADD CONSTRAINT "Grabaciones_departamentos_pkey" PRIMARY KEY (departamento_id, grabacion_id);


--
-- TOC entry 3392 (class 2606 OID 17376)
-- Name: Grabaciones Grabaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grabaciones"
    ADD CONSTRAINT "Grabaciones_pkey" PRIMARY KEY (id);


--
-- TOC entry 3396 (class 2606 OID 17388)
-- Name: Grabaciones_servicios Grabaciones_servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grabaciones_servicios"
    ADD CONSTRAINT "Grabaciones_servicios_pkey" PRIMARY KEY (servicio_id, grabacion_id);


--
-- TOC entry 3343 (class 2606 OID 17207)
-- Name: Grupos_servicios Grupos_servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grupos_servicios"
    ADD CONSTRAINT "Grupos_servicios_pkey" PRIMARY KEY (id);


--
-- TOC entry 3386 (class 2606 OID 17352)
-- Name: Horarios_dias_laborables Horarios_dias_laborables_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Horarios_dias_laborables"
    ADD CONSTRAINT "Horarios_dias_laborables_pkey" PRIMARY KEY (horario_id, dia_laborable_id);


--
-- TOC entry 3390 (class 2606 OID 17367)
-- Name: Horarios Horarios_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Horarios"
    ADD CONSTRAINT "Horarios_pkey" PRIMARY KEY (id);


--
-- TOC entry 3384 (class 2606 OID 17347)
-- Name: Horarios_sucursales Horarios_sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Horarios_sucursales"
    ADD CONSTRAINT "Horarios_sucursales_pkey" PRIMARY KEY (horario_dia_laborable_id, sucursal_id);


--
-- TOC entry 3349 (class 2606 OID 17226)
-- Name: Opciones_flujo Opciones_flujo_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Opciones_flujo"
    ADD CONSTRAINT "Opciones_flujo_pkey" PRIMARY KEY (id);


--
-- TOC entry 3351 (class 2606 OID 17234)
-- Name: Opciones_menu Opciones_menu_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Opciones_menu"
    ADD CONSTRAINT "Opciones_menu_pkey" PRIMARY KEY (id);


--
-- TOC entry 3354 (class 2606 OID 17241)
-- Name: Opciones_menu_servicios Opciones_menu_servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Opciones_menu_servicios"
    ADD CONSTRAINT "Opciones_menu_servicios_pkey" PRIMARY KEY (estado_turno_id, grupo_servicio_id);


--
-- TOC entry 3368 (class 2606 OID 17295)
-- Name: Pantallas Pantallas_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Pantallas"
    ADD CONSTRAINT "Pantallas_pkey" PRIMARY KEY (id);


--
-- TOC entry 3424 (class 2606 OID 17479)
-- Name: Permisos Permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Permisos"
    ADD CONSTRAINT "Permisos_pkey" PRIMARY KEY (id);


--
-- TOC entry 3408 (class 2606 OID 17430)
-- Name: Protocolos Protocolos_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Protocolos"
    ADD CONSTRAINT "Protocolos_pkey" PRIMARY KEY (id);


--
-- TOC entry 3442 (class 2606 OID 50870)
-- Name: Razones_Cancelados Razones_Cancelados_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Razones_Cancelados"
    ADD CONSTRAINT "Razones_Cancelados_pkey" PRIMARY KEY (id);


--
-- TOC entry 3400 (class 2606 OID 17402)
-- Name: Recursos_multimedia Recursos_multimedia_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Recursos_multimedia"
    ADD CONSTRAINT "Recursos_multimedia_pkey" PRIMARY KEY (id);


--
-- TOC entry 3436 (class 2606 OID 17527)
-- Name: Referimientos Referimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Referimientos"
    ADD CONSTRAINT "Referimientos_pkey" PRIMARY KEY (id);


--
-- TOC entry 3430 (class 2606 OID 17503)
-- Name: Registros_desactivados Registros_desactivados_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Registros_desactivados"
    ADD CONSTRAINT "Registros_desactivados_pkey" PRIMARY KEY (id);


--
-- TOC entry 3426 (class 2606 OID 17488)
-- Name: Roles_permisos Roles_permisos_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Roles_permisos"
    ADD CONSTRAINT "Roles_permisos_pkey" PRIMARY KEY (rol_id, permiso_id);


--
-- TOC entry 3422 (class 2606 OID 17472)
-- Name: Roles Roles_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY (id);


--
-- TOC entry 3359 (class 2606 OID 17262)
-- Name: Seguros Seguros_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Seguros"
    ADD CONSTRAINT "Seguros_pkey" PRIMARY KEY (id);


--
-- TOC entry 3382 (class 2606 OID 17866)
-- Name: Servicios_departamentos_sucursales Servicios_departamentos_sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_departamentos_sucursales"
    ADD CONSTRAINT "Servicios_departamentos_sucursales_pkey" PRIMARY KEY (servicio_id, "departamento_sucursal_refId");


--
-- TOC entry 3414 (class 2606 OID 17453)
-- Name: Servicios_dependientes Servicios_dependientes_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_dependientes"
    ADD CONSTRAINT "Servicios_dependientes_pkey" PRIMARY KEY (id);


--
-- TOC entry 3341 (class 2606 OID 17200)
-- Name: Servicios Servicios_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios"
    ADD CONSTRAINT "Servicios_pkey" PRIMARY KEY (id);


--
-- TOC entry 3412 (class 2606 OID 17445)
-- Name: Servicios_seguros Servicios_seguros_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_seguros"
    ADD CONSTRAINT "Servicios_seguros_pkey" PRIMARY KEY (servicio_id, seguro_id, protocolo_id);


--
-- TOC entry 3347 (class 2606 OID 17219)
-- Name: Servicios_sucursales Servicios_sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_sucursales"
    ADD CONSTRAINT "Servicios_sucursales_pkey" PRIMARY KEY (servicio_id, sucursal_id);


--
-- TOC entry 3373 (class 2606 OID 17313)
-- Name: Sucursales Sucursales_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Sucursales"
    ADD CONSTRAINT "Sucursales_pkey" PRIMARY KEY (id);


--
-- TOC entry 3366 (class 2606 OID 17286)
-- Name: Tipos_agentes Tipos_agentes_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_agentes"
    ADD CONSTRAINT "Tipos_agentes_pkey" PRIMARY KEY (id);


--
-- TOC entry 3394 (class 2606 OID 17383)
-- Name: Tipos_grabaciones Tipos_grabaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_grabaciones"
    ADD CONSTRAINT "Tipos_grabaciones_pkey" PRIMARY KEY (id);


--
-- TOC entry 3361 (class 2606 OID 17269)
-- Name: Tipos_identificaciones Tipos_identificaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_identificaciones"
    ADD CONSTRAINT "Tipos_identificaciones_pkey" PRIMARY KEY (id);


--
-- TOC entry 3402 (class 2606 OID 17409)
-- Name: Tipos_multimedia Tipos_multimedia_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_multimedia"
    ADD CONSTRAINT "Tipos_multimedia_pkey" PRIMARY KEY (id);


--
-- TOC entry 3410 (class 2606 OID 17439)
-- Name: Tipos_protocolos Tipos_protocolos_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_protocolos"
    ADD CONSTRAINT "Tipos_protocolos_pkey" PRIMARY KEY (id);


--
-- TOC entry 3438 (class 2606 OID 17534)
-- Name: Tipos_referimientos Tipos_referimientos_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_referimientos"
    ADD CONSTRAINT "Tipos_referimientos_pkey" PRIMARY KEY (id);


--
-- TOC entry 3434 (class 2606 OID 17520)
-- Name: Tipos_visitas Tipos_visitas_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_visitas"
    ADD CONSTRAINT "Tipos_visitas_pkey" PRIMARY KEY (id);


--
-- TOC entry 3337 (class 2606 OID 17183)
-- Name: Turnos Turnos_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Turnos"
    ADD CONSTRAINT "Turnos_pkey" PRIMARY KEY (id);


--
-- TOC entry 3418 (class 2606 OID 17464)
-- Name: Usuarios Usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_pkey" PRIMARY KEY (id);


--
-- TOC entry 3432 (class 2606 OID 17513)
-- Name: Visitas_agendadas Visitas_agendadas_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Visitas_agendadas"
    ADD CONSTRAINT "Visitas_agendadas_pkey" PRIMARY KEY (id);


--
-- TOC entry 3335 (class 2606 OID 17143)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3364 (class 1259 OID 17544)
-- Name: Agentes_usuario_id_key; Type: INDEX; Schema: public; Owner: invis_turnero_app_user
--

CREATE UNIQUE INDEX "Agentes_usuario_id_key" ON public."Agentes" USING btree (usuario_id);


--
-- TOC entry 3355 (class 1259 OID 17543)
-- Name: Clientes_identificacion_key; Type: INDEX; Schema: public; Owner: invis_turnero_app_user
--

CREATE UNIQUE INDEX "Clientes_identificacion_key" ON public."Clientes" USING btree (identificacion);


--
-- TOC entry 3380 (class 1259 OID 17546)
-- Name: Departamentos_sucursales_refId_key; Type: INDEX; Schema: public; Owner: invis_turnero_app_user
--

CREATE UNIQUE INDEX "Departamentos_sucursales_refId_key" ON public."Departamentos_sucursales" USING btree ("refId");


--
-- TOC entry 3352 (class 1259 OID 17542)
-- Name: Opciones_menu_servicios_id_key; Type: INDEX; Schema: public; Owner: invis_turnero_app_user
--

CREATE UNIQUE INDEX "Opciones_menu_servicios_id_key" ON public."Opciones_menu_servicios" USING btree (id);


--
-- TOC entry 3420 (class 1259 OID 17863)
-- Name: Roles_nombre_key; Type: INDEX; Schema: public; Owner: invis_turnero_app_user
--

CREATE UNIQUE INDEX "Roles_nombre_key" ON public."Roles" USING btree (nombre);


--
-- TOC entry 3371 (class 1259 OID 17545)
-- Name: Sucursales_direccion_id_key; Type: INDEX; Schema: public; Owner: invis_turnero_app_user
--

CREATE UNIQUE INDEX "Sucursales_direccion_id_key" ON public."Sucursales" USING btree (direccion_id);


--
-- TOC entry 3415 (class 1259 OID 17548)
-- Name: Usuarios_correo_key; Type: INDEX; Schema: public; Owner: invis_turnero_app_user
--

CREATE UNIQUE INDEX "Usuarios_correo_key" ON public."Usuarios" USING btree (correo);


--
-- TOC entry 3416 (class 1259 OID 17547)
-- Name: Usuarios_nombres_key; Type: INDEX; Schema: public; Owner: invis_turnero_app_user
--

CREATE UNIQUE INDEX "Usuarios_nombres_key" ON public."Usuarios" USING btree (nombres);


--
-- TOC entry 3419 (class 1259 OID 17549)
-- Name: Usuarios_username_key; Type: INDEX; Schema: public; Owner: invis_turnero_app_user
--

CREATE UNIQUE INDEX "Usuarios_username_key" ON public."Usuarios" USING btree (username);


--
-- TOC entry 3463 (class 2606 OID 17651)
-- Name: Agentes Agentes_departamento_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Agentes"
    ADD CONSTRAINT "Agentes_departamento_sucursal_id_fkey" FOREIGN KEY (departamento_sucursal_id) REFERENCES public."Departamentos_sucursales"("refId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3464 (class 2606 OID 17641)
-- Name: Agentes Agentes_grupo_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Agentes"
    ADD CONSTRAINT "Agentes_grupo_servicio_id_fkey" FOREIGN KEY (grupo_servicio_id) REFERENCES public."Grupos_servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3465 (class 2606 OID 17646)
-- Name: Agentes Agentes_tipo_agente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Agentes"
    ADD CONSTRAINT "Agentes_tipo_agente_id_fkey" FOREIGN KEY (tipo_agente_id) REFERENCES public."Tipos_agentes"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3466 (class 2606 OID 17656)
-- Name: Agentes Agentes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Agentes"
    ADD CONSTRAINT "Agentes_usuario_id_fkey" FOREIGN KEY (usuario_id) REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3449 (class 2606 OID 17586)
-- Name: Atenciones_turnos_servicios Atenciones_turnos_servicios_agente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Atenciones_turnos_servicios"
    ADD CONSTRAINT "Atenciones_turnos_servicios_agente_id_fkey" FOREIGN KEY (agente_id) REFERENCES public."Agentes"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3450 (class 2606 OID 47787)
-- Name: Atenciones_turnos_servicios Atenciones_turnos_servicios_estado_turno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Atenciones_turnos_servicios"
    ADD CONSTRAINT "Atenciones_turnos_servicios_estado_turno_id_fkey" FOREIGN KEY (estado_turno_id) REFERENCES public."Estados_turnos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3451 (class 2606 OID 50871)
-- Name: Atenciones_turnos_servicios Atenciones_turnos_servicios_razon_cancelado_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Atenciones_turnos_servicios"
    ADD CONSTRAINT "Atenciones_turnos_servicios_razon_cancelado_id_fkey" FOREIGN KEY (razon_cancelado_id) REFERENCES public."Razones_Cancelados"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3452 (class 2606 OID 17591)
-- Name: Atenciones_turnos_servicios Atenciones_turnos_servicios_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Atenciones_turnos_servicios"
    ADD CONSTRAINT "Atenciones_turnos_servicios_servicio_id_fkey" FOREIGN KEY (servicio_id) REFERENCES public."Servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3453 (class 2606 OID 17581)
-- Name: Atenciones_turnos_servicios Atenciones_turnos_servicios_turno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Atenciones_turnos_servicios"
    ADD CONSTRAINT "Atenciones_turnos_servicios_turno_id_fkey" FOREIGN KEY (turno_id) REFERENCES public."Turnos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3460 (class 2606 OID 17636)
-- Name: Clientes Clientes_registrado_por_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Clientes"
    ADD CONSTRAINT "Clientes_registrado_por_id_fkey" FOREIGN KEY (registrado_por_id) REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3461 (class 2606 OID 17631)
-- Name: Clientes Clientes_seguro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Clientes"
    ADD CONSTRAINT "Clientes_seguro_id_fkey" FOREIGN KEY (seguro_id) REFERENCES public."Seguros"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3462 (class 2606 OID 17626)
-- Name: Clientes Clientes_tipo_identificacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Clientes"
    ADD CONSTRAINT "Clientes_tipo_identificacion_id_fkey" FOREIGN KEY (tipo_identificacion_id) REFERENCES public."Tipos_identificaciones"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3486 (class 2606 OID 17756)
-- Name: Colecciones_multimedia_pantallas Colecciones_multimedia_pantallas_coleccion_multimedia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Colecciones_multimedia_pantallas"
    ADD CONSTRAINT "Colecciones_multimedia_pantallas_coleccion_multimedia_id_fkey" FOREIGN KEY (coleccion_multimedia_id) REFERENCES public."Colecciones_multimedia"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3487 (class 2606 OID 17761)
-- Name: Colecciones_multimedia_pantallas Colecciones_multimedia_pantallas_pantalla_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Colecciones_multimedia_pantallas"
    ADD CONSTRAINT "Colecciones_multimedia_pantallas_pantalla_id_fkey" FOREIGN KEY (pantalla_id) REFERENCES public."Pantallas"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3496 (class 2606 OID 17811)
-- Name: Configuraciones Configuraciones_modificado_por_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Configuraciones"
    ADD CONSTRAINT "Configuraciones_modificado_por_id_fkey" FOREIGN KEY (modificado_por_id) REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3503 (class 2606 OID 17846)
-- Name: Contactos_clientes Contactos_clientes_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Contactos_clientes"
    ADD CONSTRAINT "Contactos_clientes_cliente_id_fkey" FOREIGN KEY (cliente_id) REFERENCES public."Clientes"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3504 (class 2606 OID 17856)
-- Name: Contactos_clientes Contactos_clientes_direccion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Contactos_clientes"
    ADD CONSTRAINT "Contactos_clientes_direccion_id_fkey" FOREIGN KEY (direccion_id) REFERENCES public."Direcciones"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3505 (class 2606 OID 17851)
-- Name: Contactos_clientes Contactos_clientes_referido_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Contactos_clientes"
    ADD CONSTRAINT "Contactos_clientes_referido_id_fkey" FOREIGN KEY (referido_id) REFERENCES public."Referimientos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3470 (class 2606 OID 17676)
-- Name: Departamentos_sucursales Departamentos_sucursales_departamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Departamentos_sucursales"
    ADD CONSTRAINT "Departamentos_sucursales_departamento_id_fkey" FOREIGN KEY (departamento_id) REFERENCES public."Departamentos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3471 (class 2606 OID 17681)
-- Name: Departamentos_sucursales Departamentos_sucursales_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Departamentos_sucursales"
    ADD CONSTRAINT "Departamentos_sucursales_sucursal_id_fkey" FOREIGN KEY (sucursal_id) REFERENCES public."Sucursales"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3481 (class 2606 OID 17731)
-- Name: Grabaciones_departamentos Grabaciones_departamentos_departamento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grabaciones_departamentos"
    ADD CONSTRAINT "Grabaciones_departamentos_departamento_id_fkey" FOREIGN KEY (departamento_id) REFERENCES public."Departamentos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3482 (class 2606 OID 17736)
-- Name: Grabaciones_departamentos Grabaciones_departamentos_grabacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grabaciones_departamentos"
    ADD CONSTRAINT "Grabaciones_departamentos_grabacion_id_fkey" FOREIGN KEY (grabacion_id) REFERENCES public."Grabaciones"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3479 (class 2606 OID 17726)
-- Name: Grabaciones_servicios Grabaciones_servicios_grabacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grabaciones_servicios"
    ADD CONSTRAINT "Grabaciones_servicios_grabacion_id_fkey" FOREIGN KEY (grabacion_id) REFERENCES public."Grabaciones"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3480 (class 2606 OID 17721)
-- Name: Grabaciones_servicios Grabaciones_servicios_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grabaciones_servicios"
    ADD CONSTRAINT "Grabaciones_servicios_servicio_id_fkey" FOREIGN KEY (servicio_id) REFERENCES public."Servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3478 (class 2606 OID 17716)
-- Name: Grabaciones Grabaciones_tipo_grabacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Grabaciones"
    ADD CONSTRAINT "Grabaciones_tipo_grabacion_id_fkey" FOREIGN KEY (tipo_grabacion_id) REFERENCES public."Tipos_grabaciones"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3476 (class 2606 OID 17711)
-- Name: Horarios_dias_laborables Horarios_dias_laborables_dia_laborable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Horarios_dias_laborables"
    ADD CONSTRAINT "Horarios_dias_laborables_dia_laborable_id_fkey" FOREIGN KEY (dia_laborable_id) REFERENCES public."Dias_laborales"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3477 (class 2606 OID 17706)
-- Name: Horarios_dias_laborables Horarios_dias_laborables_horario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Horarios_dias_laborables"
    ADD CONSTRAINT "Horarios_dias_laborables_horario_id_fkey" FOREIGN KEY (horario_id) REFERENCES public."Horarios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3474 (class 2606 OID 17696)
-- Name: Horarios_sucursales Horarios_sucursales_horario_dia_laborable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Horarios_sucursales"
    ADD CONSTRAINT "Horarios_sucursales_horario_dia_laborable_id_fkey" FOREIGN KEY (horario_dia_laborable_id) REFERENCES public."Horarios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3475 (class 2606 OID 17701)
-- Name: Horarios_sucursales Horarios_sucursales_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Horarios_sucursales"
    ADD CONSTRAINT "Horarios_sucursales_sucursal_id_fkey" FOREIGN KEY (sucursal_id) REFERENCES public."Sucursales"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3456 (class 2606 OID 17611)
-- Name: Opciones_menu Opciones_menu_opcion_menu_servicios_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Opciones_menu"
    ADD CONSTRAINT "Opciones_menu_opcion_menu_servicios_id_fkey" FOREIGN KEY (opcion_menu_servicios_id) REFERENCES public."Opciones_menu_servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3457 (class 2606 OID 17606)
-- Name: Opciones_menu Opciones_menu_opciones_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Opciones_menu"
    ADD CONSTRAINT "Opciones_menu_opciones_id_fkey" FOREIGN KEY (opciones_id) REFERENCES public."Opciones_flujo"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3458 (class 2606 OID 17616)
-- Name: Opciones_menu_servicios Opciones_menu_servicios_estado_turno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Opciones_menu_servicios"
    ADD CONSTRAINT "Opciones_menu_servicios_estado_turno_id_fkey" FOREIGN KEY (estado_turno_id) REFERENCES public."Estados_turnos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3459 (class 2606 OID 17621)
-- Name: Opciones_menu_servicios Opciones_menu_servicios_grupo_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Opciones_menu_servicios"
    ADD CONSTRAINT "Opciones_menu_servicios_grupo_servicio_id_fkey" FOREIGN KEY (grupo_servicio_id) REFERENCES public."Grupos_servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3467 (class 2606 OID 17661)
-- Name: Pantallas Pantallas_estilo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Pantallas"
    ADD CONSTRAINT "Pantallas_estilo_id_fkey" FOREIGN KEY (estilo_id) REFERENCES public."Estilos_pantallas"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3468 (class 2606 OID 17874)
-- Name: Pantallas Pantallas_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Pantallas"
    ADD CONSTRAINT "Pantallas_sucursal_id_fkey" FOREIGN KEY (sucursal_id) REFERENCES public."Sucursales"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3488 (class 2606 OID 17766)
-- Name: Protocolos Protocolos_tipo_protocolo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Protocolos"
    ADD CONSTRAINT "Protocolos_tipo_protocolo_id_fkey" FOREIGN KEY (tipo_protocolo_id) REFERENCES public."Tipos_protocolos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3483 (class 2606 OID 17746)
-- Name: Recursos_multimedia Recursos_multimedia_coleccion_multimedia_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Recursos_multimedia"
    ADD CONSTRAINT "Recursos_multimedia_coleccion_multimedia_id_fkey" FOREIGN KEY (coleccion_multimedia_id) REFERENCES public."Colecciones_multimedia"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3484 (class 2606 OID 17751)
-- Name: Recursos_multimedia Recursos_multimedia_subido_por_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Recursos_multimedia"
    ADD CONSTRAINT "Recursos_multimedia_subido_por_id_fkey" FOREIGN KEY (subido_por_id) REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3485 (class 2606 OID 17741)
-- Name: Recursos_multimedia Recursos_multimedia_tipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Recursos_multimedia"
    ADD CONSTRAINT "Recursos_multimedia_tipo_id_fkey" FOREIGN KEY (tipo_id) REFERENCES public."Tipos_multimedia"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3502 (class 2606 OID 17841)
-- Name: Referimientos Referimientos_tipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Referimientos"
    ADD CONSTRAINT "Referimientos_tipo_id_fkey" FOREIGN KEY (tipo_id) REFERENCES public."Tipos_referimientos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3497 (class 2606 OID 17816)
-- Name: Registros_desactivados Registros_desactivados_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Registros_desactivados"
    ADD CONSTRAINT "Registros_desactivados_usuario_id_fkey" FOREIGN KEY (usuario_id) REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3494 (class 2606 OID 17806)
-- Name: Roles_permisos Roles_permisos_permiso_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Roles_permisos"
    ADD CONSTRAINT "Roles_permisos_permiso_id_fkey" FOREIGN KEY (permiso_id) REFERENCES public."Permisos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3495 (class 2606 OID 17801)
-- Name: Roles_permisos Roles_permisos_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Roles_permisos"
    ADD CONSTRAINT "Roles_permisos_rol_id_fkey" FOREIGN KEY (rol_id) REFERENCES public."Roles"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3472 (class 2606 OID 17867)
-- Name: Servicios_departamentos_sucursales Servicios_departamentos_sucursales_departamento_sucursal_r_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_departamentos_sucursales"
    ADD CONSTRAINT "Servicios_departamentos_sucursales_departamento_sucursal_r_fkey" FOREIGN KEY ("departamento_sucursal_refId") REFERENCES public."Departamentos_sucursales"("refId") ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3473 (class 2606 OID 17686)
-- Name: Servicios_departamentos_sucursales Servicios_departamentos_sucursales_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_departamentos_sucursales"
    ADD CONSTRAINT "Servicios_departamentos_sucursales_servicio_id_fkey" FOREIGN KEY (servicio_id) REFERENCES public."Servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3492 (class 2606 OID 41736)
-- Name: Servicios_dependientes Servicios_dependientes_turno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_dependientes"
    ADD CONSTRAINT "Servicios_dependientes_turno_id_fkey" FOREIGN KEY (turno_id) REFERENCES public."Turnos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3448 (class 2606 OID 17576)
-- Name: Servicios Servicios_grupo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios"
    ADD CONSTRAINT "Servicios_grupo_id_fkey" FOREIGN KEY (grupo_id) REFERENCES public."Grupos_servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3489 (class 2606 OID 17781)
-- Name: Servicios_seguros Servicios_seguros_protocolo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_seguros"
    ADD CONSTRAINT "Servicios_seguros_protocolo_id_fkey" FOREIGN KEY (protocolo_id) REFERENCES public."Protocolos"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3490 (class 2606 OID 17776)
-- Name: Servicios_seguros Servicios_seguros_seguro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_seguros"
    ADD CONSTRAINT "Servicios_seguros_seguro_id_fkey" FOREIGN KEY (seguro_id) REFERENCES public."Seguros"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3491 (class 2606 OID 17771)
-- Name: Servicios_seguros Servicios_seguros_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_seguros"
    ADD CONSTRAINT "Servicios_seguros_servicio_id_fkey" FOREIGN KEY (servicio_id) REFERENCES public."Servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3454 (class 2606 OID 17596)
-- Name: Servicios_sucursales Servicios_sucursales_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_sucursales"
    ADD CONSTRAINT "Servicios_sucursales_servicio_id_fkey" FOREIGN KEY (servicio_id) REFERENCES public."Servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3455 (class 2606 OID 17601)
-- Name: Servicios_sucursales Servicios_sucursales_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Servicios_sucursales"
    ADD CONSTRAINT "Servicios_sucursales_sucursal_id_fkey" FOREIGN KEY (sucursal_id) REFERENCES public."Sucursales"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3469 (class 2606 OID 17671)
-- Name: Sucursales Sucursales_direccion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Sucursales"
    ADD CONSTRAINT "Sucursales_direccion_id_fkey" FOREIGN KEY (direccion_id) REFERENCES public."Direcciones"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3501 (class 2606 OID 17836)
-- Name: Tipos_visitas Tipos_visitas_servicio_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Tipos_visitas"
    ADD CONSTRAINT "Tipos_visitas_servicio_destino_id_fkey" FOREIGN KEY (servicio_destino_id) REFERENCES public."Servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3443 (class 2606 OID 17561)
-- Name: Turnos Turnos_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Turnos"
    ADD CONSTRAINT "Turnos_cliente_id_fkey" FOREIGN KEY (cliente_id) REFERENCES public."Clientes"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3444 (class 2606 OID 47782)
-- Name: Turnos Turnos_estado_turno_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Turnos"
    ADD CONSTRAINT "Turnos_estado_turno_id_fkey" FOREIGN KEY (estado_turno_id) REFERENCES public."Estados_turnos"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 3445 (class 2606 OID 17571)
-- Name: Turnos Turnos_registrado_por_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Turnos"
    ADD CONSTRAINT "Turnos_registrado_por_id_fkey" FOREIGN KEY (registrado_por_id) REFERENCES public."Usuarios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3446 (class 2606 OID 17551)
-- Name: Turnos Turnos_servicio_destino_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Turnos"
    ADD CONSTRAINT "Turnos_servicio_destino_id_fkey" FOREIGN KEY (servicio_destino_id) REFERENCES public."Servicios"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3447 (class 2606 OID 17566)
-- Name: Turnos Turnos_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Turnos"
    ADD CONSTRAINT "Turnos_sucursal_id_fkey" FOREIGN KEY (sucursal_id) REFERENCES public."Sucursales"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3493 (class 2606 OID 17796)
-- Name: Usuarios Usuarios_rol_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Usuarios"
    ADD CONSTRAINT "Usuarios_rol_id_fkey" FOREIGN KEY (rol_id) REFERENCES public."Roles"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3498 (class 2606 OID 17821)
-- Name: Visitas_agendadas Visitas_agendadas_cliente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Visitas_agendadas"
    ADD CONSTRAINT "Visitas_agendadas_cliente_id_fkey" FOREIGN KEY (cliente_id) REFERENCES public."Clientes"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3499 (class 2606 OID 17831)
-- Name: Visitas_agendadas Visitas_agendadas_sucursal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Visitas_agendadas"
    ADD CONSTRAINT "Visitas_agendadas_sucursal_id_fkey" FOREIGN KEY (sucursal_id) REFERENCES public."Sucursales"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3500 (class 2606 OID 17826)
-- Name: Visitas_agendadas Visitas_agendadas_tipo_visita_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: invis_turnero_app_user
--

ALTER TABLE ONLY public."Visitas_agendadas"
    ADD CONSTRAINT "Visitas_agendadas_tipo_visita_id_fkey" FOREIGN KEY (tipo_visita_id) REFERENCES public."Tipos_visitas"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 2282 (class 826 OID 16391)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON SEQUENCES  TO invis_turnero_app_user;


--
-- TOC entry 2284 (class 826 OID 16393)
-- Name: DEFAULT PRIVILEGES FOR TYPES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TYPES  TO invis_turnero_app_user;


--
-- TOC entry 2283 (class 826 OID 16392)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON FUNCTIONS  TO invis_turnero_app_user;


--
-- TOC entry 2281 (class 826 OID 16390)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: -; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres GRANT ALL ON TABLES  TO invis_turnero_app_user;


-- Completed on 2023-08-08 22:02:23

--
-- PostgreSQL database dump complete
--

