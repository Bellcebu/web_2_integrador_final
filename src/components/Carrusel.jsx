import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTema } from '../context/useTema'
import fondoClaro from '../assets/fondo-claro.webp'
import fondoOscuro from '../assets/fondo-oscuro.webp'
import Estrella from './Estrella'

// Cada cuánto pasa solo al siguiente producto (en milisegundos)
const INTERVALO = 5000

// Carrusel de productos destacados: muestra uno por vez y se desliza de costado
function Carrusel({ productos }) {
  const { tema } = useTema()
  // Posición del producto que se está mostrando (0 = el primero)
  const [indice, setIndice] = useState(0)
  const cantidad = productos.length

  // Pasa solo al siguiente cada INTERVALO. El "return" limpia el temporizador
  // cuando el componente se va de la pantalla (o cuando cambia "indice").
  useEffect(() => {
    if (cantidad < 2) return
    const temporizador = setTimeout(() => {
      setIndice((indice + 1) % cantidad)
    }, INTERVALO)
    return () => clearTimeout(temporizador)
  }, [indice, cantidad])

  if (cantidad === 0) return null

  // El "%" hace que después del último vuelva al primero (y antes del primero, al último)
  function anterior() {
    setIndice((indice - 1 + cantidad) % cantidad)
  }
  function siguiente() {
    setIndice((indice + 1) % cantidad)
  }

  const fondo = tema === 'oscuro' ? fondoOscuro : fondoClaro

  return (
    <section className="relative rounded-3xl overflow-hidden border border-borde">
      {/* La "cinta" con todos los productos en fila: se corre a la izquierda según el índice */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${indice * 100}%)` }}
      >
        {productos.map((producto) => (
          <div
            key={producto.id}
            style={{ backgroundImage: `url(${fondo})` }}
            className="w-full shrink-0 bg-cover bg-center flex flex-col-reverse md:flex-row items-center gap-6 pl-20 pr-16 md:pl-32 md:pr-24 py-8 md:h-80"
          >
            <div className="flex-1 flex flex-col items-start gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-300">
                Destacado
              </span>
              <p className="text-sm text-texto-suave">{producto.category?.title}</p>
              <h3 className="text-2xl md:text-3xl font-black text-texto">{producto.title}</h3>
              <p className="text-2xl font-black text-texto">${producto.price.toLocaleString('es-AR')}</p>
              <Link
                to={`/productos/${producto.id}`}
                className="mt-2 px-5 py-2 rounded-xl bg-boton text-boton-texto text-sm font-semibold hover:bg-boton-hover"
              >
                Ver producto
              </Link>
            </div>

            <div className="w-40 md:w-56 aspect-3/4 md:h-full md:aspect-auto shrink-0 rounded-2xl overflow-hidden bg-suave">
              {producto.pictures[0] ? (
                <img src={producto.pictures[0]} alt={producto.title} className="w-full h-full object-cover" />
              ) : (
                <Estrella className="w-full h-full p-10 opacity-60" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Flechas y puntitos: solo si hay más de un producto */}
      {cantidad > 1 && (
        <>
          <button
            onClick={anterior}
            aria-label="Destacado anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-superficie/80 text-texto text-xl hover:bg-superficie"
          >
            ‹
          </button>
          <button
            onClick={siguiente}
            aria-label="Destacado siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-superficie/80 text-texto text-xl hover:bg-superficie"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {productos.map((producto, posicion) => (
              <button
                key={producto.id}
                onClick={() => setIndice(posicion)}
                aria-label={`Ver destacado ${posicion + 1}`}
                className={`h-2 rounded-full transition-all ${
                  posicion === indice ? 'w-6 bg-violet-500' : 'w-2 bg-superficie/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Carrusel
