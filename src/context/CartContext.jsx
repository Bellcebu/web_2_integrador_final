import { useEffect, useState } from 'react'
import { CartContext } from './useCart'
import { useAuth } from './AuthContext'

// Cada usuario tiene su propio carrito en localStorage: "carrito:cliente", "carrito:admin"...
// El visitante no tiene carrito (para comprar hay que iniciar sesión).
function claveDe(user) {
  return user ? `carrito:${user.username}` : null
}

// Lee el carrito guardado. Si no hay nada (o está roto), arranca vacío.
function leerCarritoGuardado(clave) {
  if (!clave) return []
  try {
    const guardado = localStorage.getItem(clave)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

// CartProvider envuelve la app y guarda el carrito para todos los componentes de adentro
export function CartProvider({ children }) {
  const { user } = useAuth()
  const clave = claveDe(user)

  // Guardamos de quién es el carrito ("clave") junto con sus productos.
  // Cada producto: { id, title, price, imagen, cantidad }
  const [carrito, setCarrito] = useState(() => ({ clave, items: leerCarritoGuardado(clave) }))

  // Si cambió el usuario (login / logout), cargamos SU carrito.
  // Es el patrón de React para "ajustar el estado cuando cambia un dato": se hace durante el render.
  if (carrito.clave !== clave) {
    setCarrito({ clave, items: leerCarritoGuardado(clave) })
  }

  const items = carrito.items

  // Cada vez que el carrito cambia, lo guardamos en localStorage (solo si hay usuario)
  useEffect(() => {
    if (carrito.clave) localStorage.setItem(carrito.clave, JSON.stringify(carrito.items))
  }, [carrito])

  // Reemplaza la lista de productos del carrito actual (siempre con una lista NUEVA)
  function setItems(nuevosItems) {
    setCarrito((actual) => ({ ...actual, items: nuevosItems }))
  }

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

  /**
   * El carrito guarda una copia del producto (título, precio, imagen).
   * Si el admin lo editó o lo borró, esa copia quedó vieja: la actualizamos con el catálogo actual.
   * Devuelve qué cambió, para poder avisarle al usuario.
   */
  function actualizarConCatalogo(productosActuales) {
    const porId = new Map(productosActuales.map((producto) => [producto.id, producto]))

    // Se calcula sobre el estado MÁS RECIENTE (actual), porque esto se llama
    // después de un fetch y mientras tanto el carrito pudo cambiar.
    setCarrito((actual) => {
      const actualizados = actual.items
        .filter((item) => porId.has(item.id))
        .map((item) => {
          const producto = porId.get(item.id)
          return { ...item, title: producto.title, price: producto.price, imagen: producto.pictures[0] }
        })
      // Si nada cambió devolvemos el mismo estado: React no re-renderiza ni guarda de nuevo
      return JSON.stringify(actualizados) === JSON.stringify(actual.items)
        ? actual
        : { ...actual, items: actualizados }
    })

    return {
      eliminados: items.filter((item) => !porId.has(item.id)),
      conPrecioNuevo: items.filter(
        (item) => porId.has(item.id) && porId.get(item.id).price !== item.price
      ),
    }
  }

  // No son useState: se calculan a partir de "items" cada vez que el carrito cambia
  const cantidadTotal = items.reduce((total, item) => total + item.cantidad, 0)
  const subtotal = items.reduce((total, item) => total + item.price * item.cantidad, 0)

  return (
    <CartContext
      value={{
        items,
        agregar,
        quitar,
        cambiarCantidad,
        vaciar,
        actualizarConCatalogo,
        cantidadTotal,
        subtotal,
      }}
    >
      {children}
    </CartContext>
  )
}
