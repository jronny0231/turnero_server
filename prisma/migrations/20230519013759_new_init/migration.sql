-- CreateEnum
CREATE TYPE "Tipado_protocolos" AS ENUM ('ARS', 'SERVICIO', 'DEFAULT');

-- CreateEnum
CREATE TYPE "Tipado_estados_turnos" AS ENUM ('NUEVA_SESION', 'ESPERANDO', 'ATENDIENDO', 'EN_ESPERA', 'DESCANSANDO', 'CANCELADO', 'TERMINADO');

-- CreateEnum
CREATE TYPE "Tipado_marcas_tv" AS ENUM ('ROKU_TV', 'SAMSUNG_TV', 'DEFAULT');

-- CreateTable
CREATE TABLE "Turnos" (
    "id" SERIAL NOT NULL,
    "secuencia_ticket" VARCHAR(5) NOT NULL,
    "servicio_actual_id" INTEGER NOT NULL,
    "servicio_destino_id" INTEGER NOT NULL,
    "estado_turno_id" INTEGER NOT NULL,
    "cola_posicion" INTEGER NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "fecha_turno" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registrado_por_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estados_turnos" (
    "id" SERIAL NOT NULL,
    "descripcion" "Tipado_estados_turnos" NOT NULL DEFAULT 'NUEVA_SESION',
    "siglas" VARCHAR(5) NOT NULL,
    "color_hex" VARCHAR(7) NOT NULL,

    CONSTRAINT "Estados_turnos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicios" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,
    "nombre_corto" VARCHAR(20) NOT NULL,
    "prefijo" VARCHAR(3) NOT NULL,
    "grupo_id" INTEGER NOT NULL,
    "es_seleccionable" BOOLEAN DEFAULT true,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grupos_servicios" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(25) NOT NULL,
    "color_hex" VARCHAR(7) NOT NULL,

    CONSTRAINT "Grupos_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Atenciones_turnos_servicios" (
    "turno_id" INTEGER NOT NULL,
    "agente_id" INTEGER NOT NULL,
    "servicio_id" INTEGER NOT NULL,
    "hora_inicio" TIME(0),
    "hora_fin" TIME(0),
    "tiempo_espera" TIME(0),

    CONSTRAINT "Atenciones_turnos_servicios_pkey" PRIMARY KEY ("turno_id","agente_id","servicio_id")
);

-- CreateTable
CREATE TABLE "Servicios_sucursales" (
    "servicio_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "disponible" BOOLEAN DEFAULT true,
    "razon_no_disponible" VARCHAR(40) NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Servicios_sucursales_pkey" PRIMARY KEY ("servicio_id","sucursal_id")
);

-- CreateTable
CREATE TABLE "Opciones_flujo" (
    "id" SERIAL NOT NULL,
    "nombre_boton" VARCHAR(10) NOT NULL,
    "funcion_accion" VARCHAR(50) NOT NULL,
    "color_hex" VARCHAR(7) NOT NULL,

    CONSTRAINT "Opciones_flujo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opciones_menu" (
    "id" SERIAL NOT NULL,
    "opciones_id" INTEGER NOT NULL,
    "opcion_menu_servicios_id" INTEGER NOT NULL,
    "es_principal" BOOLEAN DEFAULT true,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "Opciones_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Opciones_menu_servicios" (
    "id" SERIAL NOT NULL,
    "estado_turno_id" INTEGER NOT NULL,
    "grupo_servicio_id" INTEGER NOT NULL,

    CONSTRAINT "Opciones_menu_servicios_pkey" PRIMARY KEY ("estado_turno_id","grupo_servicio_id")
);

-- CreateTable
CREATE TABLE "Clientes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(20) DEFAULT 'sin definir',
    "apellidos" VARCHAR(30) DEFAULT 'sin definir',
    "tipo_identificacion_id" INTEGER NOT NULL,
    "identificacion" VARCHAR(20) NOT NULL,
    "seguro_id" INTEGER DEFAULT 0,
    "nombre_tutorado" VARCHAR(40),
    "fecha_ultima_visita" DATE,
    "estatus" BOOLEAN DEFAULT true,
    "registrado_por_id" INTEGER NOT NULL,
    "modificado_por_id" INTEGER,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seguros" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "nombre_corto" VARCHAR(10) NOT NULL,
    "siglas" VARCHAR(3) NOT NULL,
    "estatus" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Seguros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipos_identificaciones" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(12) NOT NULL,
    "regex_formato" VARCHAR(20) NOT NULL,
    "long_minima" INTEGER NOT NULL,
    "long_maxima" INTEGER NOT NULL,

    CONSTRAINT "Tipos_identificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agentes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,
    "grupo_servicio_id" INTEGER NOT NULL,
    "tipo_agente_id" INTEGER NOT NULL,
    "departamento_sucursal_id" INTEGER NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Agentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipos_agentes" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(25) NOT NULL,
    "nombre_corto" VARCHAR(5) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Tipos_agentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pantallas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(20) NOT NULL,
    "detalle" VARCHAR(50) NOT NULL,
    "estilo_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "direccion_mac" VARCHAR(17) NOT NULL,
    "direccion_ip" VARCHAR(15) NOT NULL,
    "estatus" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Pantallas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estilos_pantallas" (
    "id" SERIAL NOT NULL,
    "detalle" VARCHAR(20) NOT NULL,
    "siglas" VARCHAR(5) NOT NULL,
    "tv_brand" "Tipado_marcas_tv" DEFAULT 'DEFAULT',
    "filepath" VARCHAR(30) NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Estilos_pantallas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sucursales" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(20) NOT NULL,
    "siglas" VARCHAR(5) NOT NULL,
    "direccion_id" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Sucursales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Direcciones" (
    "id" SERIAL NOT NULL,
    "calle" VARCHAR(50) NOT NULL,
    "numero" INTEGER NOT NULL,
    "piso" INTEGER NOT NULL,
    "sector" VARCHAR(50) NOT NULL,
    "estado_provincia" VARCHAR(30) NOT NULL,
    "latitud_decimal" VARCHAR(20) NOT NULL,
    "longitud_decimal" VARCHAR(20) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamentos" (
    "id" SERIAL NOT NULL,
    "descripcion" VARCHAR(20) NOT NULL,
    "siglas" VARCHAR(5) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamentos_sucursales" (
    "refId" OID NOT NULL,
    "departamento_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Departamentos_sucursales_pkey" PRIMARY KEY ("departamento_id","sucursal_id")
);

-- CreateTable
CREATE TABLE "Servicios_departamentos_sucursales" (
    "servicio_id" INTEGER NOT NULL,
    "departamento_sucursal_id" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Servicios_departamentos_sucursales_pkey" PRIMARY KEY ("servicio_id","departamento_sucursal_id")
);

-- CreateTable
CREATE TABLE "Horarios_sucursales" (
    "horario_dia_laborable_id" INTEGER NOT NULL,
    "sucursal_id" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Horarios_sucursales_pkey" PRIMARY KEY ("horario_dia_laborable_id","sucursal_id")
);

-- CreateTable
CREATE TABLE "Horarios_dias_laborables" (
    "horario_id" INTEGER NOT NULL,
    "dia_laborable_id" INTEGER NOT NULL,

    CONSTRAINT "Horarios_dias_laborables_pkey" PRIMARY KEY ("horario_id","dia_laborable_id")
);

-- CreateTable
CREATE TABLE "Dias_laborales" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(10) NOT NULL,
    "nombre_corto" VARCHAR(3) NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Dias_laborales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Horarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(12) NOT NULL,
    "nombre_corto" VARCHAR(3) NOT NULL,
    "hora_inicio" TIME(0),
    "hora_fin" TIME(0),

    CONSTRAINT "Horarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grabaciones" (
    "id" SERIAL NOT NULL,
    "archivo" VARCHAR(20) NOT NULL,
    "formato" VARCHAR(5) NOT NULL,
    "detalle" VARCHAR(50) NOT NULL,
    "tipo_grabacion_id" INTEGER NOT NULL,
    "long" TIME,
    "size_byte" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Grabaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipos_grabaciones" (
    "id" SERIAL NOT NULL,
    "detalle" VARCHAR(50) NOT NULL,
    "nombre_corto" VARCHAR(10) NOT NULL,

    CONSTRAINT "Tipos_grabaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grabaciones_servicios" (
    "servicio_id" INTEGER NOT NULL,
    "grabacion_id" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "Grabaciones_servicios_pkey" PRIMARY KEY ("servicio_id","grabacion_id")
);

-- CreateTable
CREATE TABLE "Grabaciones_departamentos" (
    "departamento_id" INTEGER NOT NULL,
    "grabacion_id" INTEGER NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "Grabaciones_departamentos_pkey" PRIMARY KEY ("departamento_id","grabacion_id")
);

-- CreateTable
CREATE TABLE "Recursos_multimedia" (
    "id" SERIAL NOT NULL,
    "archivo" VARCHAR(20) NOT NULL,
    "tipo_id" INTEGER NOT NULL,
    "formato" VARCHAR(5) NOT NULL,
    "detalle" VARCHAR(50) NOT NULL,
    "coleccion_multimedia_id" INTEGER NOT NULL,
    "long" TIME,
    "size" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,
    "subido_por_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Recursos_multimedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipos_multimedia" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "siglas" VARCHAR(3) NOT NULL,
    "icono" VARCHAR(20) NOT NULL,
    "color_hex" VARCHAR(7) NOT NULL,

    CONSTRAINT "Tipos_multimedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colecciones_multimedia" (
    "id" SERIAL NOT NULL,
    "detalle" VARCHAR(50) NOT NULL,
    "nombre_corto" VARCHAR(10) NOT NULL,

    CONSTRAINT "Colecciones_multimedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Colecciones_multimedia_pantallas" (
    "coleccion_multimedia_id" INTEGER NOT NULL,
    "pantalla_id" INTEGER NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,
    "orden" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Colecciones_multimedia_pantallas_pkey" PRIMARY KEY ("coleccion_multimedia_id","pantalla_id")
);

-- CreateTable
CREATE TABLE "Protocolos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,
    "tipo_protocolo_id" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Protocolos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipos_protocolos" (
    "id" SERIAL NOT NULL,
    "tipo" "Tipado_protocolos" NOT NULL DEFAULT 'SERVICIO',
    "descripcion" VARCHAR(50) NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Tipos_protocolos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicios_seguros" (
    "servicio_id" INTEGER NOT NULL,
    "seguro_id" INTEGER NOT NULL,
    "protocolo_id" INTEGER NOT NULL,
    "cobertura" VARCHAR(10) NOT NULL,
    "prioridad" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Servicios_seguros_pkey" PRIMARY KEY ("servicio_id","seguro_id","protocolo_id")
);

-- CreateTable
CREATE TABLE "Servicios_dependientes" (
    "id" SERIAL NOT NULL,
    "servicio_seleccionable_id" INTEGER NOT NULL,
    "servicio_dependiente_id" INTEGER NOT NULL,
    "protocolo_id" INTEGER NOT NULL,
    "razon_por_realizar" VARCHAR(10) NOT NULL,
    "prioridad" INTEGER NOT NULL,
    "estatus" BOOLEAN DEFAULT true,

    CONSTRAINT "Servicios_dependientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "nombres" VARCHAR(50) NOT NULL,
    "correo" VARCHAR(60) NOT NULL,
    "username" VARCHAR(15) NOT NULL,
    "password" TEXT NOT NULL,
    "rol_id" INTEGER NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(20) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,
    "activo" BOOLEAN DEFAULT true,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permisos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(15) NOT NULL,
    "slug" VARCHAR(30) NOT NULL,

    CONSTRAINT "Permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles_permisos" (
    "rol_id" INTEGER NOT NULL,
    "permiso_id" INTEGER NOT NULL,
    "create" BOOLEAN NOT NULL DEFAULT false,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "update" BOOLEAN NOT NULL DEFAULT false,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Roles_permisos_pkey" PRIMARY KEY ("rol_id","permiso_id")
);

-- CreateTable
CREATE TABLE "Configuraciones" (
    "id" SERIAL NOT NULL,
    "clave" VARCHAR(30) NOT NULL,
    "valor" VARCHAR(100) NOT NULL,
    "detalle" VARCHAR(50) NOT NULL,
    "valor_default" VARCHAR(100) NOT NULL,
    "modificado_por_id" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Configuraciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registros_desactivados" (
    "id" SERIAL NOT NULL,
    "nombre_entidad" VARCHAR(30) NOT NULL,
    "id_registro" INTEGER NOT NULL,
    "razon_desactivado" VARCHAR(100) NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registros_desactivados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitas_agendadas" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,
    "tipo_visita_id" INTEGER NOT NULL,
    "fecha_hora_planificada" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "sucursal_id" INTEGER NOT NULL,
    "comentario" VARCHAR(255) NOT NULL,
    "estatus" BOOLEAN NOT NULL DEFAULT true,
    "registrado_por" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Visitas_agendadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipos_visitas" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(10) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,
    "servicio_destino_id" INTEGER NOT NULL,

    CONSTRAINT "Tipos_visitas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Referimientos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(10) NOT NULL,
    "referencia" VARCHAR(30) NOT NULL,
    "tipo_id" INTEGER NOT NULL,
    "descripcion" VARCHAR(100) NOT NULL,
    "localidad" VARCHAR(50) NOT NULL,
    "sector" VARCHAR(50) NOT NULL,
    "estado_provincia" VARCHAR(30) NOT NULL,

    CONSTRAINT "Referimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tipos_referimientos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(10) NOT NULL,
    "descripcion" VARCHAR(50) NOT NULL,

    CONSTRAINT "Tipos_referimientos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contactos_clientes" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "fecha_nacimiento" DATE,
    "telefono" VARCHAR(10) NOT NULL,
    "celular" VARCHAR(15) NOT NULL,
    "referido_id" INTEGER NOT NULL,
    "direccion_id" INTEGER NOT NULL,

    CONSTRAINT "Contactos_clientes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Opciones_menu_servicios_id_key" ON "Opciones_menu_servicios"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_identificacion_key" ON "Clientes"("identificacion");

-- CreateIndex
CREATE UNIQUE INDEX "Agentes_usuario_id_key" ON "Agentes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "Sucursales_direccion_id_key" ON "Sucursales"("direccion_id");

-- CreateIndex
CREATE UNIQUE INDEX "Departamentos_sucursales_refId_key" ON "Departamentos_sucursales"("refId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_nombres_key" ON "Usuarios"("nombres");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_correo_key" ON "Usuarios"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_username_key" ON "Usuarios"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_nombre_key" ON "Roles"("nombre");

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_servicio_destino_id_fkey" FOREIGN KEY ("servicio_destino_id") REFERENCES "Servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_estado_turno_id_fkey" FOREIGN KEY ("estado_turno_id") REFERENCES "Estados_turnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "Sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turnos" ADD CONSTRAINT "Turnos_registrado_por_id_fkey" FOREIGN KEY ("registrado_por_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios" ADD CONSTRAINT "Servicios_grupo_id_fkey" FOREIGN KEY ("grupo_id") REFERENCES "Grupos_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atenciones_turnos_servicios" ADD CONSTRAINT "Atenciones_turnos_servicios_turno_id_fkey" FOREIGN KEY ("turno_id") REFERENCES "Turnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atenciones_turnos_servicios" ADD CONSTRAINT "Atenciones_turnos_servicios_agente_id_fkey" FOREIGN KEY ("agente_id") REFERENCES "Agentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Atenciones_turnos_servicios" ADD CONSTRAINT "Atenciones_turnos_servicios_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios_sucursales" ADD CONSTRAINT "Servicios_sucursales_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios_sucursales" ADD CONSTRAINT "Servicios_sucursales_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "Sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opciones_menu" ADD CONSTRAINT "Opciones_menu_opciones_id_fkey" FOREIGN KEY ("opciones_id") REFERENCES "Opciones_flujo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opciones_menu" ADD CONSTRAINT "Opciones_menu_opcion_menu_servicios_id_fkey" FOREIGN KEY ("opcion_menu_servicios_id") REFERENCES "Opciones_menu_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opciones_menu_servicios" ADD CONSTRAINT "Opciones_menu_servicios_estado_turno_id_fkey" FOREIGN KEY ("estado_turno_id") REFERENCES "Estados_turnos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Opciones_menu_servicios" ADD CONSTRAINT "Opciones_menu_servicios_grupo_servicio_id_fkey" FOREIGN KEY ("grupo_servicio_id") REFERENCES "Grupos_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_tipo_identificacion_id_fkey" FOREIGN KEY ("tipo_identificacion_id") REFERENCES "Tipos_identificaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_seguro_id_fkey" FOREIGN KEY ("seguro_id") REFERENCES "Seguros"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_registrado_por_id_fkey" FOREIGN KEY ("registrado_por_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agentes" ADD CONSTRAINT "Agentes_grupo_servicio_id_fkey" FOREIGN KEY ("grupo_servicio_id") REFERENCES "Grupos_servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agentes" ADD CONSTRAINT "Agentes_tipo_agente_id_fkey" FOREIGN KEY ("tipo_agente_id") REFERENCES "Tipos_agentes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agentes" ADD CONSTRAINT "Agentes_departamento_sucursal_id_fkey" FOREIGN KEY ("departamento_sucursal_id") REFERENCES "Departamentos_sucursales"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agentes" ADD CONSTRAINT "Agentes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pantallas" ADD CONSTRAINT "Pantallas_estilo_id_fkey" FOREIGN KEY ("estilo_id") REFERENCES "Estilos_pantallas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pantallas" ADD CONSTRAINT "Pantallas_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "Opciones_flujo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sucursales" ADD CONSTRAINT "Sucursales_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "Direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departamentos_sucursales" ADD CONSTRAINT "Departamentos_sucursales_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departamentos_sucursales" ADD CONSTRAINT "Departamentos_sucursales_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "Sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios_departamentos_sucursales" ADD CONSTRAINT "Servicios_departamentos_sucursales_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios_departamentos_sucursales" ADD CONSTRAINT "Servicios_departamentos_sucursales_departamento_sucursal_i_fkey" FOREIGN KEY ("departamento_sucursal_id") REFERENCES "Departamentos_sucursales"("refId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horarios_sucursales" ADD CONSTRAINT "Horarios_sucursales_horario_dia_laborable_id_fkey" FOREIGN KEY ("horario_dia_laborable_id") REFERENCES "Horarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horarios_sucursales" ADD CONSTRAINT "Horarios_sucursales_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "Sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horarios_dias_laborables" ADD CONSTRAINT "Horarios_dias_laborables_horario_id_fkey" FOREIGN KEY ("horario_id") REFERENCES "Horarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Horarios_dias_laborables" ADD CONSTRAINT "Horarios_dias_laborables_dia_laborable_id_fkey" FOREIGN KEY ("dia_laborable_id") REFERENCES "Dias_laborales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grabaciones" ADD CONSTRAINT "Grabaciones_tipo_grabacion_id_fkey" FOREIGN KEY ("tipo_grabacion_id") REFERENCES "Tipos_grabaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grabaciones_servicios" ADD CONSTRAINT "Grabaciones_servicios_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grabaciones_servicios" ADD CONSTRAINT "Grabaciones_servicios_grabacion_id_fkey" FOREIGN KEY ("grabacion_id") REFERENCES "Grabaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grabaciones_departamentos" ADD CONSTRAINT "Grabaciones_departamentos_departamento_id_fkey" FOREIGN KEY ("departamento_id") REFERENCES "Departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grabaciones_departamentos" ADD CONSTRAINT "Grabaciones_departamentos_grabacion_id_fkey" FOREIGN KEY ("grabacion_id") REFERENCES "Grabaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recursos_multimedia" ADD CONSTRAINT "Recursos_multimedia_tipo_id_fkey" FOREIGN KEY ("tipo_id") REFERENCES "Tipos_multimedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recursos_multimedia" ADD CONSTRAINT "Recursos_multimedia_coleccion_multimedia_id_fkey" FOREIGN KEY ("coleccion_multimedia_id") REFERENCES "Colecciones_multimedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recursos_multimedia" ADD CONSTRAINT "Recursos_multimedia_subido_por_id_fkey" FOREIGN KEY ("subido_por_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colecciones_multimedia_pantallas" ADD CONSTRAINT "Colecciones_multimedia_pantallas_coleccion_multimedia_id_fkey" FOREIGN KEY ("coleccion_multimedia_id") REFERENCES "Colecciones_multimedia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Colecciones_multimedia_pantallas" ADD CONSTRAINT "Colecciones_multimedia_pantallas_pantalla_id_fkey" FOREIGN KEY ("pantalla_id") REFERENCES "Pantallas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocolos" ADD CONSTRAINT "Protocolos_tipo_protocolo_id_fkey" FOREIGN KEY ("tipo_protocolo_id") REFERENCES "Tipos_protocolos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios_seguros" ADD CONSTRAINT "Servicios_seguros_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "Servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios_seguros" ADD CONSTRAINT "Servicios_seguros_seguro_id_fkey" FOREIGN KEY ("seguro_id") REFERENCES "Seguros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios_seguros" ADD CONSTRAINT "Servicios_seguros_protocolo_id_fkey" FOREIGN KEY ("protocolo_id") REFERENCES "Protocolos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios_dependientes" ADD CONSTRAINT "Servicios_dependientes_servicio_dependiente_id_fkey" FOREIGN KEY ("servicio_dependiente_id") REFERENCES "Servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicios_dependientes" ADD CONSTRAINT "Servicios_dependientes_protocolo_id_fkey" FOREIGN KEY ("protocolo_id") REFERENCES "Protocolos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roles_permisos" ADD CONSTRAINT "Roles_permisos_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Roles_permisos" ADD CONSTRAINT "Roles_permisos_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "Permisos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuraciones" ADD CONSTRAINT "Configuraciones_modificado_por_id_fkey" FOREIGN KEY ("modificado_por_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registros_desactivados" ADD CONSTRAINT "Registros_desactivados_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitas_agendadas" ADD CONSTRAINT "Visitas_agendadas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitas_agendadas" ADD CONSTRAINT "Visitas_agendadas_tipo_visita_id_fkey" FOREIGN KEY ("tipo_visita_id") REFERENCES "Tipos_visitas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitas_agendadas" ADD CONSTRAINT "Visitas_agendadas_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "Sucursales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tipos_visitas" ADD CONSTRAINT "Tipos_visitas_servicio_destino_id_fkey" FOREIGN KEY ("servicio_destino_id") REFERENCES "Servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referimientos" ADD CONSTRAINT "Referimientos_tipo_id_fkey" FOREIGN KEY ("tipo_id") REFERENCES "Tipos_referimientos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contactos_clientes" ADD CONSTRAINT "Contactos_clientes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contactos_clientes" ADD CONSTRAINT "Contactos_clientes_referido_id_fkey" FOREIGN KEY ("referido_id") REFERENCES "Referimientos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contactos_clientes" ADD CONSTRAINT "Contactos_clientes_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "Direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
