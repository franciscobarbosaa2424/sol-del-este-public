import { useState } from "react";
import axios from 'axios'
import { Navigate } from "react-router-dom";
import { useAuth } from "../Utilities/AuthContext";
import React from 'react';
import { API_URL } from "../config";


export default function LoginForm() {
  const [error, setError] = useState(false)
  const [isLoggedIn,setIsLoggedIn] = useState(false)
  const { checkAuth } = useAuth();


  const [formData, setFormData] = useState({
    UsuarioCorreo: "",
    UsuarioContrasena: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       await axios.post(`${API_URL}/api/util/login`, formData, {
          withCredentials: true, // para recibir cookies HttpOnly
          headers: {
            "Content-Type": "application/json"
          }
        });

      
      setIsLoggedIn(true)

      await checkAuth(); 
      window.location.reload()
    }catch{
        setError(true)
        throw new Error('Usuario y/o contraseña incorrectos')
    }
  };

  if(isLoggedIn){
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form 
        onSubmit={handleSubmit} 
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
        
        <div className="mb-4">
          <label className="block font-medium text-gray-700">Correo</label>
          <input
            type="email"
            name="UsuarioCorreo"
            value={formData.UsuarioCorreo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="ejemplo@email.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            name="UsuarioContrasena"
            value={formData.UsuarioContrasena}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="********"
            required
          />
        </div>
    
        <label className={`text-xs font-bold ${error===true ? `text-red-500 visible` :`invisible`}`}>* Usuario y/o Contraseña inválidos</label>

        <button 
          type="submit" 
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition cursor-pointer"
        >
          Entrar
        </button>
    </form>
    </div>
  );
}
