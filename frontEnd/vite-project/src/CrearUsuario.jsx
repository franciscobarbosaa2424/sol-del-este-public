import { useState,useEffect } from "react";
import axios from 'axios';
import Login from "./Login";
import { useAuth } from "../Utilities/AuthContext";
import toast from "react-hot-toast";
import React from 'react';
import { API_URL } from "../config";

export default function CrearUsuario(){
  const { checkAuth } = useAuth();
  const[autenticado, setAutenticado] = useState(false);


    useEffect(() => {
        axios.get(`${API_URL}/api/util/auth/estado`, { withCredentials: true })
        
          .then(res => {setAutenticado(res.data.autenticado)});
      }, []);

    const [formData, setFormData] = useState({
        UsuarioNombre:"",
        UsuarioCorreo: "",
        UsuarioContrasena: "",
        UsuarioContacto:""
      });

    const handleChange = (e) =>{
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const res = await axios.post(`${API_URL}/api/util/crear-usuario`, formData, {
          withCredentials: true, // recibir cookies HttpOnly
          headers: {
            "Content-Type": "application/json"
          }          
        });

        await checkAuth();

        toast.success(res.data.mensaje)
        
        }catch(e){
            toast.error(
                e.response?.data?.mensaje ||
                "No se pudo crear el usuario"
              );
        }
    }
    
    if(!autenticado) return <Login/>
    return(
      <form 
        onSubmit={handleSubmit} 
        className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Crear Usuario</h2>

        <div className="mb-4">
        <label className="block text-gray-700 mb-1">Nombre</label>
        <input type="text" 
        name="UsuarioNombre"
        value={formData.UsuarioNombre} 
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"/>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Correo</label>
          <input
            type="email"
            name="UsuarioCorreo"
            value={formData.UsuarioCorreo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            name="UsuarioContrasena"
            value={formData.UsuarioContrasena}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            required
          />
        </div>

        <div className="mb-4">
        <label className="block text-gray-700 mb-1">Contacto</label>
        <input type="text" 
        name="UsuarioContacto"
        value={formData.UsuarioContacto}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"/>
        </div>

        <div className="flex justify-center">
        <button 
          type="submit" 
          className="w-xl bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Crear
        </button>
        </div>
      </form>
    );
}