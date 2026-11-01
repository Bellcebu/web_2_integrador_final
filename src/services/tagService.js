import { apiRequest } from "./apiClient";
import { validarId } from "./validaciones";

// Forma interna de un tag: { id, title }
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
