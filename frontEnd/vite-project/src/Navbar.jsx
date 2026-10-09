import { useState,useEffect } from "react";
import { Menu, X } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import  axios  from "axios";
import { API_URL } from "../config";
import Sidebar from "./Sidebar";
import MenuIcon from '@mui/icons-material/Menu';
import AdminSidebar from "./AdminSidebar"
import React from 'react';



export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [abrirMenuUsuario,setAbrirMenuUsuario] = useState(false);
  const [auth, setAuth] = useState(false)
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/util/auth/estado`, { withCredentials: true })
    
      .then(res => {setAuth(res.data.autenticado)});
  }, []);

  return (
    <nav className="bg-[#C9A66B] text-white p-2 flex items-center fixed top-0 left-0 w-full z-50 h-16">
      
        <button onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#E2D8C8] transition cursor-pointer">
          <Menu size={28} color="black"/>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
        <button 
          className="rounded-2xl p-1 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img 
            src="/img/logo-h.png" 
            className="w-auto h-16" 
            alt="Logo"
          />
        </button>
        </div>
        {auth && (
        <div className="flex ml-auto w-20">
          <button onClick={()=>setAbrirMenuUsuario(true)} className="cursor-pointer text-black hover:bg-[#a08455] transition rounded-lg p-2">
            <a className="text-sm">Menú de Usuario</a>
          </button>
        </div>
        )}

      <Sidebar abrirGeneral={open} setAbrirGeneral={setOpen} />
      {auth && (
      <AdminSidebar abrirMenuUsuario={abrirMenuUsuario} setAbrirMenuUsuario={setAbrirMenuUsuario}/>
      )}
    </nav>
  );
}
