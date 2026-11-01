// Cliente HTTP común a todos los servicios.
// Todas las peticiones van a /api/... y el proxy de Vite (vite.config.js)
// las reenvía a la API agregando el token. El token NUNCA está en este código.

const BASE_URL = "/api";

// Las imágenes son públicas y la API las devuelve como ruta relativa (/uploads/...)
export const API_ORIGIN = "https://ecommerce.fedegonzalez.com";

// Error con información extra para que la interfaz pueda distinguir casos:
// tipo: "red" | "no-autorizado" | "no-encontrado" | "validacion" | "servidor"
export class ApiError extends Error {
  constructor(mensaje, { status = 0, tipo = "servidor" } = {}) {
    super(mensaje);
    this.name = "ApiError";
    this.status = status;
    this.tipo = tipo;
  }
}

// Cuando un componente se desmonta cancelamos el fetch con AbortController.
// Ese "error" no hay que mostrarlo: se ignora.
export function esCancelacion(error) {
  return error?.name === "AbortError";
}

// Convierte "/uploads/foto.jpg" en una URL completa. Deja igual las que ya son completas.
export function urlImagen(ruta) {
  if (!ruta) return null;
  if (/^https?:\/\//.test(ruta)) return ruta;
  return `${API_ORIGIN}${ruta.startsWith("/") ? "" : "/"}${ruta}`;
}

// FastAPI devuelve "detail" como texto o como lista de errores de validación
function leerDetalle(cuerpo) {
  const detalle = cuerpo?.detail;
  if (typeof detalle === "string") return detalle;
  if (Array.isArray(detalle)) {
    return detalle.map((item) => `${item.loc?.at(-1) ?? "campo"}: ${item.msg}`).join(" · ");
  }
  return "";
}

function errorSegunStatus(status, detalle) {
  if (status === 401 || status === 403) {
    return new ApiError("No autorizado para acceder a la API. Revisá el token del archivo .env.", {
      status,
      tipo: "no-autorizado",
    });
  }
  if (status === 404) {
    return new ApiError(detalle || "El recurso solicitado no existe.", { status, tipo: "no-encontrado" });
  }
  if (status === 422) {
    return new ApiError(`Datos inválidos. ${detalle}`.trim(), { status, tipo: "validacion" });
  }
  if (status >= 500) {
    return new ApiError("El servidor no está respondiendo. Intentá de nuevo en unos minutos.", {
      status,
      tipo: "servidor",
    });
  }
  return new ApiError(detalle || `Error inesperado (HTTP ${status}).`, { status });
}

/**
 * Hace una petición a la API.
 * @param {string} endpoint  Ej: "/products/" o "/products/12" (los listados terminan en "/")
 * @param {object} opciones  { method, body, params, signal }
 */
export async function apiRequest(endpoint, { method = "GET", body, params, signal } = {}) {
  let url = `${BASE_URL}${endpoint}`;

  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([clave, valor]) => {
      if (valor !== undefined && valor !== null && valor !== "") query.set(clave, valor);
    });
    if (query.size > 0) url += `?${query}`;
  }

  const opciones = { method, signal, headers: { Accept: "application/json" } };
  if (body !== undefined) {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(body);
  }

  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch (error) {
    if (esCancelacion(error)) throw error; // cancelado a propósito: no es un error real
    throw new ApiError("No se pudo conectar con el servidor. Revisá tu conexión a internet.", {
      tipo: "red",
    });
  }

  // El cuerpo puede venir vacío o no ser JSON (por ejemplo un error del proxy)
  const texto = await respuesta.text();
  let cuerpo = null;
  try {
    cuerpo = texto ? JSON.parse(texto) : null;
  } catch {
    cuerpo = null;
  }

  if (!respuesta.ok) {
    throw errorSegunStatus(respuesta.status, leerDetalle(cuerpo));
  }

  return cuerpo;
}
