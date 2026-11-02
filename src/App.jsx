import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Login from "./pages/Login";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";

// Marcador temporal para las páginas que todavía no están hechas.
// Cuando una página esté lista, se importa y se reemplaza <Pendiente /> por ella.
function Pendiente({ nombre }) {
  return <p className="p-8 text-slate-500">Página «{nombre}» en construcción.</p>;
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Públicas */}
        <Route path="/" element={<Pendiente nombre="Home" />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/productos/:id" element={<Pendiente nombre="Detalle" />} />
        <Route path="/login" element={<Login />} />

        {/* Requieren sesión (cliente o admin) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/carrito" element={<Pendiente nombre="Carrito" />} />
          <Route path="/checkout" element={<Pendiente nombre="Checkout" />} />
        </Route>

        {/* Requieren rol admin */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Pendiente nombre="Panel de administración" />} />
          <Route path="/admin/productos" element={<Pendiente nombre="Admin productos" />} />
          <Route path="/admin/categorias" element={<Pendiente nombre="Admin categorías" />} />
          <Route path="/admin/tags" element={<Pendiente nombre="Admin tags" />} />
        </Route>

        <Route path="/403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
