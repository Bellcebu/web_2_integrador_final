import { apiRequest, urlImagen } from "./apiClient";
import { validarId } from "./validaciones";

// Forma interna de una categoría: { id, title, description, picture }
export function normalizarCategoria(categoria) {
  return {
    id: categoria.id,
    title: categoria.title,
    description: categoria.description ?? "",
    picture: urlImagen(categoria.picture),
  };
}

export async function getCategories({ signal } = {}) {
  const categorias = await apiRequest("/categories/", { params: { limit: 1000 }, signal });
  return categorias.map(normalizarCategoria);
}

export async function getCategoryById(id, { signal } = {}) {
  const idValido = validarId(id, "Categoría");
  const categoria = await apiRequest(`/categories/${idValido}`, { signal });
  return normalizarCategoria(categoria);
}
