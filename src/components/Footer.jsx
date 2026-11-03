function Footer() {
  // El año se calcula solo, así no hay que cambiarlo a mano
  const anio = new Date().getFullYear()

  return (
    <footer className="bg-superficie border-t border-borde px-6 py-4 text-center text-xs text-texto-suave">
      <p>© {anio} Urban Store · Trabajo Práctico Integrador – Desarrollo Web 2 – UNTDF</p>
      <p>Castro Carrillo Abril · Prado Alejandro</p>
    </footer>
  )
}

export default Footer
