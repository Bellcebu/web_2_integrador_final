// Mensaje de éxito o error después de crear, editar o borrar.

function Aviso({ aviso }) {
  if (!aviso) return null
  const ok = aviso.tipo === 'ok'

  return (
    <p
      role={ok ? 'status' : 'alert'}
      className={`mb-4 px-4 py-3 rounded-lg border text-sm ${
        ok
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900'
          : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-900'
      }`}
    >
      {aviso.texto}
    </p>
  )
}

export default Aviso
