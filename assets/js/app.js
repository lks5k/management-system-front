/**
 * IMSAS · Sistema de Gestión de Producción
 * app.js — Lógica compartida: sesión, autenticación y datos mock
 *
 * NOTA: Este módulo simula autenticación en localStorage para el prototipo.
 * En producción será reemplazado por JWT + Spring Security.
 */

// ============================================================
// Credenciales de prueba (solo prototipo — NO usar en prod)
// ============================================================
const IMSAS_USERS = [
  {
    email: 'superadmin@imsas.com',
    password: 'superadmin123',
    name: 'Super Admin',
    role: 'SUPERADMIN',
    roleLabel: 'Super Administrador',
    initials: 'SA',
    permisos: ['todo', 'usuarios', 'roles']
  },
  {
    email: 'admin@imsas.com',
    password: 'admin123',
    name: 'Ana Martínez',
    role: 'ADMIN',
    roleLabel: 'Administrador',
    initials: 'AM',
    permisos: ['todo', 'estados']
  },
  {
    email: 'manager@imsas.com',
    password: 'manager123',
    name: 'Miguel Torres',
    role: 'MANAGER',
    roleLabel: 'Gerente',
    initials: 'MT',
    permisos: ['aprobar', 'reportes']
  },
  {
    email: 'operator@imsas.com',
    password: 'operator123',
    name: 'Oscar Ramírez',
    role: 'OPERATOR',
    roleLabel: 'Operador',
    initials: 'OR',
    permisos: ['maestros', 'solicitudes']
  },
  {
    email: 'officer@imsas.com',
    password: 'officer123',
    name: 'Felipe Ruiz',
    role: 'OFFICER',
    roleLabel: 'Oficial Comercial',
    initials: 'FR',
    permisos: ['solicitudes_propias', 'archivos']
  },
  {
    email: 'sales-rep@imsas.com',
    password: 'salesrep123',
    name: 'Sara Gutiérrez',
    role: 'SALES_REP',
    roleLabel: 'Asesor Comercial',
    initials: 'SG',
    permisos: ['clientes_asignados', 'solicitudes_propias']
  }
];

const IMSAS_SESSION_KEY = 'imsas_session';

/**
 * Intenta autenticar con las credenciales dadas.
 * @returns {object|null} Objeto de sesión serializable, o null si fallan.
 */
function imsasLogin(email, password) {
  const user = IMSAS_USERS.find(
    u => u.email === email.trim().toLowerCase() && u.password === password
  );
  if (!user) return null;

  const session = {
    email: user.email,
    name: user.name,
    role: user.role,
    roleLabel: user.roleLabel,
    initials: user.initials
  };
  localStorage.setItem(IMSAS_SESSION_KEY, JSON.stringify(session));
  return session;
}

/**
 * Cierra sesión y redirige al login.
 * Calcula la ruta correcta según si estamos dentro de /pages/.
 */
function imsasLogout() {
  localStorage.removeItem(IMSAS_SESSION_KEY);
  const inPages = window.location.pathname.includes('/pages/');
  window.location.href = inPages ? '../index.html' : 'index.html';
}

/**
 * Retorna la sesión activa o null.
 */
function imsasGetSession() {
  try {
    return JSON.parse(localStorage.getItem(IMSAS_SESSION_KEY));
  } catch {
    return null;
  }
}

/**
 * Verifica que haya sesión activa.
 * Si no hay, redirige al login y retorna null.
 * Llamar en el init() del x-data de cada página protegida.
 */
function imsasRequireAuth() {
  const session = imsasGetSession();
  if (!session) {
    const inPages = window.location.pathname.includes('/pages/');
    window.location.href = inPages ? '../index.html' : 'index.html';
    return null;
  }
  return session;
}

/**
 * Datos mock compartidos que pueden reutilizarse en los formularios.
 * Centraliza los datos para facilitar la futura conexión con la API REST.
 */
const IMSAS_MOCK = {
  empresas: [
    { id: 1, nit: '890.900.513-7', razon: 'FANALCA S.A.', ciudad: 'Cali' },
    { id: 2, nit: '900.123.456-8', razon: 'NCS MODA S.A.S', ciudad: 'Medellín' },
    { id: 3, nit: '800.456.789-1', razon: 'PRACTIPOLOS', ciudad: 'Bogotá' },
    { id: 4, nit: '900.789.123-5', razon: 'TEXTILES DEL VALLE', ciudad: 'Cali' },
    { id: 5, nit: '860.012.345-2', razon: 'DISTRIBUIDORA CALIDAD', ciudad: 'Bogotá' }
  ],
  contactosPorEmpresa: {
    'FANALCA S.A.': [
      { id: 1, nombre: 'Laura Martínez', cargo: 'Compradora' },
      { id: 2, nombre: 'Carlos Ruiz', cargo: 'Diseñador' },
      { id: 3, nombre: 'Andrea López', cargo: 'Coord. Producción' }
    ],
    'NCS MODA S.A.S': [
      { id: 4, nombre: 'María Torres', cargo: 'Gerente Comercial' },
      { id: 5, nombre: 'Jorge Silva', cargo: 'Diseñador' }
    ],
    'PRACTIPOLOS': [{ id: 6, nombre: 'Pedro Gómez', cargo: 'Gerente' }],
    'TEXTILES DEL VALLE': [
      { id: 7, nombre: 'Rosa Herrera', cargo: 'Compradora' },
      { id: 8, nombre: 'Luis Cardona', cargo: 'Diseñador Textil' }
    ],
    'DISTRIBUIDORA CALIDAD': [
      { id: 9, nombre: 'Ana García', cargo: 'Gerente Comercial' }
    ]
  },
  marcasPorEmpresa: {
    'FANALCA S.A.': ['HONDA', 'QUEST', 'GAS', 'CHEVIGNON', 'ESPRIT'],
    'NCS MODA S.A.S': ['VÉLEZ', 'AMERICANINO', 'NALSANI'],
    'PRACTIPOLOS': ['POLO CLUB', 'SPORT WEAR'],
    'TEXTILES DEL VALLE': ['TEJIDOS ANDINOS', 'HILO FINO'],
    'DISTRIBUIDORA CALIDAD': ['SPORT WEAR']
  }
};
