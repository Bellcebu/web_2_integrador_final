// Validaciones que usan los servicios antes de llamar a la API: id, textos obligatorios, precio y categoría.
import { ApiError } from "./apiClient";

export function validarId(id, recurso = "Recurso") {
  const numero = Number(id);
  if (!Number.isInteger(numero) || numero <= 0) {
    throw new ApiError(`${recurso} no encontrado: el ID "${id}" no es válido.`, {
      status: 404,
      tipo: "no-encontrado",
    });
  }
  return numero;
}

export function validarTexto(valor, campo) {
  const texto = String(valor ?? "").trim();
  if (texto === "") {
    throw new ApiError(`${campo}: es obligatorio.`, { status: 422, tipo: "validacion" });
  }
  return texto;
}

export function validarPrecio(valor) {
  const precio = Number(valor);
  if (!Number.isFinite(precio) || precio <= 0) {
    throw new ApiError("Precio: tiene que ser un número mayor a 0.", { status: 422, tipo: "validacion" });
  }
  return precio;
}

export function validarCategoria(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError("Categoría: es obligatoria.", { status: 422, tipo: "validacion" });
  }
  return id;
}
