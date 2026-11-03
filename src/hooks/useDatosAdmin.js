// Datos del panel admin: carga productos, categorías y tags, y ejecutar() corre un alta, edición o baja,
// muestra el aviso y recarga las listas.
import { useEffect, useState } from 'react'
import { getProducts } from '../services/productService'
import { getCategories } from '../services/categoryService'
import { getTags } from '../services/tagService'
import { esCancelacion } from '../services/apiClient'

export function useDatosAdmin() {
  const [datos, setDatos] = useState({ productos: [], categorias: [], tags: [] })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const opciones = { signal: controller.signal }

    Promise.all([getProducts(opciones), getCategories(opciones), getTags(opciones)])
      .then(([productos, categorias, tags]) => {
        setDatos({ productos, categorias, tags })
        setError('')
      })
      .catch((err) => {
        if (esCancelacion(err)) return
        setError(err.message)
      })
      .finally(() => {
        if (!controller.signal.aborted) setCargando(false)
      })

    return () => controller.abort()
  }, [intento])

  function recargar() {
    setIntento((n) => n + 1)
  }

  async function ejecutar(accion, textoOk) {
    setAviso(null)
    try {
      await accion()
      setAviso({ tipo: 'ok', texto: textoOk })
      recargar()
      return true
    } catch (err) {
      setAviso({ tipo: 'error', texto: err.message })
      return false
    }
  }

  return { ...datos, cargando, error, recargar, ejecutar, aviso, setAviso }
}
