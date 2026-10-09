import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import React from 'react';
import { API_URL } from "../config";

const AuthContext = createContext();

export function AuthProvider({ children }) {
//console.log({children})
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);

  const checkAuth = async () => {
      try {
        await axios.get(
        `${API_URL}/api/util/auth/estado`,
          { withCredentials: true }
        );
       
        setAutenticado(true);
      } catch {
        setAutenticado(false);
      } finally {
        setCargando(false);
      }
    };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ autenticado, cargando,checkAuth  }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
