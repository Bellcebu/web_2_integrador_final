import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // El tercer parámetro '' carga TODAS las variables del .env, no solo las VITE_*.
  // API_TOKEN no lleva prefijo VITE_, así que solo la ve este archivo (Node),
  // nunca llega al código que se envía al navegador.
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.API_URL || 'https://ecommerce.fedegonzalez.com'

  if (!env.API_TOKEN) {
    console.warn('\n⚠️  Falta API_TOKEN en el archivo .env (copiá .env.example a .env)\n')
  }

  // Proxy: el navegador pide /api/products/ y Vite lo reenvía a
  // https://ecommerce.fedegonzalez.com/products/ agregando el token.
  const proxy = {
    '/api': {
      target: apiUrl,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
      headers: { Authorization: `Bearer ${env.API_TOKEN}` },
    },
  }

  return {
    plugins: [react(), tailwindcss()],
    server: { proxy }, // npm run dev
    preview: { proxy }, // npm run preview
  }
})
