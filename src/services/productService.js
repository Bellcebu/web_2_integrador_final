// Productos: listar, buscar por id, crear, editar, borrar y subir imágenes (las de escritura solo admin).
// normalizarProducto deja siempre la misma forma aunque la API omita campos.
import { ApiError, apiRequest, urlImagen } from "./apiClient";
import { normalizarCategoria } from "./categoryService";
import { normalizarTag } from "./tagService";
import { exigirAdmin } from "./authService";
import { validarCategoria, validarId, validarPrecio, validarTexto } from "./validaciones";

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

function armarProducto(datos) {
  return {
    title: validarTexto(datos.title, "Nombre"),
    description: validarTexto(datos.description, "Descripción"),
    price: validarPrecio(datos.price),
    category_id: validarCategoria(datos.category_id),
    tag_ids: (datos.tag_ids ?? []).map(Number),
  };
}

export async function createProduct(datos) {
  exigirAdmin();
  const producto = await apiRequest("/products/", { method: "POST", body: armarProducto(datos) });
  return normalizarProducto(producto);
}

export async function updateProduct(id, datos) {
  exigirAdmin();
  const idValido = validarId(id, "Producto");
  const producto = await apiRequest(`/products/${idValido}`, {
    method: "PUT",
    body: armarProducto(datos),
  });
  return normalizarProducto(producto);
}

export async function deleteProduct(id) {
  exigirAdmin();
  const idValido = validarId(id, "Producto");
  await apiRequest(`/products/${idValido}`, { method: "DELETE" });
}

const TIPOS_IMAGEN = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_MB_IMAGEN = 5;

export function validarImagenes(archivos) {
  const lista = Array.from(archivos ?? []);
  if (lista.length === 0) {
    throw new ApiError("Elegí al menos una imagen.", { status: 422, tipo: "validacion" });
  }
  lista.forEach((archivo) => {
    if (!TIPOS_IMAGEN.includes(archivo.type)) {
      throw new ApiError(`"${archivo.name}" no es una imagen (JPG, PNG, WEBP o GIF).`, {
        status: 422,
        tipo: "validacion",
      });
    }
    if (archivo.size > MAX_MB_IMAGEN * 1024 * 1024) {
      throw new ApiError(`"${archivo.name}" pesa más de ${MAX_MB_IMAGEN} MB.`, {
        status: 422,
        tipo: "validacion",
      });
    }
  });
  return lista;
}

export async function uploadProductPictures(id, archivos) {
  exigirAdmin();
  const idValido = validarId(id, "Producto");
  const formulario = new FormData();
  validarImagenes(archivos).forEach((archivo) => formulario.append("files", archivo));
  const respuesta = await apiRequest(`/products/${idValido}/pictures`, {
    method: "POST",
    body: formulario,
  });
  return (respuesta?.picture_urls ?? []).map(urlImagen);
}
