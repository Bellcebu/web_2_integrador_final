// Proxy de Vite: el navegador pide /api/... y Vite lo reenvía a la API agregando el token del .env.
// API_TOKEN no tiene prefijo VITE_, así que nunca llega al código del navegador.
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.API_URL || 'https://ecommerce.fedegonzalez.com'

  if (!env.API_TOKEN) {
    console.warn('\n⚠️  Falta API_TOKEN en el archivo .env (copiá .env.example a .env)\n')
  }

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
    server: { proxy },
    preview: { proxy },
  }
})
