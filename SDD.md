# SDD - Sistema de Gestión de Producción

## Módulo V1: Clientes y Solicitudes

**Versión:** 1.0

**Estado:** Aprobado para desarrollo

---

# 1. Propósito

El Sistema de Gestión de Producción tiene como objetivo centralizar y controlar la información comercial y operativa relacionada con las solicitudes de producción realizadas por los clientes.

Actualmente la información se gestiona mediante archivos Excel independientes, generando duplicidad de información, pérdida de trazabilidad y dificultades para el seguimiento.

La versión 1 del sistema permitirá registrar empresas, contactos, marcas, archivos corporativos y solicitudes de producción desde una única plataforma.

---

# 2. Alcance

La versión 1 incluye:

* Autenticación de usuarios.
* Gestión de empresas.
* Gestión de contactos.
* Gestión de marcas.
* Gestión de archivos corporativos.
* Gestión de solicitudes.
* Asociación de archivos a solicitudes.
* Consulta y seguimiento de solicitudes.

La versión 1 no incluye:

* Diseño gráfico.
* Producción.
* Inventario.
* Despachos.
* Indicadores.
* Notificaciones automáticas.
* Integraciones externas.
* Gestión documental avanzada.

---

# 3. Roles

## Administrador

Responsable de la administración general del sistema.

### Permisos

* Crear usuarios.
* Editar usuarios.
* Activar usuarios.
* Desactivar usuarios.
* Consultar todas las empresas.
* Consultar todas las solicitudes.
* Editar cualquier registro.
* Gestionar archivos corporativos.
* Cambiar estados de solicitudes.
* Consultar información global.

---

## Asesor

Responsable de gestionar la relación comercial con los clientes.

### Permisos

* Iniciar sesión.
* Registrar empresas.
* Registrar contactos.
* Registrar marcas.
* Crear solicitudes.
* Adjuntar archivos.
* Consultar solicitudes propias.
* Editar solicitudes mientras no estén canceladas.

---

# 4. Conceptos del Negocio

## Empresa

Entidad jurídica con la cual se realiza la relación comercial.

Ejemplos:

* FANALCA
* NCS MODA
* PRACTIPOLOS

---

## Cliente

Persona de contacto perteneciente a una empresa.

Ejemplos:

* Comprador
* Diseñador
* Coordinador de producción

Una empresa puede tener múltiples clientes.

---

## Marca

Marca comercial asociada a una empresa.

Ejemplos:

* HONDA
* QUEST
* VÉLEZ

Una empresa puede tener múltiples marcas.

---

## Solicitud

Requerimiento comercial que será gestionado posteriormente por los procesos de diseño y producción.

---

## Archivo Corporativo

Archivo perteneciente a una empresa o marca que puede reutilizarse en múltiples solicitudes.

Ejemplos:

* Logos
* Manuales de marca
* Artes aprobados
* Archivos maestros

---

## Archivo de Solicitud

Archivo exclusivo de una solicitud específica.

Ejemplos:

* Pedido puntual
* Referencia enviada por el cliente
* Archivo temporal

---

# 5. Casos de Uso

## CU-01 Iniciar Sesión

Actor:

* Administrador
* Asesor

Flujo:

1. El usuario ingresa correo y contraseña.
2. El sistema valida credenciales.
3. El sistema genera sesión autenticada.
4. El usuario accede al sistema.

---

## CU-02 Registrar Empresa

Actor:

* Asesor
* Administrador

Flujo:

1. Registrar información de la empresa.
2. Guardar información.
3. La empresa queda disponible para solicitudes.

---

## CU-03 Registrar Contacto

Actor:

* Asesor
* Administrador

Flujo:

1. Seleccionar empresa.
2. Registrar datos del contacto.
3. Guardar información.

---

## CU-04 Registrar Marca

Actor:

* Asesor
* Administrador

Flujo:

1. Seleccionar empresa.
2. Registrar nombre de la marca.
3. Guardar información.

---

## CU-05 Registrar Archivo Corporativo

Actor:

* Asesor
* Administrador

Flujo:

1. Seleccionar empresa.
2. Cargar archivo.
3. Registrar información descriptiva.
4. Guardar archivo.

---

## CU-06 Crear Solicitud

Actor:

* Asesor
* Administrador

Flujo:

1. Seleccionar empresa.
2. Seleccionar contacto.
3. Seleccionar marca.
4. Registrar información de producción.
5. Adjuntar archivos.
6. Guardar solicitud.
7. Generar código automático.

---

## CU-07 Consultar Solicitudes

Actor:

* Administrador
* Asesor

Flujo:

1. Buscar solicitud.
2. Visualizar información.
3. Consultar archivos asociados.
4. Consultar historial.

---

## CU-08 Editar Solicitud

Actor:

* Administrador
* Asesor

Flujo:

1. Abrir solicitud.
2. Modificar información permitida.
3. Guardar cambios.

---

# 6. Estados de Solicitud

## BORRADOR

Solicitud creada pero incompleta.

---

## PENDIENTE

Solicitud lista para revisión.

---

## CONFIRMADA

Solicitud validada.

---

## CANCELADA

Solicitud anulada.

Debe registrarse observación obligatoria.

---

# 7. Reglas de Negocio

### RN-01

Toda solicitud debe pertenecer a una empresa.

---

### RN-02

Toda solicitud debe tener un contacto asociado.

---

### RN-03

Toda solicitud debe tener una marca asociada.

---

### RN-04

El NIT de la empresa debe ser único.

---

### RN-05

El correo electrónico debe tener formato válido.

---

### RN-06

El código de solicitud es generado automáticamente.

Formato:

P-S0001

P-S0002

P-S0003

---

### RN-07

El consecutivo de solicitudes nunca se reinicia.

---

### RN-08

El código de solicitud no puede modificarse.

---

### RN-09

Una empresa puede tener múltiples contactos.

---

### RN-10

Una empresa puede tener múltiples marcas.

---

### RN-11

El asesor puede crear nuevas marcas.

---

### RN-12

Antes de crear una marca el sistema debe buscar coincidencias similares para reducir duplicados.

---

### RN-13

Los archivos corporativos pueden reutilizarse en múltiples solicitudes.

---

### RN-14

Los archivos de solicitud pertenecen exclusivamente a la solicitud donde fueron cargados.

---

### RN-15

La eliminación física de registros no está permitida.

Se utilizará eliminación lógica.

---

### RN-16

Una solicitud cancelada no puede volver a estado borrador.

---

# 8. Modelo de Datos

## Rol

* id
* nombre

---

## Usuario

* id
* nombre
* correo
* password_hash
* activo
* rol_id
* created_at
* updated_at

---

## Empresa

* id
* nit
* razon_social
* direccion
* ciudad
* telefono
* created_at
* updated_at

---

## Cliente

* id
* empresa_id
* nombre
* cargo
* correo
* celular
* es_principal
* created_at
* updated_at

---

## Marca

* id
* empresa_id
* nombre
* descripcion
* created_at
* updated_at

---

## DocumentoEmpresa

* id
* empresa_id
* tipo_documento
* nombre_archivo
* ruta_archivo
* fecha_carga

---

## ArchivoEmpresa

* id
* empresa_id
* nombre_original
* nombre_sistema
* tipo_archivo
* ruta_archivo
* version
* created_at

---

## Solicitud

* id
* codigo
* empresa_id
* cliente_id
* marca_id
* asesor_id
* producto
* cantidad
* tecnica
* material
* medidas
* colores
* observaciones
* estado
* created_at
* updated_at

---

## SolicitudArchivo

* id
* solicitud_id
* archivo_empresa_id

---

## ArchivoSolicitud

* id
* solicitud_id
* nombre_archivo
* ruta_archivo
* tipo_archivo
* fecha_carga

---

# 9. Pantallas

## Login

Campos:

* Correo
* Contraseña

---

## Dashboard

Información:

* Total empresas
* Total solicitudes
* Solicitudes pendientes
* Solicitudes confirmadas

---

## Empresas

Funciones:

* Crear
* Editar
* Consultar

---

## Contactos

Funciones:

* Crear
* Editar
* Consultar

---

## Marcas

Funciones:

* Crear
* Editar
* Consultar

---

## Archivos Corporativos

Funciones:

* Subir
* Consultar
* Asociar a solicitudes

---

## Solicitudes

Funciones:

* Crear
* Editar
* Consultar
* Filtrar

---

## Detalle de Solicitud

Información:

* Datos generales
* Archivos corporativos asociados
* Archivos propios
* Estado
* Historial

---

# 10. Tecnologías

## Backend

* Java 17
* Spring Boot 3
* Spring Security
* JWT
* Spring Data JPA

## Base de Datos

* PostgreSQL

## Frontend

* HTML5
* Tailwind CSS
* Alpine.js

## Control de Versiones

* Git
* GitHub

## Almacenamiento de Archivos

* Sistema de archivos local (V1)

---

# 11. Criterio de Finalización de la V1

La versión 1 se considera terminada cuando:

* Los usuarios pueden autenticarse.
* Las empresas pueden registrarse.
* Los contactos pueden registrarse.
* Las marcas pueden registrarse.
* Los archivos corporativos pueden cargarse.
* Las solicitudes pueden crearse.
* Las solicitudes pueden consultarse.
* Los archivos pueden asociarse a solicitudes.
* Toda la información queda almacenada en PostgreSQL.
