import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProducts } from '../services/productService'
import { getCategories } from '../services/categoryService'
import { getTags } from '../services/tagService'
import { esCancelacion } from '../services/apiClient'
import { useTema } from '../context/useTema'
import fondoClaro from '../assets/fondo-claro.webp'
import fondoOscuro from '../assets/fondo-oscuro.webp'
import ProductCard from '../components/ProductCard'
import Carrusel from '../components/Carrusel'
import Estrella from '../components/Estrella'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

// Inicio: /
function Home() {
  const navigate = useNavigate()
  const { tema } = useTema()

  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [tags, setTags] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    const opciones = { signal: controller.signal }

    async function cargar() {
      setCargando(true)
      setError('')
      try {
        const [datosProductos, datosCategorias, datosTags] = await Promise.all([
          getProducts(opciones),
          getCategories(opciones),
          getTags(opciones),
        ])
        setProductos(datosProductos)
        setCategorias(datosCategorias)
        setTags(datosTags)
      } catch (err) {
        if (esCancelacion(err)) return
        setError(err.message)
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }

    cargar()
    return () => controller.abort()
  }, [intento])

  // La búsqueda del Home lleva al catálogo con el texto en la URL: /productos?buscar=remera
  function buscar(e) {
    e.preventDefault() // que el formulario no recargue la página
    const texto = busqueda.trim()
    navigate(texto ? `/productos?buscar=${encodeURIComponent(texto)}` : '/productos')
  }

  if (cargando) return <Loader texto="Cargando la tienda…" />
  if (error) {
    return <ErrorMessage mensaje={error} onReintentar={() => setIntento(intento + 1)} />
  }

  // Una sección por cada tag, solo si tiene productos (si no hay tags, no se muestra ninguna)
  // Destacados: los productos con un tag que diga "Destacado". Si todavía no existe, los primeros 5.
  const conTagDestacado = productos.filter((p) =>
    p.tags.some((t) => t.title.toLowerCase().includes('destacad'))
  )
  const destacados = conTagDestacado.length > 0 ? conTagDestacado : productos.slice(0, 5)

  // Ofertas: los productos con un tag de "Oferta" o "Promoción". Si todavía no hay, los 8 más baratos.
  // Ordenamos una COPIA ([...productos]) para no modificar el estado.
  const conTagOferta = productos.filter((p) =>
    p.tags.some((t) => /oferta|promo/i.test(t.title))
  )
  const ofertas =
    conTagOferta.length > 0
      ? conTagOferta.slice(0, 8)
      : [...productos].sort((a, b) => a.price - b.price).slice(0, 8)

  const secciones = tags
    .map((tag) => ({
      tag,
      productos: productos.filter((p) => p.tags.some((t) => t.id === tag.id)),
    }))
    .filter((seccion) => seccion.productos.length > 0)

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col gap-12">
      {/* Bienvenida + búsqueda. El fondo es una imagen distinta según el tema. */}
      <section
        style={{ backgroundImage: `url(${tema === 'oscuro' ? fondoOscuro : fondoClaro})` }}
        className="rounded-3xl bg-cover bg-center border border-borde p-8 flex flex-col md:flex-row md:items-center gap-6"
      >
        <Estrella className="w-20 h-20 shrink-0" />
        <div className="flex-1">
          <h1 className="text-3xl font-black text-texto">Urban Store</h1>
          <p className="text-texto-suave">Ropa urbana para todos los días.</p>
        </div>
        <form onSubmit={buscar} className="flex gap-2 md:w-96">
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="¿Qué estás buscando?"
            className="flex-1 px-3 py-2 rounded-lg border border-borde bg-superficie/70 text-sm focus:outline-none focus:border-violet-400"
          />
          <button className="px-4 py-2 rounded-lg bg-boton text-boton-texto text-sm font-semibold hover:bg-boton-hover">
            Buscar
          </button>
        </form>
      </section>

      {/* Carrusel de destacados */}
      <Carrusel productos={destacados} />

      {/* Categorías: cada una lleva al catálogo ya filtrado */}
      {categorias.length > 0 && (
        <section>
          <h2 className="text-xl font-black text-texto mb-4">Categorías</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categorias.map((categoria) => {
              // La API no trae foto de categoría: usamos la suya o la de algún producto de esa categoría
              const foto =
                categoria.picture ??
                productos.find((p) => p.category_id === categoria.id)?.pictures[0]
              return (
                <Link
                  key={categoria.id}
                  to={`/productos?categoria=${categoria.id}`}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-suave"
                >
                  {foto ? (
                    <img
                      src={foto}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Estrella className="w-full h-full p-8 opacity-50" />
                  )}
                  <span className="absolute inset-x-0 bottom-0 p-2 bg-linear-to-t from-black/60 to-transparent text-white font-bold text-sm">
                    {categoria.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Secciones por tag (por ejemplo "Promoción"), hasta 4 productos cada una */}
      {secciones.map(({ tag, productos: delTag }) => (
        <section key={tag.id}>
          <h2 className="text-xl font-black text-texto mb-4">{tag.title}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {delTag.slice(0, 4).map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
      ))}

      {/* Ofertas: siempre hay algo para ver, aunque todavía no haya tags */}
      {ofertas.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-texto">Ofertas</h2>
            <Link to="/productos?orden=menor" className="text-sm text-violet-600 hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ofertas.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
