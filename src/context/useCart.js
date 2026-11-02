import { createContext, useContext } from 'react'

// La "pizarra" del carrito: cualquier componente puede leerla o modificarla.
// Está en un archivo aparte porque CartContext.jsx solo puede exportar componentes (regla de ESLint).
export const CartContext = createContext()

// Atajo para usar el carrito desde cualquier componente: const { items, agregar } = useCart()
export function useCart() {
  return useContext(CartContext)
}
