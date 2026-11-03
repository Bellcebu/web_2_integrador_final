// Ventana para los formularios de crear y editar. Se cierra solo con "Cancelar" para no perder lo escrito.

function Modal({ titulo, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-borde bg-superficie p-6 shadow-xl"
      >
        <h2 id="modal-titulo" className="text-lg font-black text-texto mb-4">
          {titulo}
        </h2>
        {children}
      </div>
    </div>
  )
}

export default Modal
