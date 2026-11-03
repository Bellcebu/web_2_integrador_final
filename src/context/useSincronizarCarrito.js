import { useEffect, useEffectEvent, useState } from 'react'
import { useCart } from './useCart'
import { getProducts } from '../services/productService'
import { esCancelacion } from '../services/apiClient'

function nombres(lista) {
  return lista.map((item) => item.title).join(', ')
}

/**
 * Al entrar al Carrito o al Checkout, compara el carrito con el catálogo actual de la API:
 * - si el admin borró un producto, lo saca del carrito
 * - si el admin cambió el precio o el nombre, lo actualiza
 * Devuelve un aviso (texto) para mostrarle al usuario qué cambió.
 */
export function useSincronizarCarrito() {
  const { items, actualizarConCatalogo } = useCart()
  const [aviso, setAviso] = useState('')
  const hayItems = items.length > 0

  // useEffectEvent: la función ve siempre el carrito más nuevo,
  // pero no hace que el useEffect se vuelva a ejecutar cada vez que el carrito cambia.
  const alRecibirCatalogo = useEffectEvent((productos) => {
    const { eliminados, conPrecioNuevo } = actualizarConCatalogo(productos)
    const mensajes = []
    if (eliminados.length > 0) {
      mensajes.push(`Ya no están disponibles y se quitaron del carrito: ${nombres(eliminados)}.`)
    }
    if (conPrecioNuevo.length > 0) {
      mensajes.push(`Se actualizó el precio de: ${nombres(conPrecioNuevo)}.`)
    }
    setAviso(mensajes.join(' '))
  })

  useEffect(() => {
    if (!hayItems) return
    const controller = new AbortController()

    getProducts({ signal: controller.signal })
      .then(alRecibirCatalogo)
      .catch((err) => {
        if (esCancelacion(err)) return
        // Si falla, el carrito sigue funcionando con los datos que tenía guardados
        setAviso('No se pudieron verificar los precios actuales. Se muestran los últimos guardados.')
      })

    return () => controller.abort()
    // Solo al entrar a la página (hayItems pasa de false a true como mucho una vez)
  }, [hayItems])

  return aviso
}
