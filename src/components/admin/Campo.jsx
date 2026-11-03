// Etiqueta + campo del formulario + mensaje de error.

function Campo({ id, etiqueta, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-texto">
        {etiqueta}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export default Campo
