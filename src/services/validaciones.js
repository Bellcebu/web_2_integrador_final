import { ApiError } from "./apiClient";

// Un ID válido es un entero positivo. Viene como texto desde la URL (useParams),
// por ejemplo /productos/abc no debería ni llegar a la API.
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
