import { Link } from 'react-router-dom'
import Estrella from './Estrella'

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/productos', label: 'Productos' },
  { to: '/carrito', label: 'Carrito' },
]

function Footer() {
  // El año se calcula solo, así no hay que cambiarlo a mano
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-superficie border-t border-borde">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-3">
          <Estrella className="w-10 h-10" />
          <div>
            <p className="font-black text-texto">Urban Store</p>
            <p className="text-sm text-texto-suave">Ropa urbana para todos los días.</p>
          </div>
        </div>

        <nav className="flex gap-6">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className="text-sm text-texto-suave hover:text-violet-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-borde px-6 py-4 text-center text-xs text-texto-suave">
        <p>© {anio} Urban Store · Trabajo Práctico Integrador – Desarrollo Web 2 – UNTDF</p>
        <p>Castro Carrillo Abril · Prado Alejandro</p>
      </div>
    </footer>
  )
}

export default Footer
