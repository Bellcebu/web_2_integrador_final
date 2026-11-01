import Estrella from './Estrella'

// Se muestra mientras esperamos los datos (por ejemplo, mientras carga el catálogo).
function Loader({ texto = 'Cargando…' }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-3 py-16">
      <Estrella animada className="w-12 h-12" />
      <p className="text-sm text-slate-500">{texto}</p>
    </div>
  )
}

export default Loader
