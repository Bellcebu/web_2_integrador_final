import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Estrella from './Estrella'
import { useTema } from '../context/useTema'

const items = [
  {
    to: '/',
    label: 'Inicio',
    icon: 'm2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
  },
  {
    to: '/productos',
    label: 'Productos',
    icon: 'M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z',
  },
  {
    to: '/carrito',
    label: 'Carrito',
    icon: 'M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z',
  },
]

// Solo lo ve el administrador
const itemAdmin = {
  to: '/admin',
  label: 'Administración',
  icon: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
}

function Navbar({ cantidadCarrito = 0, usuario = null, esAdmin = false, onLogout }) {
  const itemsVisibles = esAdmin ? [...items, itemAdmin] : items

  // "fijada": la maneja la flechita (queda abierta aunque saques el mouse)
  const [fijada, setFijada] = useState(window.innerWidth >= 768)
  // "mouseEncima": se abre mientras el mouse está sobre la sidebar
  const [mouseEncima, setMouseEncima] = useState(false)

  // Se ve abierta si alguna de las dos es verdadera
  const abierta = fijada || mouseEncima

  const { tema, cambiarTema } = useTema()

  return (
    <aside
      onMouseEnter={() => setMouseEncima(true)}
      onMouseLeave={() => setMouseEncima(false)}
      className={`relative flex flex-col h-full bg-superficie border-r border-borde p-4 whitespace-nowrap transition-all duration-300 ${abierta ? 'w-64' : 'w-20'
        }`}
    >
      <button
        onClick={() => setFijada(!fijada)}
        className="absolute -right-3 top-6 w-6 h-6 flex items-center justify-center rounded-full bg-superficie border border-borde text-texto-suave hover:text-texto"
        aria-label={fijada ? 'Desfijar menú' : 'Fijar menú abierto'}
      >
        {fijada ? '‹' : '›'}
      </button>

      {/*
        Logo animado: el nombre y el "US" están SIEMPRE en la página (no usamos &&),
        así lo que cambia es su ancho y su opacidad, y "transition" lo hace de a poco.
      */}
      <div className="flex items-center justify-between mb-6">
        <p
          className={`text-xl font-black text-texto overflow-hidden transition-all duration-300 ${
            abierta ? 'max-w-40 opacity-100' : 'max-w-0 opacity-0'
          }`}
        >
          Urban Store
        </p>

        <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
          {/* La estrella gira 72° (una "punta") al abrir: como tiene 5 puntas, termina igual que empezó */}
          <Estrella
            className={`absolute inset-0 w-full h-full transition-transform duration-500 ${
              abierta ? 'rotate-72' : 'rotate-0'
            }`}
          />
          <span
            className={`relative mt-1 text-[10px] font-black text-slate-900 transition-opacity duration-300 ${
              abierta ? 'opacity-0' : 'opacity-100'
            }`}
          >
            US
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {itemsVisibles.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={item.label}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 h-10 px-3 rounded-lg bg-blue-50 text-blue-600 font-semibold dark:bg-blue-950 dark:text-blue-300'
                : 'flex items-center gap-3 h-10 px-3 rounded-lg text-texto-suave hover:bg-suave'
            }
          >
            {/* "relative" para poder ubicar la bolita del carrito encima del ícono */}
            <span className="relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {/* Sidebar cerrada: el número va como bolita sobre el ícono del carrito */}
              {!abierta && item.to === '/carrito' && cantidadCarrito > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-violet-500 text-[10px] font-bold text-white">
                  {cantidadCarrito > 9 ? '9+' : cantidadCarrito}
                </span>
              )}
            </span>
            {abierta && item.label}
            {abierta && item.to === '/carrito' && cantidadCarrito > 0 && (
              <span className="ml-auto px-2 rounded-full bg-suave text-xs font-bold text-texto-suave">
                {cantidadCarrito}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3">
        {/* Botón para cambiar entre tema claro y oscuro */}
        <button
          onClick={cambiarTema}
          title={tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro'}
          className="flex items-center gap-3 h-10 px-3 rounded-lg text-texto-suave hover:bg-suave"
        >
          <span className="w-5 text-center">{tema === 'oscuro' ? '☀️' : '🌙'}</span>
          {abierta && (tema === 'oscuro' ? 'Modo claro' : 'Modo oscuro')}
        </button>

        <div className="border-t border-borde pt-4">
          {usuario ? (
            // Todo el bloque (avatar + nombre) es el botón: tocar en cualquier parte cierra la sesión
            <button
              type="button"
              onClick={onLogout}
              title="Cerrar sesión"
              // px-1: el centro del círculo queda alineado con los íconos del menú, abierto o cerrado
              className="group w-full flex items-center gap-3 px-1 py-2 rounded-lg text-left hover:bg-suave"
            >
              <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {usuario[0]}
              </span>
              {abierta && (
                <span className="flex flex-col justify-center leading-tight">
                  <span className="text-sm font-semibold text-texto">{usuario}</span>
                  <span className="text-xs text-texto-suave group-hover:text-red-600">Cerrar sesión</span>
                </span>
              )}
            </button>
          ) : (
            <Link
              to="/login"
              title="Iniciar sesión"
              className="block py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold text-center hover:bg-blue-700"
            >
              {abierta ? 'Iniciar sesión' : '→'}
            </Link>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Navbar
