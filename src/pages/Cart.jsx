import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import Estrella from '../components/Estrella'

// Carrito: /carrito (la ruta ya está protegida: solo entra quien inició sesión)
function Cart() {
  const { items, quitar, cambiarCantidad, vaciar, cantidadTotal, subtotal } = useCart()

  // Carrito vacío: no hay nada que listar
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <Estrella className="w-16 h-16 opacity-60" />
        <p className="font-bold text-slate-900">Tu carrito está vacío</p>
        <Link to="/productos" className="text-sm text-violet-600 hover:underline">
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-black text-slate-900 mb-6">Mi carrito</h1>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-slate-200">
            <div className="w-16 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-100">
              {item.imagen ? (
                <img src={item.imagen} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <Estrella className="w-full h-full p-3 opacity-60" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link to={`/productos/${item.id}`} className="font-semibold text-slate-900 hover:text-violet-600">
                {item.title}
              </Link>
              <p className="text-sm text-slate-500">${item.price.toLocaleString('es-AR')} c/u</p>
            </div>

            {/* Cambiar cantidad: si baja a 0, cambiarCantidad lo saca del carrito */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100"
                aria-label={`Restar uno de ${item.title}`}
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{item.cantidad}</span>
              <button
                onClick={() => cambiarCantidad(item.id, item.cantidad + 1)}
                className="w-8 h-8 rounded-lg border border-slate-200 hover:bg-slate-100"
                aria-label={`Sumar uno de ${item.title}`}
              >
                +
              </button>
            </div>

            <p className="w-28 text-right font-bold text-slate-900">
              ${(item.price * item.cantidad).toLocaleString('es-AR')}
            </p>

            <button onClick={() => quitar(item.id)} className="text-sm text-slate-400 hover:text-red-600">
              Quitar
            </button>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-200 flex flex-wrap items-center gap-4">
        <button onClick={vaciar} className="text-sm text-slate-500 hover:text-red-600">
          Vaciar carrito
        </button>
        <div className="ml-auto text-right">
          <p className="text-sm text-slate-500">{cantidadTotal} productos</p>
          <p className="text-2xl font-black text-slate-900">${subtotal.toLocaleString('es-AR')}</p>
        </div>
        <Link
          to="/checkout"
          className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-700"
        >
          Ir a pagar
        </Link>
      </div>
    </div>
  )
}

export default Cart
