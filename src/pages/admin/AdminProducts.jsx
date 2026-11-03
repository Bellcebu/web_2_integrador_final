// /admin/productos: tabla y formulario de productos con categoría, tags e imágenes.
import { useState } from 'react'
import {
  createProduct,
  deleteProduct,
  MAX_MB_IMAGEN,
  updateProduct,
  uploadProductPictures,
  validarImagenes,
} from '../../services/productService'
import { useDatosAdmin } from '../../hooks/useDatosAdmin'
import AdminNav from '../../components/admin/AdminNav'
import Aviso from '../../components/admin/Aviso'
import BotonEliminar from '../../components/admin/BotonEliminar'
import Campo from '../../components/admin/Campo'
import Modal from '../../components/admin/Modal'
import Estrella from '../../components/Estrella'
import Loader from '../../components/Loader'
import ErrorMessage from '../../components/ErrorMessage'
import {
  claseBoton,
  claseBotonSecundario,
  claseCampo,
  claseCelda,
  claseEncabezado,
  claseTabla,
} from '../../components/admin/estilos'

const VACIO = { title: '', description: '', price: '', category_id: '', tag_ids: [] }

function validar(form) {
  const errores = {}
  if (form.title.trim() === '') errores.title = 'El nombre es obligatorio.'
  if (form.description.trim() === '') errores.description = 'La descripción es obligatoria.'
  const precio = Number(form.price)
  if (form.price === '') errores.price = 'El precio es obligatorio.'
  else if (!Number.isFinite(precio) || precio <= 0) errores.price = 'El precio tiene que ser mayor a 0.'
  if (form.category_id === '') errores.category_id = 'Elegí una categoría.'
  return errores
}

function AdminProducts() {
  const { productos, categorias, tags, cargando, error, recargar, ejecutar, aviso, setAviso } = useDatosAdmin()
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(VACIO)
  const [archivos, setArchivos] = useState([])
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  if (cargando) return <Loader texto="Cargando productos…" />
  if (error) return <ErrorMessage mensaje={error} onReintentar={recargar} />

  const productoEditado = productos.find((p) => p.id === editando)

  function abrir(producto) {
    setEditando(producto ? producto.id : 'nuevo')
    setForm(
      producto
        ? {
            title: producto.title,
            description: producto.description,
            price: String(producto.price),
            category_id: producto.category_id ? String(producto.category_id) : '',
            tag_ids: producto.tags.map((t) => t.id),
          }
        : VACIO
    )
    setArchivos([])
    setErrores({})
    setAviso(null)
  }

  function cambiar(campo, valor) {
    setForm({ ...form, [campo]: valor })
  }

  function alternarTag(id) {
    const nuevos = form.tag_ids.includes(id) ? form.tag_ids.filter((t) => t !== id) : [...form.tag_ids, id]
    cambiar('tag_ids', nuevos)
  }

  function elegirArchivos(e) {
    const elegidos = Array.from(e.target.files)
    if (elegidos.length === 0) return setArchivos([])
    try {
      validarImagenes(elegidos)
      setArchivos(elegidos)
      setErrores({ ...errores, imagenes: undefined })
    } catch (err) {
      setArchivos([])
      setErrores({ ...errores, imagenes: err.message })
    }
  }

  async function guardar(e) {
    e.preventDefault()
    const nuevosErrores = validar(form)
    if (errores.imagenes) nuevosErrores.imagenes = errores.imagenes
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const esNuevo = editando === 'nuevo'
    const titulo = form.title.trim()

    async function accion() {
      const guardado = esNuevo ? await createProduct(form) : await updateProduct(editando, form)
      if (archivos.length === 0) return
      try {
        await uploadProductPictures(guardado.id, archivos)
      } catch (err) {
        setEditando(guardado.id)
        recargar()
        throw new Error(`El producto se guardó, pero no se pudieron subir las imágenes. ${err.message}`)
      }
    }

    setGuardando(true)
    const ok = await ejecutar(accion, `Producto "${titulo}" ${esNuevo ? 'creado' : 'actualizado'}.`)
    setGuardando(false)
    if (ok) setEditando(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <AdminNav
        titulo="Productos"
        descripcion={`${productos.length} productos en la tienda.`}
        accion={
          <button onClick={() => abrir(null)} className={claseBoton}>
            + Nuevo producto
          </button>
        }
      />

      {editando === null && <Aviso aviso={aviso} />}

      {productos.length === 0 ? (
        <p className="py-12 text-center text-texto-suave">Todavía no hay productos.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-borde bg-superficie">
          <table className={claseTabla}>
            <thead className="border-b border-borde">
              <tr>
                <th className={claseEncabezado}>Producto</th>
                <th className={claseEncabezado}>Categoría</th>
                <th className={claseEncabezado}>Precio</th>
                <th className={claseEncabezado}>Tags</th>
                <th className={`${claseEncabezado} text-right`}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td className={claseCelda}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-suave">
                        {producto.pictures[0] ? (
                          <img src={producto.pictures[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Estrella className="w-full h-full p-2 opacity-60" />
                        )}
                      </div>
                      <span className="font-semibold">{producto.title}</span>
                    </div>
                  </td>
                  <td className={`${claseCelda} text-texto-suave`}>{producto.category?.title ?? 'Sin categoría'}</td>
                  <td className={`${claseCelda} whitespace-nowrap`}>${producto.price.toLocaleString('es-AR')}</td>
                  <td className={claseCelda}>
                    <div className="flex flex-wrap gap-1">
                      {producto.tags.map((tag) => (
                        <span key={tag.id} className="px-2 py-0.5 rounded-full bg-suave text-xs text-texto-suave">
                          {tag.title}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={`${claseCelda} text-right whitespace-nowrap`}>
                    <button
                      onClick={() => abrir(producto)}
                      className="px-3 py-1.5 rounded-lg text-sm text-texto-suave hover:bg-suave"
                    >
                      Editar
                    </button>
                    <BotonEliminar
                      onConfirmar={() =>
                        ejecutar(() => deleteProduct(producto.id), `Producto "${producto.title}" eliminado.`)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editando !== null && (
        <Modal titulo={editando === 'nuevo' ? 'Nuevo producto' : 'Editar producto'}>
          <form onSubmit={guardar} noValidate className="flex flex-col gap-4">
            <Aviso aviso={aviso?.tipo === 'error' ? aviso : null} />

            <Campo id="prod-nombre" etiqueta="Nombre *" error={errores.title}>
              <input
                id="prod-nombre"
                autoFocus
                value={form.title}
                onChange={(e) => cambiar('title', e.target.value)}
                aria-invalid={Boolean(errores.title)}
                className={claseCampo}
              />
            </Campo>

            <Campo id="prod-descripcion" etiqueta="Descripción *" error={errores.description}>
              <textarea
                id="prod-descripcion"
                rows={3}
                value={form.description}
                onChange={(e) => cambiar('description', e.target.value)}
                aria-invalid={Boolean(errores.description)}
                className={claseCampo}
              />
            </Campo>

            <div className="grid gap-4 sm:grid-cols-2">
              <Campo id="prod-precio" etiqueta="Precio *" error={errores.price}>
                <input
                  id="prod-precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => cambiar('price', e.target.value)}
                  aria-invalid={Boolean(errores.price)}
                  className={claseCampo}
                />
              </Campo>

              <Campo id="prod-categoria" etiqueta="Categoría *" error={errores.category_id}>
                <select
                  id="prod-categoria"
                  value={form.category_id}
                  onChange={(e) => cambiar('category_id', e.target.value)}
                  aria-invalid={Boolean(errores.category_id)}
                  className={claseCampo}
                >
                  <option value="">Elegí una categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </Campo>
            </div>

            <fieldset>
              <legend className="mb-1 text-sm font-semibold text-texto">Tags</legend>
              {tags.length === 0 ? (
                <p className="text-xs text-texto-suave">No hay tags. Creálos en la sección Tags.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => {
                    const elegido = form.tag_ids.includes(tag.id)
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => alternarTag(tag.id)}
                        aria-pressed={elegido}
                        className={`px-3 py-1 rounded-full border text-sm ${
                          elegido
                            ? 'border-violet-500 bg-violet-500 text-white'
                            : 'border-borde text-texto-suave hover:bg-suave'
                        }`}
                      >
                        {tag.title}
                      </button>
                    )
                  })}
                </div>
              )}
            </fieldset>

            <Campo id="prod-imagenes" etiqueta="Imágenes" error={errores.imagenes}>
              {productoEditado?.pictures.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-1">
                  {productoEditado.pictures.map((url) => (
                    <img key={url} src={url} alt="" className="w-14 h-14 rounded-lg object-cover bg-suave" />
                  ))}
                </div>
              )}
              <input
                id="prod-imagenes"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={elegirArchivos}
                className="text-sm text-texto-suave file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-suave file:text-texto"
              />
              <p className="text-xs text-texto-suave">
                JPG, PNG, WEBP o GIF, hasta {MAX_MB_IMAGEN} MB. Se suman a las que ya tiene el producto.
              </p>
            </Campo>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditando(null)} className={claseBotonSecundario}>
                Cancelar
              </button>
              <button type="submit" disabled={guardando} className={claseBoton}>
                {guardando ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default AdminProducts
