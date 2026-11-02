import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/useCart";
import Navbar from "./Navbar";
import Footer from "./Footer";

// Estructura común de todas las páginas: sidebar + contenido + footer
function Layout() {
  const { user, logout } = useAuth();
  const { cantidadTotal } = useCart();
  const navigate = useNavigate();

  function cerrarSesion() {
    logout();
    navigate("/");
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Navbar
        usuario={user?.nombre ?? null}
        onLogout={cerrarSesion}
        cantidadCarrito={cantidadTotal}
      />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
