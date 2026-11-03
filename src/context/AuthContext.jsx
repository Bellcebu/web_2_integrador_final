// Contexto de sesión: guarda el usuario logueado y expone login, logout e isAdmin a toda la app.
import { createContext, useContext, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.obtenerSesion());

  function login(username, password) {
    const usuario = authService.login(username, password);
    setUser(usuario);
    return usuario;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  const valor = {
    user,
    isAdmin: user?.role === authService.ROLES.ADMIN,
    login,
    logout,
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>.");
  }
  return contexto;
}
