// Autenticación SIMULADA para la práctica.
// Las cuentas son de demostración y ficticias: no son credenciales reales.
// Esto no reemplaza la autorización de un servidor: cualquiera puede leer este código.

export const ROLES = {
  ADMIN: "admin",
  CLIENTE: "cliente",
};

const CUENTAS_DEMO = [
  { username: "admin", password: "admin123", nombre: "Administrador", role: ROLES.ADMIN },
  { username: "cliente", password: "cliente123", nombre: "Cliente Demo", role: ROLES.CLIENTE },
];

const CLAVE_SESION = "urban-store:sesion";

// Devuelve el usuario sin la contraseña (nunca la guardamos ni la exponemos)
function datosPublicos(cuenta) {
  return { username: cuenta.username, nombre: cuenta.nombre, role: cuenta.role };
}

function buscarCuenta(username) {
  return CUENTAS_DEMO.find((cuenta) => cuenta.username === username);
}

export function login(username, password) {
  const cuenta = buscarCuenta(username.trim().toLowerCase());

  if (!cuenta || cuenta.password !== password) {
    throw new Error("Usuario o contraseña incorrectos.");
  }

  const usuario = datosPublicos(cuenta);
  // Guardamos solo el username: el rol se vuelve a leer de CUENTAS_DEMO al cargar
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ username: usuario.username }));
  return usuario;
}

export function logout() {
  localStorage.removeItem(CLAVE_SESION);
}

// Recupera la sesión guardada. Si está corrupta o el usuario no existe, devuelve null.
export function obtenerSesion() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_SESION));
    const cuenta = guardado && buscarCuenta(guardado.username);
    return cuenta ? datosPublicos(cuenta) : null;
  } catch {
    return null;
  }
}

// Validación de rol en la capa de servicio: los servicios la llaman
// antes de crear, editar o borrar productos, categorías y tags.
export function exigirAdmin() {
  const usuario = obtenerSesion();

  if (!usuario) {
    const error = new Error("Tenés que iniciar sesión para realizar esta operación.");
    error.status = 401;
    throw error;
  }

  if (usuario.role !== ROLES.ADMIN) {
    const error = new Error("No tenés permisos de administrador para realizar esta operación.");
    error.status = 403;
    throw error;
  }

  return usuario;
}

// Solo para mostrar las cuentas en la pantalla de login (demo)
export const CUENTAS_PARA_MOSTRAR = CUENTAS_DEMO.map((cuenta) => ({
  username: cuenta.username,
  password: cuenta.password,
  role: cuenta.role,
}));
