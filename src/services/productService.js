import { apiRequest, urlImagen } from "./apiClient";
import { normalizarCategoria } from "./categoryService";
import { normalizarTag } from "./tagService";
import { validarId } from "./validaciones";

// Forma interna de un producto (siempre igual, aunque la API omita campos):
// { id, title, description, price, category_id, category, pictures: [urls], tags: [{id,title}] }
export function normalizarProducto(producto) {
  return {
    id: producto.id,
    title: producto.title,
    description: producto.description ?? "",
    price: Number(producto.price),
    category_id: producto.category_id ?? null,
    category: producto.category ? normalizarCategoria(producto.category) : null,
    pictures: (producto.pictures ?? []).map(urlImagen).filter(Boolean),
    tags: (producto.tags ?? []).map(normalizarTag),
  };
}

/**
 * Lista de productos.
 * La API solo filtra por categoría; búsqueda, tags y orden se hacen en el frontend.
 * @param {object} opciones { categoryId, delay (segundos, para probar el "cargando"), signal }
 */
export async function getProducts({ categoryId, delay, signal } = {}) {
  const productos = await apiRequest("/products/", {
    params: { limit: 1000, category_id: categoryId, delay },
    signal,
  });
  return productos.map(normalizarProducto);
}

export async function getProductById(id, { signal } = {}) {
  const idValido = validarId(id, "Producto");
  const producto = await apiRequest(`/products/${idValido}`, { signal });
  return normalizarProducto(producto);
}
