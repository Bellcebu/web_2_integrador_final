import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CUENTAS_PARA_MOSTRAR } from "../services/authService";

function Login() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destino = location.state?.from;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function manejarSubmit(evento) {
    evento.preventDefault();
    setError("");

    if (username.trim() === "" || password === "") {
      setError("Completá usuario y contraseña.");
      return;
    }

    try {
      const usuario = login(username, password);
      // Si venía de una ruta protegida, vuelve ahí; si no, según el rol
      const siguiente = destino ?? (usuario.role === "admin" ? "/admin" : "/");
      navigate(siguiente, { replace: true });
    } catch (errorLogin) {
      setError(errorLogin.message);
    }
  }

  function completarCuenta(cuenta) {
    setUsername(cuenta.username);
    setPassword(cuenta.password);
    setError("");
  }

  // Si ya hay sesión, no tiene sentido mostrar el formulario
  if (user && !destino) {
    return (
      <section className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-black text-slate-900">Ya iniciaste sesión</h1>
        <p className="mt-2 text-slate-600">
          Estás conectado como <strong>{user.nombre}</strong> ({user.role}).
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
            Ir al inicio
          </Link>
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-lg border border-slate-300 font-semibold hover:bg-slate-50"
          >
            Cerrar sesión
          </button>
        </div>
      </section>
    );
  }

  if (user && destino) {
    return <Navigate to={destino} replace />;
  }

  return (
    <section className="max-w-md mx-auto px-6 py-16">
      <h1 className="text-3xl font-black text-slate-900">Iniciar sesión</h1>
      {destino && (
        <p className="mt-2 text-sm text-slate-600">Necesitás iniciar sesión para continuar.</p>
      )}

      <form onSubmit={manejarSubmit} className="mt-6 flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-1">
          <label htmlFor="username" className="text-sm font-semibold text-slate-700">
            Usuario
          </label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(evento) => setUsername(evento.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-semibold text-slate-700">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button type="submit" className="py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700">
          Ingresar
        </button>
      </form>

      <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-sm font-semibold text-slate-700">Cuentas de demostración</p>
        <p className="text-xs text-slate-500">Ficticias, solo para probar los roles.</p>
        <ul className="mt-3 flex flex-col gap-2">
          {CUENTAS_PARA_MOSTRAR.map((cuenta) => (
            <li key={cuenta.username}>
              <button
                type="button"
                onClick={() => completarCuenta(cuenta)}
                className="w-full text-left text-sm px-3 py-2 rounded-lg bg-white border border-slate-200 hover:border-blue-400"
              >
                <strong>{cuenta.role}</strong>: {cuenta.username} / {cuenta.password}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Login;
