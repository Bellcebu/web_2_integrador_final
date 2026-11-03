import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../services/productService'
import { getCategories } from '../services/categoryService'
import { getTags } from '../services/tagService'
import { esCancelacion } from '../services/apiClient'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

const claseCampo =
  'px-3 py-2 rounded-lg border border-borde bg-superficie text-sm text-texto-suave focus:outline-none focus:border-violet-400'

// Catálogo: /productos
function Products() {
  // Datos que llegan de la API
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [tags, setTags] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  // Cada vez que sube este número, el useEffect vuelve a pedir los datos (botón "Reintentar")
  const [intento, setIntento] = useState(0)

  // Los filtros viven en la URL: /productos?buscar=jean&categoria=357&tag=2&orden=menor
  // Así se pueden compartir, el botón "atrás" funciona y el link "Productos" del menú los limpia.
  const [searchParams, setSearchParams] = useSearchParams()
  const busqueda = searchParams.get('buscar') ?? ''
  const categoria = searchParams.get('categoria') ?? ''
  const tag = searchParams.get('tag') ?? ''
  const orden = searchParams.get('orden') ?? ''

  // Cambia un filtro en la URL ('' lo quita). "replace" evita llenar el historial al escribir.
  function cambiarFiltro(nombre, valor) {
    setSearchParams(
      (actuales) => {
        const nuevos = new URLSearchParams(actuales)
        if (valor === '') nuevos.delete(nombre)
        else nuevos.set(nombre, valor)
        return nuevos
      },
      { replace: true }
    )
  }

  useEffect(() => {
    // Sirve para cancelar el pedido si el usuario se va de la página antes de que llegue
    const controller = new AbortController()
    const opciones = { signal: controller.signal }

    async function cargar() {
      setCargando(true)
      setError('')
      try {
        // Pedimos las tres cosas a la vez y esperamos a que lleguen todas
        const [datosProductos, datosCategorias, datosTags] = await Promise.all([
          getProducts(opciones),
          getCategories(opciones),
          getTags(opciones),
        ])
        setProductos(datosProductos)
        setCategorias(datosCategorias)
        setTags(datosTags)
      } catch (err) {
        if (esCancelacion(err)) return // se canceló a propósito: no es un error para mostrar
        setError(err.message)
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }

    cargar()
    return () => controller.abort()
  }, [intento])

  // La lista filtrada NO es un estado: se calcula a partir de los productos y los filtros
  const texto = busqueda.trim().toLowerCase()
  const productosFiltrados = productos.filter(
    (producto) =>
      producto.title.toLowerCase().includes(texto) &&
      (categoria === '' || producto.category_id === Number(categoria)) &&
      (tag === '' || producto.tags.some((t) => t.id === Number(tag)))
  )
  // .filter() ya devolvió una lista nueva, así que ordenarla no modifica el estado "productos"
  if (orden === 'menor') productosFiltrados.sort((a, b) => a.price - b.price)
  if (orden === 'mayor') productosFiltrados.sort((a, b) => b.price - a.price)

  const hayFiltros = busqueda !== '' || categoria !== '' || tag !== '' || orden !== ''

  function limpiarFiltros() {
    setSearchParams({}, { replace: true })
  }

  if (cargando) return <Loader texto="Cargando productos…" />
  if (error) {
    return <ErrorMessage mensaje={error} onReintentar={() => setIntento(intento + 1)} />
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-black text-texto mb-6">Productos</h1>

      {/* Filtros: se pueden combinar entre sí */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="search"
          value={busqueda}
          onChange={(e) => cambiarFiltro('buscar', e.target.value)}
          placeholder="Buscar productos…"
          className={`${claseCampo} flex-1 min-w-48`}
        />

        <select value={categoria} onChange={(e) => cambiarFiltro('categoria', e.target.value)} className={claseCampo}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>

        <select value={tag} onChange={(e) => cambiarFiltro('tag', e.target.value)} className={claseCampo}>
          <option value="">Todos los tags</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        <select value={orden} onChange={(e) => cambiarFiltro('orden', e.target.value)} className={claseCampo}>
          <option value="">Ordenar por precio</option>
          <option value="menor">Menor precio</option>
          <option value="mayor">Mayor precio</option>
        </select>

        {hayFiltros && (
          <button onClick={limpiarFiltros} className="text-sm text-texto-suave hover:text-violet-600">
            Limpiar filtros
          </button>
        )}
      </div>

      <p className="text-sm text-texto-suave mb-4">
        {productosFiltrados.length} de {productos.length} productos
      </p>

      {productosFiltrados.length === 0 ? (
        <p className="py-16 text-center text-texto-suave">
          {productos.length === 0
            ? 'No hay productos para mostrar.'
            : 'No hay productos que coincidan con los filtros.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
