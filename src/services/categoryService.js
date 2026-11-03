// Categorías: listar, buscar por id, crear, editar y borrar (estas tres solo admin).
import { apiRequest, urlImagen } from "./apiClient";
import { exigirAdmin } from "./authService";
import { validarId, validarTexto } from "./validaciones";

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

function armarCategoria(datos) {
  return {
    title: validarTexto(datos.title, "Nombre"),
    description: validarTexto(datos.description, "Descripción"),
  };
}

export async function createCategory(datos) {
  exigirAdmin();
  const categoria = await apiRequest("/categories/", { method: "POST", body: armarCategoria(datos) });
  return normalizarCategoria(categoria);
}

export async function updateCategory(id, datos) {
  exigirAdmin();
  const idValido = validarId(id, "Categoría");
  const categoria = await apiRequest(`/categories/${idValido}`, {
    method: "PUT",
    body: armarCategoria(datos),
  });
  return normalizarCategoria(categoria);
}

export async function deleteCategory(id) {
  exigirAdmin();
  const idValido = validarId(id, "Categoría");
  await apiRequest(`/categories/${idValido}`, { method: "DELETE" });
}
