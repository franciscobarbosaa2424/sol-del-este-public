import React from 'react';
import { X } from "lucide-react";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import toast from "react-hot-toast";
import { API_URL } from "../config";

export default function Sidebar({ abrirMenuUsuario, setAbrirMenuUsuario }) {
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    axios.get(`${API_URL}/api/util/auth/estado`, { withCredentials: true })
    
      .then(res => {setAuth(res.data.autenticado)});
  }, []);

  const logout = async()=>{
    try{
    const res = await axios.get(`${API_URL}/api/util/logout`,{ withCredentials: true })
    setAuth(false);
    toast.success(res.data.mensaje)
    window.location.reload()
    }catch(error){
        toast.error(
        error.response?.data?.mensaje ||
        "No se pudo hacer el Logout")
    }
    
  }

  return (  
    <>
    {auth && (
    <>
      {/* Fondo*/}
      {abrirMenuUsuario && (
        <div
          onClick={() => setAbrirMenuUsuario(false)}
          className="fixed inset-0 bg-black/50 z-40"
        ></div>
      )}
    
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#EFE6DA] shadow-lg z-50 transform overflow-y-auto
        ${abrirMenuUsuario ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300`}
      >
        <div className="flex justify-between items-center px-5 py-6 border-b text-black">
          <h2 className="text-lg font-bold text-[#2B2B2B]">Menú de Usuario</h2>
          <button className="cursor-pointer" onClick={() => setAbrirMenuUsuario(false)}>
            <X size={28} className="text-black" />
          </button>
        </div>

        <ul className="p-4 space-y-6 text-[#2B2B2B]">
          <Link to="/categorias" className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#E2D8C8] transition">
            • Categorías
          </Link>
          <li>
            <Link to='/crear-producto' className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#E2D8C8] transition">
            • Crear Producto
            </Link>       
          </li>
          <li>
            <Link to='/crear-grupo-descuento' className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#E2D8C8] transition">
            • Crear Grupo de Descuento
            </Link>       
          </li>    
        </ul>

            <div className="absolute bottom-4 left-4 right-4">
            <button 
                onClick={logout}
                className="rounded-lg text-black transition hover:bg-[#f09a9a]"
            >
            <LogoutIcon/>
            </button>
            </div>
      </div>
    </>      
    )}
    </>
  );
}