/**
 * IMSAS · Sistema de Gestión de Producción
 * api.js — Cliente HTTP centralizado con manejo de JWT
 *
 * Patrón: todas las funciones retornan `data` del envelope { data, meta, errors }.
 * En caso de error lanza un objeto { status, message, errors[] }.
 * En caso de 401 redirige automáticamente al login.
 */

const IMSAS_API_BASE = 'https://management-system-back-8g5r.onrender.com/api/v1';
const IMSAS_TOKEN_KEY = 'imsas_token';

// ─── Conversión de claves camelCase ↔ snake_case ─────────────────────────────
//
// El backend usa Jackson con SNAKE_CASE: todos los campos JSON entran y salen
// en snake_case. El frontend trabaja en camelCase (convención JS).
// Estas utilidades hacen la traducción en la capa de transporte para que ningún
// formulario tenga que preocuparse por el formato del servidor.

function _keyToSnake(str) {
  return str.replace(/[A-Z]/g, ch => `_${ch.toLowerCase()}`);
}

function _keyToCamel(str) {
  return str.replace(/_([a-z])/g, (_, ch) => ch.toUpperCase());
}

/**
 * Convierte recursivamente las claves de un valor (objeto, array o primitivo).
 * @param {any} value
 * @param {(key: string) => string} converter
 * @returns {any}
 */
function _convertKeys(value, converter) {
  if (Array.isArray(value))
    return value.map(item => _convertKeys(item, converter));
  if (value !== null && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [converter(k), _convertKeys(v, converter)])
    );
  return value;
}

// ─── Gestión de token ────────────────────────────────────────────────────────

function imsasGetToken() {
  return localStorage.getItem(IMSAS_TOKEN_KEY);
}

function imsasSetToken(token) {
  localStorage.setItem(IMSAS_TOKEN_KEY, token);
}

function imsasClearToken() {
  localStorage.removeItem(IMSAS_TOKEN_KEY);
}

// ─── Fetch centralizado ──────────────────────────────────────────────────────

/**
 * Wrapper de fetch que:
 *  - Añade el header Authorization Bearer si hay token.
 *  - Convierte el body saliente de camelCase → snake_case (convención Jackson).
 *  - En 401 limpia sesión y redirige al login.
 *  - En errores HTTP lanza { status, message, errors }.
 *  - En éxito convierte `body.data` de snake_case → camelCase y lo retorna.
 *
 * Los formularios siempre trabajan en camelCase; esta función hace la traducción
 * de forma transparente en ambas direcciones.
 *
 * @param {string} path   Ruta relativa, ej. "/empresas" o "/empresas/uuid"
 * @param {RequestInit} options   Opciones fetch estándar
 * @returns {Promise<any>}
 */
async function imsasApi(path, options = {}) {
  const token = imsasGetToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers ?? {})
  };

  // Serializar body convirtiendo camelCase → snake_case
  if (options.body) {
    options = { ...options, body: JSON.stringify(_convertKeys(JSON.parse(options.body), _keyToSnake)) };
  }

  let response;
  try {
    response = await fetch(`${IMSAS_API_BASE}${path}`, { ...options, headers });
  } catch (networkError) {
    throw {
      status: 0,
      message: 'No se pudo conectar con el servidor. Verifica que el backend esté activo.',
      errors: []
    };
  }

  // Token expirado o inválido
  if (response.status === 401) {
    imsasClearToken();
    localStorage.removeItem('imsas_session');
    const inPages = window.location.pathname.includes('/pages/');
    window.location.href = inPages ? '../index.html' : 'index.html';
    return null;
  }

  let body;
  try {
    body = await response.json();
  } catch {
    throw { status: response.status, message: 'Respuesta inválida del servidor.', errors: [] };
  }

  if (!response.ok) {
    const firstError = body?.errors?.[0]?.message ?? body?.message ?? 'Error inesperado del servidor.';
    throw { status: response.status, message: firstError, errors: body?.errors ?? [] };
  }

  // Deserializar data convirtiendo snake_case → camelCase
  return _convertKeys(body.data, _keyToCamel);
}

// ─── Auth ────────────────────────────────────────────────────────────────────

/**
 * Llama a POST /auth/login y retorna el LoginResponse completo (token + datos usuario).
 * No almacena el token: eso es responsabilidad de imsasLogin() en app.js.
 */
async function imsasAuthLogin(email, password) {
  return imsasApi('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

// ─── Empresas ────────────────────────────────────────────────────────────────

const ImsasEmpresas = {
  /** @param {{ termino?, tipoEmpresa?, ciudad?, page?, size? }} params */
  listar(params = {}) {
    const q = new URLSearchParams();
    if (params.termino)     q.set('termino', params.termino);
    if (params.tipoEmpresa) q.set('tipoEmpresa', params.tipoEmpresa);
    if (params.ciudad)      q.set('ciudad', params.ciudad);
    q.set('page', params.page ?? 0);
    q.set('size', params.size ?? 100);
    return imsasApi(`/empresas?${q}`);
  },

  obtener(id) {
    return imsasApi(`/empresas/${id}`);
  },

  /** @param {EmpresaRequest} data */
  crear(data) {
    return imsasApi('/empresas', { method: 'POST', body: JSON.stringify(data) });
  },

  /** @param {string} id @param {EmpresaRequest} data */
  actualizar(id, data) {
    return imsasApi(`/empresas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  eliminar(id) {
    return imsasApi(`/empresas/${id}`, { method: 'DELETE' });
  }
};

// ─── Contactos ───────────────────────────────────────────────────────────────

const ImsasContactos = {
  /** Lista todos los contactos de una empresa. */
  listarPorEmpresa(empresaId, params = {}) {
    const q = new URLSearchParams();
    q.set('size', params.size ?? 200);
    q.set('page', params.page ?? 0);
    return imsasApi(`/empresas/${empresaId}/contactos?${q}`);
  },

  obtener(id) {
    return imsasApi(`/contactos/${id}`);
  },

  /** @param {string} empresaId @param {ContactoRequest} data */
  crear(empresaId, data) {
    return imsasApi(`/empresas/${empresaId}/contactos`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /** @param {string} id @param {ContactoRequest} data */
  actualizar(id, data) {
    return imsasApi(`/contactos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  eliminar(id) {
    return imsasApi(`/contactos/${id}`, { method: 'DELETE' });
  }
};

// ─── Marcas ──────────────────────────────────────────────────────────────────

const ImsasMarcas = {
  /** Lista todas las marcas de una empresa. */
  listarPorEmpresa(empresaId, params = {}) {
    const q = new URLSearchParams();
    q.set('size', params.size ?? 200);
    q.set('page', params.page ?? 0);
    return imsasApi(`/empresas/${empresaId}/marcas?${q}`);
  },

  obtener(id) {
    return imsasApi(`/marcas/${id}`);
  },

  /** @param {string} empresaId @param {{ nombre: string }} data */
  crear(empresaId, data) {
    return imsasApi(`/empresas/${empresaId}/marcas`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  /** @param {string} id @param {{ nombre: string }} data */
  actualizar(id, data) {
    return imsasApi(`/marcas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  eliminar(id) {
    return imsasApi(`/marcas/${id}`, { method: 'DELETE' });
  }
};

// ─── Productos ───────────────────────────────────────────────────────────────

const ImsasProductos = {
  listar(params = {}) {
    const q = new URLSearchParams();
    q.set('page', params.page ?? 0);
    q.set('size', params.size ?? 200);
    return imsasApi(`/productos?${q}`);
  },

  obtener(id) {
    return imsasApi(`/productos/${id}`);
  },

  crear(data) {
    return imsasApi('/productos', { method: 'POST', body: JSON.stringify(data) });
  },

  actualizar(id, data) {
    return imsasApi(`/productos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  eliminar(id) {
    return imsasApi(`/productos/${id}`, { method: 'DELETE' });
  }
};

// ─── Usuarios ────────────────────────────────────────────────────────────────

const ImsasUsuarios = {
  /** @param {{ page?, size? }} params */
  listar(params = {}) {
    const q = new URLSearchParams();
    q.set('page', params.page ?? 0);
    q.set('size', params.size ?? 200);
    return imsasApi(`/usuarios?${q}`);
  },

  obtener(id) {
    return imsasApi(`/usuarios/${id}`);
  },

  /** @param {{ nombre, email, password, rol }} data */
  crear(data) {
    return imsasApi('/usuarios', { method: 'POST', body: JSON.stringify(data) });
  },

  /** @param {string} id @param {{ nombre, email, rol }} data */
  actualizar(id, data) {
    return imsasApi(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  /** @param {string} id @param {{ activo: boolean }} data */
  cambiarEstado(id, data) {
    return imsasApi(`/usuarios/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
};

// ─── Solicitudes ─────────────────────────────────────────────────────────────

const ImsasSolicitudes = {
  /** @param {{ empresaId?, asesorId?, estado?, tipo?, page?, size? }} params */
  listar(params = {}) {
    const q = new URLSearchParams();
    if (params.empresaId) q.set('empresaId', params.empresaId);
    if (params.asesorId)  q.set('asesorId',  params.asesorId);
    if (params.estado)    q.set('estado',    params.estado);
    if (params.tipo)      q.set('tipo',      params.tipo);
    q.set('page', params.page ?? 0);
    q.set('size', params.size ?? 50);
    return imsasApi(`/solicitudes?${q}`);
  },

  obtener(id) {
    return imsasApi(`/solicitudes/${id}`);
  },

  /** @param {SolicitudRequest} data */
  crear(data) {
    return imsasApi('/solicitudes', { method: 'POST', body: JSON.stringify(data) });
  },

  /** @param {string} id @param {SolicitudRequest} data */
  actualizar(id, data) {
    return imsasApi(`/solicitudes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
  },

  /** @param {string} id @param {{ nuevoEstado: string, observacionCancelacion?: string }} data */
  cambiarEstado(id, data) {
    return imsasApi(`/solicitudes/${id}/estado`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },

  eliminar(id) {
    return imsasApi(`/solicitudes/${id}`, { method: 'DELETE' });
  },

  /** @param {string} id @param {string} motivo (obligatorio, max 500 chars) */
  versionarBd(id, motivo) {
    return imsasApi(`/solicitudes/${id}/version-bd`, {
      method: 'PATCH',
      body: JSON.stringify({ motivo })
    });
  },

  /** @param {string} id @param {{ tipo: string, cantidad?: number, ancho?: number, largo?: number, ordenCompra?: string, observaciones?: string }} data */
  convertir(id, data) {
    return imsasApi(`/solicitudes/${id}/convertir`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
};

// ─── Utilidades UI ───────────────────────────────────────────────────────────

/**
 * Formatea un Instant ISO (ej. "2026-06-23T18:00:00Z") a "23 Jun 2026".
 * Retorna '—' si el valor es null/undefined.
 */
function imsasFechaCorta(isoString) {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('es-CO', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
}

/**
 * Extrae el primer mensaje de error de un objeto de error lanzado por imsasApi.
 * @param {any} err
 * @returns {string}
 */
function imsasErrorMsg(err) {
  if (typeof err === 'string') return err;
  return err?.message ?? 'Error inesperado. Intente nuevamente.';
}
