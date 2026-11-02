import { useEffect, useState } from 'react'
import { TemaContext } from './useTema'

// Nombre con el que guardamos el tema elegido en el localStorage del navegador
const CLAVE = 'tema'

function leerTemaGuardado() {
  try {
    return localStorage.getItem(CLAVE) === 'oscuro' ? 'oscuro' : 'claro'
  } catch {
    return 'claro'
  }
}

// ThemeProvider envuelve la app: guarda el tema y lo aplica con la clase "dark".
// No tocamos el DOM a mano (nada de document.classList): React pone la clase en este <div>.
export function ThemeProvider({ children }) {
  const [tema, setTema] = useState(leerTemaGuardado)

  // Cada vez que cambia el tema, lo guardamos (así se recuerda al recargar)
  useEffect(() => {
    localStorage.setItem(CLAVE, tema)
  }, [tema])

  function cambiarTema() {
    setTema(tema === 'claro' ? 'oscuro' : 'claro')
  }

  return (
    <TemaContext value={{ tema, cambiarTema }}>
      {/* text-texto: el color de letra por defecto para todo lo que no tenga uno propio */}
      <div className={`${tema === 'oscuro' ? 'dark' : ''} text-texto`}>{children}</div>
    </TemaContext>
  )
}
