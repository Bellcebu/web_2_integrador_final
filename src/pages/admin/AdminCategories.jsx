// /admin/categorias: tabla y formulario de categorías. No deja borrar una categoría que tenga productos.
import { useState } from 'react'
import { createCategory, deleteCategory, updateCategory } from '../../services/categoryService'
import { useDatosAdmin } from '../../hooks/useDatosAdmin'
import AdminNav from '../../components/admin/AdminNav'
import Aviso from '../../components/admin/Aviso'
import BotonEliminar from '../../components/admin/BotonEliminar'
import Campo from '../../components/admin/Campo'
import Modal from '../../components/admin/Modal'
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

const VACIO = { title: '', description: '' }

function validar(form, categorias, editando) {
  const errores = {}
  const titulo = form.title.trim()
  if (titulo === '') errores.title = 'El nombre es obligatorio.'
  else if (categorias.some((c) => c.id !== editando && c.title.toLowerCase() === titulo.toLowerCase())) {
    errores.title = 'Ya existe una categoría con ese nombre.'
  }
  if (form.description.trim() === '') errores.description = 'La descripción es obligatoria.'
  return errores
}

function AdminCategories() {
  const { productos, categorias, cargando, error, recargar, ejecutar, aviso, setAviso } = useDatosAdmin()
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  if (cargando) return <Loader texto="Cargando categorías…" />
  if (error) return <ErrorMessage mensaje={error} onReintentar={recargar} />

  function abrir(categoria) {
    setEditando(categoria ? categoria.id : 'nuevo')
    setForm(categoria ? { title: categoria.title, description: categoria.description } : VACIO)
    setErrores({})
    setAviso(null)
  }

  async function guardar(e) {
    e.preventDefault()
    const nuevosErrores = validar(form, categorias, editando)
    setErrores(nuevosErrores)
    if (Object.keys(nuevosErrores).length > 0) return

    const titulo = form.title.trim()
    setGuardando(true)
    const ok =
      editando === 'nuevo'
        ? await ejecutar(() => createCategory(form), `Categoría "${titulo}" creada.`)
        : await ejecutar(() => updateCategory(editando, form), `Categoría "${titulo}" actualizada.`)
    setGuardando(false)
    if (ok) setEditando(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <AdminNav
        titulo="Categorías"
        accion={
          <button onClick={() => abrir(null)} className={claseBoton}>
            + Nueva categoría
          </button>
        }
      />

      {editando === null && <Aviso aviso={aviso} />}

      {categorias.length === 0 ? (
        <p className="py-12 text-center text-texto-suave">Todavía no hay categorías.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-borde bg-superficie">
          <table className={claseTabla}>
            <thead className="border-b border-borde">
              <tr>
                <th className={claseEncabezado}>Nombre</th>
                <th className={claseEncabezado}>Descripción</th>
                <th className={claseEncabezado}>Productos</th>
                <th className={`${claseEncabezado} text-right`}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {categorias.map((categoria) => {
                const cantidad = productos.filter((p) => p.category_id === categoria.id).length
                return (
                  <tr key={categoria.id}>
                    <td className={`${claseCelda} font-semibold`}>{categoria.title}</td>
                    <td className={`${claseCelda} text-texto-suave`}>{categoria.description}</td>
                    <td className={claseCelda}>{cantidad}</td>
                    <td className={`${claseCelda} text-right whitespace-nowrap`}>
                      <button
                        onClick={() => abrir(categoria)}
                        className="px-3 py-1.5 rounded-lg text-sm text-texto-suave hover:bg-suave"
                      >
                        Editar
                      </button>
                      <BotonEliminar
                        motivo={
                          cantidad > 0
                            ? `Tiene ${cantidad} producto(s). Movelos a otra categoría antes de eliminarla.`
                            : ''
                        }
                        onConfirmar={() =>
                          ejecutar(() => deleteCategory(categoria.id), `Categoría "${categoria.title}" eliminada.`)
                        }
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editando !== null && (
        <Modal titulo={editando === 'nuevo' ? 'Nueva categoría' : 'Editar categoría'}>
          <form onSubmit={guardar} noValidate className="flex flex-col gap-4">
            <Aviso aviso={aviso?.tipo === 'error' ? aviso : null} />
            <Campo id="cat-nombre" etiqueta="Nombre *" error={errores.title}>
              <input
                id="cat-nombre"
                autoFocus
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                aria-invalid={Boolean(errores.title)}
                className={claseCampo}
              />
            </Campo>
            <Campo id="cat-descripcion" etiqueta="Descripción *" error={errores.description}>
              <textarea
                id="cat-descripcion"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                aria-invalid={Boolean(errores.description)}
                className={claseCampo}
              />
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

export default AdminCategories
