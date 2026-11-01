import { createContext, useContext, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Al cargar la página recuperamos la sesión guardada (si existe)
  const [user, setUser] = useState(() => authService.obtenerSesion());

  function login(username, password) {
    const usuario = authService.login(username, password); // lanza Error si falla
    setUser(usuario);
    return usuario;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  const valor = {
    user, // null = visitante · { username, nombre, role }
    isAdmin: user?.role === authService.ROLES.ADMIN,
    login,
    logout,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// El hook vive junto al Provider para que el contrato quede en un solo archivo
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  }
  return contexto;
}
