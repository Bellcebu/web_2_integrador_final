import { createContext, useContext } from 'react'

// La "pizarra" del tema (claro u oscuro). Igual que useCart.js: va en un archivo aparte
// porque ThemeContext.jsx solo puede exportar componentes (regla de ESLint).
export const TemaContext = createContext()

// Atajo para usar el tema desde cualquier componente: const { tema, cambiarTema } = useTema()
export function useTema() {
  return useContext(TemaContext)
}
