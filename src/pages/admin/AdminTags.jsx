// /admin/tags: tabla y formulario de tags. Al borrar uno, la API lo saca de sus productos.
import { useState } from 'react'
import { createTag, deleteTag, updateTag } from '../../services/tagService'
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

function AdminTags() {
  const { productos, tags, cargando, error, recargar, ejecutar, aviso, setAviso } = useDatosAdmin()
  const [editando, setEditando] = useState(null)
  const [nombre, setNombre] = useState('')
  const [errorNombre, setErrorNombre] = useState('')
  const [guardando, setGuardando] = useState(false)

  if (cargando) return <Loader texto="Cargando tags…" />
  if (error) return <ErrorMessage mensaje={error} onReintentar={recargar} />

  function abrir(tag) {
    setEditando(tag ? tag.id : 'nuevo')
    setNombre(tag ? tag.title : '')
    setErrorNombre('')
    setAviso(null)
  }

  function cantidadDeProductos(tagId) {
    return productos.filter((p) => p.tags.some((t) => t.id === tagId)).length
  }

  async function guardar(e) {
    e.preventDefault()
    const texto = nombre.trim()
    if (texto === '') return setErrorNombre('El nombre es obligatorio.')
    const repetido = tags.some((t) => t.id !== editando && t.title.toLowerCase() === texto.toLowerCase())
    if (repetido) return setErrorNombre('Ya existe un tag con ese nombre.')

    setGuardando(true)
    const ok =
      editando === 'nuevo'
        ? await ejecutar(() => createTag({ title: texto }), `Tag "${texto}" creado.`)
        : await ejecutar(() => updateTag(editando, { title: texto }), `Tag "${texto}" actualizado.`)
    setGuardando(false)
    if (ok) setEditando(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <AdminNav
        titulo="Tags"
        accion={
          <button onClick={() => abrir(null)} className={claseBoton}>
            + Nuevo tag
          </button>
        }
      />

      {editando === null && <Aviso aviso={aviso} />}

      {tags.length === 0 ? (
        <p className="py-12 text-center text-texto-suave">Todavía no hay tags.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-borde bg-superficie">
          <table className={claseTabla}>
            <thead className="border-b border-borde">
              <tr>
                <th className={claseEncabezado}>Nombre</th>
                <th className={claseEncabezado}>Productos</th>
                <th className={`${claseEncabezado} text-right`}>Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borde">
              {tags.map((tag) => {
                const cantidad = cantidadDeProductos(tag.id)
                return (
                  <tr key={tag.id}>
                    <td className={`${claseCelda} font-semibold`}>{tag.title}</td>
                    <td className={claseCelda}>{cantidad}</td>
                    <td className={`${claseCelda} text-right whitespace-nowrap`}>
                      <button
                        onClick={() => abrir(tag)}
                        className="px-3 py-1.5 rounded-lg text-sm text-texto-suave hover:bg-suave"
                      >
                        Editar
                      </button>
                      <BotonEliminar
                        detalle={cantidad > 0 ? `Se quita de ${cantidad} producto(s).` : ''}
                        onConfirmar={() => ejecutar(() => deleteTag(tag.id), `Tag "${tag.title}" eliminado.`)}
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
        <Modal titulo={editando === 'nuevo' ? 'Nuevo tag' : 'Editar tag'}>
          <form onSubmit={guardar} noValidate className="flex flex-col gap-4">
            <Aviso aviso={aviso?.tipo === 'error' ? aviso : null} />
            <Campo id="tag-nombre" etiqueta="Nombre *" error={errorNombre}>
              <input
                id="tag-nombre"
                autoFocus
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                aria-invalid={errorNombre !== ''}
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

export default AdminTags
