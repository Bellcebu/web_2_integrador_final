import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="max-w-md mx-auto px-6 py-20 text-center">
      <p className="text-6xl font-black text-violet-600">404</p>
      <h1 className="mt-4 text-2xl font-black text-texto">Página no encontrada</h1>
      <p className="mt-2 text-texto-suave">La dirección que buscás no existe.</p>
      <Link
        to="/"
        className="inline-block mt-6 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
      >
        Volver al inicio
      </Link>
    </section>
  );
}

export default NotFound;
