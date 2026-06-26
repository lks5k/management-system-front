/**
 * IMSAS · Sistema de Gestión de Producción
 * app.js — Sesión, autenticación y utilidades compartidas.
 *
 * La autenticación delega en imsasAuthLogin() (api.js) que llama a
 * POST /api/v1/auth/login con JWT. La sesión resultante se guarda en
 * localStorage igual que antes para que los x-data de Alpine.js puedan
 * leerla sin cambios en las páginas que solo muestran info de sesión.
 *
 * REQUIERE: api.js cargado antes que este archivo.
 */

const IMSAS_SESSION_KEY = 'imsas_session';

// ─── Gestión de sesión ───────────────────────────────────────────────────────

/**
 * Retorna la sesión activa o null.
 * @returns {{ email, name, role, roleLabel, initials } | null}
 */
function imsasGetSession() {
  try {
    return JSON.parse(localStorage.getItem(IMSAS_SESSION_KEY));
  } catch {
    return null;
  }
}

/**
 * Llama al backend con las credenciales, almacena el token JWT y la sesión.
 * Retorna el objeto de sesión en caso de éxito, o lanza un error.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ email, name, role, roleLabel, initials }>}
 */
async function imsasLogin(email, password) {
  const loginData = await imsasAuthLogin(email.trim().toLowerCase(), password);

  // loginData es el LoginResponse del backend: { token, tipo, id, nombre, email, rol }
  imsasSetToken(loginData.token);

  const session = {
    id:        loginData.id,
    email:     loginData.email,
    name:      loginData.nombre,
    role:      loginData.rol,
    roleLabel: _rolLabel(loginData.rol),
    initials:  _initials(loginData.nombre)
  };

  localStorage.setItem(IMSAS_SESSION_KEY, JSON.stringify(session));
  return session;
}

/**
 * Cierra sesión: limpia token + sesión y redirige al login.
 */
function imsasLogout() {
  imsasClearToken();
  localStorage.removeItem(IMSAS_SESSION_KEY);
  const inPages = window.location.pathname.includes('/pages/');
  window.location.href = inPages ? '../index.html' : 'index.html';
}

/**
 * Verifica que haya sesión activa.
 * Si no hay, redirige al login y retorna null.
 * Llamar en el init() del x-data de cada página protegida.
 */
function imsasRequireAuth() {
  const session = imsasGetSession();
  if (!session || !imsasGetToken()) {
    imsasLogout();
    return null;
  }
  return session;
}

// ─── Helpers internos ────────────────────────────────────────────────────────

function _rolLabel(rol) {
  const labels = {
    SUPERADMIN: 'Super Administrador',
    ADMIN:      'Administrador',
    MANAGER:    'Operario líder',
    OPERATOR:   'Operario',
    SALES_REP:  'Asesor Comercial'
  };
  return labels[rol] ?? rol;
}

function _initials(nombre) {
  if (!nombre) return '?';
  return nombre
    .split(' ')
    .slice(0, 2)
    .map(p => p[0]?.toUpperCase() ?? '')
    .join('');
}
