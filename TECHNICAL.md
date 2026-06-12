=== CONTEXTO DEL PROYECTO ===
Empresa: IMSAS (flexografía: etiquetas, bordados, estampados)
Tipo de sistema: ERP Monolítico Modular (aplicación interna)
NO hay sitio público, ecommerce ni portal de clientes

Stack frontend: HTML5 + Tailwind CSS (CDN) + Alpine.js (CDN)
Stack backend (futuro):
  - Java 17
  - Spring Boot 3
  - Spring Security + JWT
  - Spring Data JPA
  - PostgreSQL

Control de versiones: Git / GitHub
Almacenamiento de archivos: Sistema local (V1)

=== PALETA DE COLORES ===
#FFFFFF  Fondo
#F4F7FA  Secundario / fondo de página
#E8EEF4  Sidebar
#4A7FA5  Primario
#2C5F7A  CTA / botón principal
#1A2B3C  Texto
#D1DCE5  Bordes

=== ROLES Y CREDENCIALES DE PRUEBA ===
superadmin@imsas.com  / superadmin123  → Control total + gestión usuarios/roles
admin@imsas.com       / admin123       → Gestión completa + cambio de todos los estados
manager@imsas.com     / manager123     → Aprobación de solicitudes + reportes globales
operator@imsas.com    / operator123    → Crear/editar maestros + solicitudes
officer@imsas.com     / officer123     → Solicitudes propias + archivos adjuntos
sales-rep@imsas.com   / salesrep123    → Cartera de clientes asignados + solicitudes propias

=== MÓDULOS V1 (según SDD.md) ===
- Autenticación (roles)
- Empresas (CRUD)
- Contactos (CRUD, filtro por empresa)
- Marcas (CRUD, detección de duplicados RN-12)
- Solicitudes (CRUD, estados: BORRADOR → PENDIENTE → CONFIRMADA / CANCELADA)
- Archivos corporativos (asociables a múltiples solicitudes)
- Archivos de solicitud (exclusivos por solicitud)

=== REGLAS DE NEGOCIO CLAVE ===
RN-04: NIT único por empresa
RN-05: formato de correo válido
RN-06: código solicitud auto-generado formato P-S0001
RN-07: consecutivo no se reinicia
RN-08: código no modificable
RN-12: buscar duplicados antes de crear marca
RN-14: archivos de solicitud exclusivos (no reutilizables)
RN-15: eliminación lógica (no física)
RN-16: cancelación requiere observación obligatoria

=== REFERENCIA ===
Lee @SDD.md (o SDD.md) para entender el dominio del negocio completo.
Lee @TECHNICAL.md (o TECHNICAL.md) para conocer los aspectos técnicos del proyecto.
Lee @pages/dashboard.html (o pages/dashboard.html) como ejemplo del patrón de código.