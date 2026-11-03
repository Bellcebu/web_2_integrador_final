import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/AuthContext'
import { useSincronizarCarrito } from '../hooks/useSincronizarCarrito'
import Estrella from '../components/Estrella'

// Checkout: /checkout (la ruta ya está protegida: solo entra quien inició sesión)
// Es una compra SIMULADA: no se cobra nada ni se guarda ningún pedido.
function Checkout() {
  const { items, vaciar, cantidadTotal, subtotal } = useCart()
  const { user } = useAuth()
  // Antes de confirmar, nos aseguramos de cobrar (simuladamente) los precios actuales
  const aviso = useSincronizarCarrito()
  // Pasa a true cuando el usuario confirma la compra
  const [confirmada, setConfirmada] = useState(false)

  function confirmarCompra() {
    vaciar()
    setConfirmada(true)
  }

  // Primero preguntamos si ya confirmó: después de vaciar(), el carrito queda vacío
  // y no queremos mostrar "carrito vacío" sino el mensaje de gracias.
  if (confirmada) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        <Estrella animada className="w-20 h-20" />
        <p className="text-2xl font-black text-texto">¡Gracias por tu compra, {user?.nombre}!</p>
        <p className="text-sm text-texto-suave">Esta compra es una simulación: no se realizó ningún cobro.</p>
        <Link to="/productos" className="mt-2 text-sm text-violet-600 hover:underline">
          Seguir comprando
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24 text-center">
        {aviso && (
          <p role="status" className="p-3 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200 text-sm">
            {aviso}
          </p>
        )}
        <Estrella className="w-16 h-16 opacity-60" />
        <p className="font-bold text-texto">No hay nada para pagar</p>
        <Link to="/productos" className="text-sm text-violet-600 hover:underline">
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-black text-texto mb-6">Confirmar compra</h1>
      {aviso && (
        <p role="status" className="mb-4 p-3 rounded-xl bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200 text-sm">
          {aviso}
        </p>
      )}

      <div className="p-4 bg-superficie rounded-2xl border border-borde">
        <ul className="divide-y divide-borde">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 py-2 text-sm">
              <span className="text-texto-suave">
                {item.cantidad} × {item.title}
              </span>
              <span className="font-semibold text-texto">
                ${(item.price * item.cantidad).toLocaleString('es-AR')}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t border-borde flex justify-between items-center">
          <span className="text-texto-suave">Total ({cantidadTotal} productos)</span>
          <span className="text-2xl font-black text-texto">${subtotal.toLocaleString('es-AR')}</span>
        </div>
      </div>

      <p className="mt-4 text-xs text-texto-suave">
        Compra simulada: al confirmar no se cobra nada y el carrito se vacía.
      </p>

      <div className="mt-4 flex items-center gap-4">
        <Link to="/carrito" className="text-sm text-texto-suave hover:text-violet-600">
          ← Volver al carrito
        </Link>
        <button
          onClick={confirmarCompra}
          className="ml-auto px-6 py-3 rounded-xl bg-boton text-boton-texto font-semibold hover:bg-boton-hover"
        >
          Confirmar compra
        </button>
      </div>
    </div>
  )
}

export default Checkout
