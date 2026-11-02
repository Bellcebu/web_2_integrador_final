import { useEffect, useState } from 'react'
import { CartContext } from './useCart'

// Nombre con el que guardamos el carrito en el localStorage del navegador
const CLAVE = 'carrito'

// Lee el carrito guardado. Si no hay nada (o está roto), arranca vacío.
function leerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

// CartProvider envuelve la app y guarda el carrito para todos los componentes de adentro
export function CartProvider({ children }) {
  // Lista de productos en el carrito. Cada uno: { id, title, price, imagen, cantidad }
  // Arranca con lo que haya guardado (así no se pierde al recargar la página)
  const [items, setItems] = useState(leerCarritoGuardado)

  // Cada vez que "items" cambia, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(items))
  }, [items])

  function agregar(producto) {
    const yaEsta = items.find((item) => item.id === producto.id)

    if (yaEsta) {
      // Ya estaba: armamos una lista nueva donde ese producto tiene 1 más de cantidad
      setItems(
        items.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      )
    } else {
      // No estaba: lista nueva con todo lo anterior + el producto con cantidad 1
      setItems([
        ...items,
        {
          id: producto.id,
          title: producto.title,
          price: producto.price,
          imagen: producto.pictures?.[0],
          cantidad: 1,
        },
      ])
    }
  }

  function quitar(id) {
    // Lista nueva con todos los productos MENOS el que tiene ese id
    setItems(items.filter((item) => item.id !== id))
  }

  function cambiarCantidad(id, cantidad) {
    // Si la cantidad baja a 0 (o menos), directamente lo sacamos del carrito
    if (cantidad < 1) {
      quitar(id)
      return
    }
    setItems(items.map((item) => (item.id === id ? { ...item, cantidad } : item)))
  }

  function vaciar() {
    setItems([])
  }

  // No son useState: se calculan a partir de "items" cada vez que el carrito cambia
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.cantidad, 0)

  return (
    <CartContext
      value={{ items, agregar, quitar, cambiarCantidad, vaciar, cantidadTotal, subtotal }}
    >
      {children}
    </CartContext>
  )
}
