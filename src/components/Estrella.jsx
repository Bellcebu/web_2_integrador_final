// La estrella del logo, con el degradé de la tienda (celeste → violeta → rosa).
// Se usa en el Navbar y en el Loader. El tamaño y la posición llegan por "className".
// Si "animada" es true, la estrella queda quieta pero los colores giran por dentro.
function Estrella({ className = '', animada = false }) {
  // Cada versión necesita su propio id: si no, el logo usaría el degradé animado (o al revés)
  const idDegrade = animada ? 'degrade-estrella-animado' : 'degrade-estrella'

  return (
    <svg className={className} viewBox="0 0 24 24" fill={`url(#${idDegrade})`}>
      <defs>
        <linearGradient id={idDegrade} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="50%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#f9a8d4" />
          {animada && (
            <animateTransform
              attributeName="gradientTransform"
              type="rotate"
              from="0 0.5 0.5"
              to="360 0.5 0.5"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>
      <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
    </svg>
  )
}

export default Estrella
