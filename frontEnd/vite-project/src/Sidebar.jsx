import { X } from "lucide-react";
import { useState } from "react";
import FiltersSidebar from "./FiltersSidebar";
import { Link } from "react-router-dom";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HomeIcon from '@mui/icons-material/Home';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import InputIcon from '@mui/icons-material/Input';
import React from 'react';


export default function Sidebar({ abrirGeneral, setAbrirGeneral }) {
  const [abrirFiltros, setAbrirFiltros] = useState(false)


  return (
   
    <>
      {/* Fondo*/}
      {abrirGeneral && (
        <div
          onClick={() => setAbrirGeneral(false)}
          className="fixed inset-0 bg-black/50 z-40"
        ></div>
      )}


      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#EFE6DA] shadow-lg z-50 transform overflow-y-auto
        ${abrirGeneral ? "translate-x-0" : "-translate-x-full"} 
        transition-transform duration-300`}
      >
        <div className="flex justify-between items-center px-5 py-6 border-b text-black">
          <h2 className="text-lg font-bold text-[#2B2B2B]">Explorar</h2>
          <button className="cursor-pointer" onClick={() => setAbrirGeneral(false)}>
            <X size={28} className="text-black" />
          </button>
        </div>

        <ul className="p-4 space-y-6 text-[#2B2B2B]">
          <Link to="/" className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#E2D8C8] transition">
            <HomeIcon className="w-5 h-5" />
            Inicio
          </Link>
          <li>
            <Link to='/catalogo' className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#E2D8C8] transition">
            <ShoppingBagIcon className="w-5 h-5"/> Ver Catálogo
            </Link>       
          </li>
          <li className="cursor-pointer">
            <button onClick={()=>{setAbrirFiltros(true)}} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#E2D8C8] transition w-full text-left cursor-pointer">
            <CheckroomIcon/>Categorías
            </button>   
          </li>
        </ul>


      <div className="absolute bottom-4 right-4">
        <Link to="/login" className="text-xs text-gray-600 hover:text-black">
          <InputIcon sx={{fontSize:16}}/>
        </Link>
      </div>

      </div>

 
      {abrirFiltros && (<FiltersSidebar abrirFiltros={abrirFiltros} setAbrirFiltros={setAbrirFiltros} setAbrirGeneral={setAbrirGeneral}/>)}
    </>
  );
}