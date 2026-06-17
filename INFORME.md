He concluido la lectura de todos los archivos. Presento el informe completo antes de cualquier modificación.

---

## Informe de revisión — IMSAS Frontend

### TAREA 2 — Orden de scripts `[BLOQUEANTE]`

Esta es la primera verificación porque afecta el funcionamiento de todos los archivos.

| Archivo | app.js | Alpine.js | Estado |
|---|---|---|---|
| `index.html` | línea 12 | línea 8 | ❌ INVERTIDO |
| `solicitud-crear.html` | línea 12 | línea 8 | ❌ INVERTIDO |
| `solicitudes.html` | línea 12 | línea 8 | ❌ INVERTIDO |
| `solicitud-detalle.html` | línea 12 | línea 8 | ❌ INVERTIDO |
| `dashboard.html` | línea 8 | línea 9 | ✅ CORRECTO |
| `empresa-form.html` | línea 8 | línea 9 | ✅ CORRECTO |
| `contacto-form.html` | línea 8 | línea 9 | ✅ CORRECTO |
| `marca-form.html` | línea 8 | línea 9 | ✅ CORRECTO |
| `empresas.html` | línea 8 | línea 9 | ✅ CORRECTO |

**4 archivos con orden invertido.** Nota técnica: aunque Alpine tiene `defer`, la regla definida exige que `app.js` aparezca primero en el DOM para consistencia y como garantía de que las funciones globales estén disponibles sin depender del orden de ejecución del browser.

---

### TAREA 1 — Enums en formularios

#### A. Tipo de solicitud — **CAMPO AUSENTE**

El campo `tipo` (DISEÑO, MUESTRAS, PEDIDO, REPOSICION, CORTE, PRESTAMO) **no existe en `solicitud-crear.html`**. Es la omisión más crítica del formulario. El campo "Producto / Tipo de etiqueta" corresponde al catálogo de productos — es una entidad distinta al tipo de solicitud.

#### B. Estados — **INCORRECTOS EN 4 ARCHIVOS**

Los estados vigentes son: `BORRADOR`, `CONFIRMAR`, `PENDIENTE`, `COMPLETADO`, `CANCELADO`.

| Archivo | Problema encontrado |
|---|---|
| `solicitudes.html` | Usa `CONFIRMADA` y `CANCELADA` en lugar de `CONFIRMAR` y `CANCELADO`. Falta `COMPLETADO`. |
| `solicitud-detalle.html` | Mismo error en `estadoColors`, `transiciones` e `historialColors`. Falta `COMPLETADO`. |
| `solicitud-crear.html` | `submit()` establece `estado = 'PENDIENTE'` directamente, saltando `CONFIRMAR`. |
| `dashboard.html` | KPI etiquetado como "Confirmadas". Tabla mock usa `CONFIRMADA` y `CANCELADA`. Falta `COMPLETADO`. |

Las transiciones en `solicitud-detalle.html` son incorrectas:
```
Actual:   BORRADOR → PENDIENTE → CONFIRMADA
Correcto: BORRADOR → CONFIRMAR → PENDIENTE → COMPLETADO
          (CANCELADO accesible desde cualquier estado excepto COMPLETADO)
```

#### C. Técnicas / Costura
Los valores de técnica en `solicitud-crear.html` son razonables para el prototipo. El SDD no define un enum cerrado para técnicas. Sin problemas aquí.

---

### TAREA 3 — Consistencia de navegación

La estructura del sidebar es **idéntica en todos los archivos** — mismo orden, mismos íconos, mismo marcado `active` según la página activa. Bien.

**Falta: enlace a Productos.** El SDD (sección 8) define una pantalla de Productos administrable. No existe en ningún sidebar ni hay página para ello.

**Sección de usuario del sidebar — hardcodeada en 5 archivos:**

| Archivo | Usuario en sidebar |
|---|---|
| `dashboard.html` | Dinámico (`session?.initials`) ✅ |
| `empresa-form.html` | Dinámico ✅ |
| `solicitud-crear.html` | Hardcodeado: "AM / Ana Martínez" ❌ |
| `solicitudes.html` | Hardcodeado: "AM / Ana Martínez" ❌ |
| `solicitud-detalle.html` | Hardcodeado: "AM / Ana Martínez" ❌ |
| `contacto-form.html` | Hardcodeado: "AM / Ana Martínez" ❌ |
| `marca-form.html` | Hardcodeado: "AM / Ana Martínez" ❌ |

---

### TAREA 4 — Datos mock que contradicen el modelo

| # | Archivo | Problema |
|---|---|---|
| 1 | `solicitudes.html` | Objetos mock usan `estado: 'CONFIRMADA'` / `'CANCELADA'` — estados inexistentes en el modelo |
| 2 | `solicitudes.html` | Objetos mock no tienen campo `tipo` (DISEÑO, MUESTRAS, PEDIDO...) — columna ausente en la tabla |
| 3 | `solicitudes.html` | P-S0145 y P-S0140 están en `BORRADOR` pero ya tienen código asignado — viola RN-04 |
| 4 | `solicitud-detalle.html` | Flujo de estados muestra BORRADOR→PENDIENTE, omite CONFIRMAR — incorrecto según SDD 5.3 |
| 5 | `solicitud-detalle.html` | Modal de cancelación referencia `(RN-16)` — RN-16 es sobre productos. El correcto es RN-13 |
| 6 | `solicitud-detalle.html` | Tab "Archivos corporativos" referencia `(RN-13)` — RN-13 es sobre cancelación, no archivos |
| 7 | `solicitud-detalle.html` | Tab "Archivos propios" referencia `(RN-14)` — RN-14 es sobre estados, no archivos |
| 8 | `empresa-form.html` | Help text del NIT dice `(RN-04)` — RN-04 es sobre código de solicitud; debería ser RN-02 |
| 9 | `contacto-form.html` | Solo tiene un campo de correo — el SDD (CU-03) requiere soporte de múltiples correos por contacto |

---

### TAREA 5 — README.md

El archivo `README.md` está **completamente vacío**. Necesita ser creado con la documentación del proyecto.

---

## Resumen de cambios a realizar (en orden de prioridad)

1. **Crítico** — Corregir estados en todo el sistema: `CONFIRMADA→CONFIRMAR`, `CANCELADA→CANCELADO`, añadir `COMPLETADO`
2. **Crítico** — Añadir campo `tipo` en `solicitud-crear.html`
3. **Crítico** — Corregir transiciones de estado en `solicitud-detalle.html`
4. **Importante** — Corregir orden de scripts en 4 archivos
5. **Importante** — Dinamizar sección de usuario en 5 sidebars
6. **Importante** — Corregir referencias de reglas de negocio incorrectas
7. **Moderado** — Corregir RN-04→RN-02 en `empresa-form.html`
8. **Moderado** — Añadir widget de múltiples correos en `contacto-form.html`
9. **Moderado** — Añadir entrada "Productos" en todos los sidebars
10. **Documentación** — Escribir `README.md`

---

¿Con cuáles cambios quieres que empiece? Puedo abordarlos todos en orden, o priorizas alguno en particular. Recomiendo empezar por **los estados** ya que corregirlos impacta múltiples archivos a la vez y es la inconsistencia más visible.