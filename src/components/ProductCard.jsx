import { Link } from 'react-router-dom'
import Estrella from './Estrella'

// Tarjeta de un producto. Toda la tarjeta es un link al detalle: /productos/:id
// "producto" tiene la forma del contrato: { id, title, price, pictures, category, tags }
function ProductCard({ producto }) {
  // Usamos la primera imagen (si el producto no tiene, queda "undefined")
  const imagen = producto.pictures?.[0]

  return (
    <Link
      to={`/productos/${producto.id}`}
      className="group flex flex-col h-full bg-superficie rounded-2xl overflow-hidden border border-borde hover:shadow-lg transition-shadow"
    >
      <div className="relative aspect-3/4 bg-suave overflow-hidden">
        {imagen ? (
          <img
            src={imagen}
            alt={producto.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // Sin imagen: mostramos la estrella de la tienda en su lugar
          <div className="w-full h-full flex items-center justify-center">
            <Estrella className="w-16 h-16 opacity-60" />
          </div>
        )}

        {/* Tags del producto (por ejemplo "Promoción") arriba a la izquierda */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {producto.tags?.map((tag) => (
            <span
              key={tag.id}
              className="px-2 py-0.5 rounded-md bg-superficie/90 text-[10px] font-bold uppercase tracking-wide text-violet-600"
            >
              {tag.title}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1 p-3">
        <p className="text-xs text-texto-suave">{producto.category?.title}</p>
        <p className="font-semibold text-texto line-clamp-2">{producto.title}</p>
        <p className="mt-auto pt-1 text-lg font-black text-texto">
          ${producto.price.toLocaleString('es-AR')}
        </p>
      </div>
    </Link>
  )
}

export default ProductCard
