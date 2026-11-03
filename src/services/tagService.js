// Tags: listar, buscar por id, crear, editar y borrar (estas tres solo admin).
import { apiRequest } from "./apiClient";
import { exigirAdmin } from "./authService";
import { validarId, validarTexto } from "./validaciones";

export function normalizarTag(tag) {
  return { id: tag.id, title: tag.title };
}

export async function getTags({ signal } = {}) {
  const tags = await apiRequest("/tags/", { params: { limit: 1000 }, signal });
  return tags.map(normalizarTag);
}

export async function getTagById(id, { signal } = {}) {
  const idValido = validarId(id, "Tag");
  const tag = await apiRequest(`/tags/${idValido}`, { signal });
  return normalizarTag(tag);
}

function armarTag(datos) {
  return { title: validarTexto(datos.title, "Nombre") };
}

export async function createTag(datos) {
  exigirAdmin();
  const tag = await apiRequest("/tags/", { method: "POST", body: armarTag(datos) });
  return normalizarTag(tag);
}

export async function updateTag(id, datos) {
  exigirAdmin();
  const idValido = validarId(id, "Tag");
  const tag = await apiRequest(`/tags/${idValido}`, { method: "PUT", body: armarTag(datos) });
  return normalizarTag(tag);
}

export async function deleteTag(id) {
  exigirAdmin();
  const idValido = validarId(id, "Tag");
  await apiRequest(`/tags/${idValido}`, { method: "DELETE" });
}
