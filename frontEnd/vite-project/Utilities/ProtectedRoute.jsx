import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import toast, { Toaster } from "react-hot-toast";
import React from 'react';

export default function ProtectedRoute({ children }) {
  const { autenticado, cargando } = useAuth();

 // console.log("ProtectedRoute:", { autenticado, cargando });

  if (cargando) {
    return <div className="text-center mt-10">Verificando sesión...</div>;
  }

  if (!autenticado) {
    toast.error("Ruta protegida: Debe iniciar sesión")
    return <Navigate to="/login" replace />;
  }

  return children;
}
