// Se muestra cuando algo falla (por ejemplo, si no se pudo cargar el catálogo).
// "mensaje" explica qué pasó. Si nos pasan "onReintentar", aparece el botón para volver a intentar.
function ErrorMessage({ mensaje = 'Ocurrió un error inesperado.', onReintentar }) {
  return (
    <div role="alert" className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 text-pink-500 text-2xl font-black">
        !
      </div>
      <p className="font-bold text-slate-900">Algo salió mal</p>
      <p className="text-sm text-slate-500">{mensaje}</p>

      {onReintentar && (
        <button
          onClick={onReintentar}
          className="mt-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700"
        >
          Reintentar
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
