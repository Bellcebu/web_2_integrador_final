// Al entrar al Carrito o al Checkout compara el carrito con el catálogo de la API:
// saca los productos que el admin borró, actualiza precios y nombres, y devuelve un aviso con lo que cambió.
import { useEffect, useEffectEvent, useState } from 'react'
import { useCart } from '../context/useCart'
import { getProducts } from '../services/productService'
import { esCancelacion } from '../services/apiClient'

function nombres(lista) {
  return lista.map((item) => item.title).join(', ')
}

export function useSincronizarCarrito() {
  const { items, actualizarConCatalogo } = useCart()
  const [aviso, setAviso] = useState('')
  const hayItems = items.length > 0

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
        setAviso('No se pudieron verificar los precios actuales. Se muestran los últimos guardados.')
      })

    return () => controller.abort()
  }, [hayItems])

  return aviso
}
