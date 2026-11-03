// Botón "Eliminar" que pide confirmación. Si recibe "motivo", queda deshabilitado y lo explica.
import { useState } from 'react'

function BotonEliminar({ onConfirmar, detalle = '', motivo = '' }) {
  const [confirmando, setConfirmando] = useState(false)
  const [borrando, setBorrando] = useState(false)

  async function confirmar() {
    setBorrando(true)
    const borrado = await onConfirmar()
    if (!borrado) {
      setBorrando(false)
      setConfirmando(false)
    }
  }

  if (motivo) {
    return (
      <span title={motivo} className="px-3 py-1.5 text-sm text-texto-suave opacity-50 cursor-not-allowed">
        Eliminar
      </span>
    )
  }

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
      >
        Eliminar
      </button>
    )
  }

  return (
    <span className="inline-flex flex-wrap items-center justify-end gap-2 text-sm">
      <span className="text-texto">
        ¿Eliminar?{detalle && <span className="block text-xs text-texto-suave">{detalle}</span>}
      </span>
      <button
        type="button"
        onClick={confirmar}
        disabled={borrando}
        className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
      >
        {borrando ? 'Eliminando…' : 'Sí'}
      </button>
      <button
        type="button"
        onClick={() => setConfirmando(false)}
        disabled={borrando}
        className="px-3 py-1.5 rounded-lg border border-borde text-texto-suave hover:bg-suave"
      >
        No
      </button>
    </span>
  )
}

export default BotonEliminar
