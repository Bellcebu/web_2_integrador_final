// Cabecera del panel admin: pestañas de secciones, título y botón de acción.
import { NavLink } from 'react-router-dom'

const secciones = [
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/categorias', label: 'Categorías' },
  { to: '/admin/tags', label: 'Tags' },
]

function AdminNav({ titulo, descripcion, accion }) {
  return (
    <header className="mb-6">
      <nav className="flex flex-wrap gap-2 mb-5" aria-label="Secciones de administración">
        {secciones.map((seccion) => (
          <NavLink
            key={seccion.to}
            to={seccion.to}
            className={({ isActive }) =>
              isActive
                ? 'px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300'
                : 'px-3 py-1.5 rounded-full text-sm text-texto-suave hover:bg-suave'
            }
          >
            {seccion.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-texto">{titulo}</h1>
          {descripcion && <p className="text-sm text-texto-suave">{descripcion}</p>}
        </div>
        {accion}
      </div>
    </header>
  )
}

export default AdminNav
