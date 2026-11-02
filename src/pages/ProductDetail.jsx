import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../services/productService'
import { esCancelacion } from '../services/apiClient'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/useCart'
import Estrella from '../components/Estrella'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

// Detalle de un producto: /productos/:id
function ProductDetail() {
  // useParams lee la parte variable de la URL: en /productos/1799, id = "1799"
  const { id } = useParams()
  const { user } = useAuth()
  const { agregar } = useCart()
  const navigate = useNavigate()
  const location = useLocation()

  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0)
  // Qué foto se ve en grande (la posición dentro de producto.pictures)
  const [fotoElegida, setFotoElegida] = useState(0)
  const [agregado, setAgregado] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function cargar() {
      setCargando(true)
      setError(null)
      setFotoElegida(0)
      setAgregado(false)
      try {
        const datos = await getProductById(id, { signal: controller.signal })
        setProducto(datos)
      } catch (err) {
        if (esCancelacion(err)) return
        setError(err) // guardamos el error entero para saber su "tipo"
      } finally {
        if (!controller.signal.aborted) setCargando(false)
      }
    }

    cargar()
    return () => controller.abort()
  }, [id, intento]) // si cambia el id de la URL, se vuelve a pedir

  function agregarAlCarrito() {
    // Comprar exige sesión: si es visitante, lo mandamos al login.
    // "from" le dice al login a dónde volver después de iniciar sesión.
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }
    agregar(producto)
    setAgregado(true)
  }

  if (cargando) return <Loader texto="Cargando producto…" />

  if (error) {
    // Un 404 no se arregla reintentando: mostramos el mensaje sin botón
    if (error.tipo === 'no-encontrado') {
      return (
        <div>
          <ErrorMessage mensaje="Producto no encontrado." />
          <p className="text-center -mt-10">
            <Link to="/productos" className="text-sm text-violet-600 hover:underline">
              ← Volver a productos
            </Link>
          </p>
        </div>
      )
    }
    return <ErrorMessage mensaje={error.message} onReintentar={() => setIntento(intento + 1)} />
  }

  const fotoGrande = producto.pictures[fotoElegida]

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Link to="/productos" className="text-sm text-texto-suave hover:text-violet-600">
        ← Volver a productos
      </Link>

      <div className="mt-4 grid md:grid-cols-2 gap-8">
        {/* Imágenes: una grande y las miniaturas para elegir */}
        <div>
          <div className="aspect-3/4 rounded-2xl overflow-hidden bg-suave border border-borde">
            {fotoGrande ? (
              <img src={fotoGrande} alt={producto.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Estrella className="w-20 h-20 opacity-60" />
              </div>
            )}
          </div>

          {producto.pictures.length > 1 && (
            <div className="mt-3 flex gap-2">
              {producto.pictures.map((foto, posicion) => (
                <button
                  key={foto}
                  onClick={() => setFotoElegida(posicion)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border-2 ${
                    posicion === fotoElegida ? 'border-violet-400' : 'border-transparent'
                  }`}
                >
                  <img src={foto} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Información */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-texto-suave">{producto.category?.title}</p>
          <h1 className="text-3xl font-black text-texto">{producto.title}</h1>

          {producto.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {producto.tags.map((t) => (
                <span
                  key={t.id}
                  className="px-2 py-0.5 rounded-md bg-violet-50 dark:bg-violet-950 text-xs font-bold uppercase text-violet-600"
                >
                  {t.title}
                </span>
              ))}
            </div>
          )}

          <p className="text-3xl font-black text-texto">${producto.price.toLocaleString('es-AR')}</p>

          {producto.description && <p className="text-texto-suave leading-relaxed">{producto.description}</p>}

          <button
            onClick={agregarAlCarrito}
            className="mt-2 py-3 rounded-xl bg-boton text-boton-texto font-semibold hover:bg-boton-hover"
          >
            {user ? 'Agregar al carrito' : 'Iniciá sesión para comprar'}
          </button>

          {agregado && (
            <p className="text-sm text-emerald-600">
              ✓ Agregado al carrito.{' '}
              <Link to="/carrito" className="font-semibold underline">
                Ver carrito
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
