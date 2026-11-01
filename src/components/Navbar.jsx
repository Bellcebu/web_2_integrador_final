import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Estrella from './Estrella'

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

function Navbar({ cantidadCarrito = 0, usuario = null, onLogout }) {
  const [abierta, setAbierta] = useState(window.innerWidth >= 768)

  return (
    <aside
      className={`relative flex flex-col h-full bg-white border-r border-slate-200 p-4 whitespace-nowrap transition-all ${abierta ? 'w-64' : 'w-20'
        }`}
    >
      <button
        onClick={() => setAbierta(!abierta)}
        className="absolute -right-3 top-6 w-6 h-6 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900"
        aria-label={abierta ? 'Cerrar menú' : 'Abrir menú'}
      >
        {abierta ? '‹' : '›'}
      </button>

      <div className={`flex items-center mb-6 ${abierta ? 'justify-between' : 'justify-center'}`}>
        {abierta && <p className="text-xl font-black">Urban Store</p>}

        <div className="relative w-12 h-12 flex items-center justify-center">
          <Estrella className="absolute inset-0 w-full h-full" />
          {!abierta && <span className="relative mt-1 text-[10px] font-black text-slate-900">US</span>}
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            title={item.label}
            className={({ isActive }) =>
              isActive
                ? 'flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 font-semibold'
                : 'flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100'
            }
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
            {abierta && item.label}
            {abierta && item.to === '/carrito' && cantidadCarrito > 0 && (
              <span className="ml-auto px-2 rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                {cantidadCarrito}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-4">
        {abierta && (
          <div className="rounded-2xl border border-slate-200 p-4 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-linear-to-br from-sky-300 via-violet-300 to-pink-300" />
            <p className="text-xs text-slate-500">Pagando con transferencia</p>
            <p className="font-bold text-slate-900 mb-3">15% OFF en toda la tienda</p>
            <Link
              to="/productos"
              className="block py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700"
            >
              Ver productos
            </Link>
          </div>
        )}

        <div className="border-t border-slate-200 pt-4">
          {usuario ? (
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                {usuario[0]}
              </span>
              {abierta && (
                <div>
                  <p className="text-sm font-semibold text-slate-900">{usuario}</p>
                  <button onClick={onLogout} className="text-xs text-slate-500 hover:text-red-600">
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
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
