// Cliente HTTP de todos los servicios: arma la URL, hace el fetch a /api (el proxy de Vite agrega el token)
// y convierte las respuestas de error en un ApiError con un tipo: red, no-autorizado, no-encontrado, validacion o servidor.

const BASE_URL = "/api";

export const API_ORIGIN = "https://ecommerce.fedegonzalez.com";

export class ApiError extends Error {
  constructor(mensaje, { status = 0, tipo = "servidor" } = {}) {
    super(mensaje);
    this.name = "ApiError";
    this.status = status;
    this.tipo = tipo;
  }
}

export function esCancelacion(error) {
  return error?.name === "AbortError";
}

export function urlImagen(ruta) {
  if (!ruta) return null;
  if (/^https?:\/\//.test(ruta)) return ruta;
  return `${API_ORIGIN}${ruta.startsWith("/") ? "" : "/"}${ruta}`;
}

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
  if (body instanceof FormData) {
    opciones.body = body;
  } else if (body !== undefined) {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(body);
  }

  let respuesta;
  try {
    respuesta = await fetch(url, opciones);
  } catch (error) {
    if (esCancelacion(error)) throw error;
    throw new ApiError("No se pudo conectar con el servidor. Revisá tu conexión a internet.", {
      tipo: "red",
    });
  }

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
