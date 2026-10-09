import { X, ChevronDown, ChevronRight } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PushPinIcon from '@mui/icons-material/PushPin';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import agujaIcono from "/img/aguja.svg";
import hiloIcono from "/img/hilo.svg";
import React from 'react';
import { API_URL } from "../config";

export default function FiltersSidebar({ abrirFiltros, setAbrirFiltros, setAbrirGeneral}) {
  const [categorias, setCategorias] = useState([]);
  const [abierta, setAbierta] = useState(null);
  const navigate = useNavigate();
  const [tieneSubcategorias,setTieneSubcategorias] = useState({});

  useEffect(() => {
    axios.get(`${API_URL}/api/categorias`)
      .then(res => {setCategorias(res.data)})
      .catch(err => console.error(err));

  }, []);

  useEffect(()=>{
    if (!categorias) return
    verificarSubcategorias();
  },[categorias])

  const verificarSubcategorias = ()=>{

    for(const c of categorias){
      axios.get(`${API_URL}/api/subcategorias/sub?categoria=${c.CategoriaId}`)
      .then(res =>
        setTieneSubcategorias(prev=>({
            ...prev,
            [c.CategoriaId]: res.data.length > 0}
        ))    
      )
      .catch(err => console.error(err));
    }

  }

  

  const toggleCategoria = (id) =>
    setAbierta(abierta === id ? null : id);

  const recargar = ()=> window.location.reload();

  return (
    <>
      {abrirFiltros && (
        <div
          onClick={() => setAbrirFiltros(false)}
          className="fixed inset-0 bg-black/50 z-40"
        />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-60 transform text-black overflow-y-auto
        ${abrirFiltros ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-bold">Categorías</h3>
          <button className="cursor-pointer" onClick={() => {setAbrirFiltros(false),setAbrirGeneral(false)}}><X size={28}/></button>
        </div>

        <ul className="p-4 space-y-2">
          {categorias.map(cat => (
            <li key={cat.CategoriaId} className="flex flex-col">
              
              <div className="flex justify-between items-center">
                
                {/* navegar */}
                <span
                  className="cursor-pointer flex"
                  onClick={() => {navigate(`/catalogo/${cat.CategoriaSlug}`),setAbrirFiltros(false),setAbrirGeneral(false),recargar()}}
                >
                 <img src={hiloIcono} className="w-5 h-5 mr-1 mt-0.5"/>{cat.CategoriaNombre}
                </span>

                {/* expandir */}
                <button className={`cursor-pointer ${tieneSubcategorias[cat.CategoriaId] === true ? "" :"hidden"}`}  onClick={() => toggleCategoria(cat.CategoriaId)}>

                  {abierta === cat.CategoriaId ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                
                </button>
              </div>

              {/*Subctegorias - llama a funcion*/}
              {abierta === cat.CategoriaId && (
                <Subcategorias categoriaId={cat.CategoriaId} categoriaSlug={cat.CategoriaSlug} setAbrirFiltros={setAbrirFiltros} setAbrirGeneral={setAbrirGeneral}/>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function Subcategorias({ categoriaId,categoriaSlug,setAbrirFiltros,setAbrirGeneral}) {
  const [subcats, setSubcats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${API_URL}/api/subcategorias/sub?categoria=${categoriaId}`) 
      .then((res) => setSubcats(res.data))
      .catch((err) => console.error(err));
  }, [categoriaId]);

  const recargar = ()=> window.location.reload();

  return (
    <ul className="pl-4 mt-2 space-y-1">
      {subcats.map((s) => (
        <li key={s.SubCategoriaId}>
          <span
            className="text-sm text-gray-700 cursor-pointer flex"
            onClick={() => {navigate(`/catalogo/${categoriaSlug}/${s.SubCategoriaSlug}`),setAbrirFiltros(false),setAbrirGeneral(false),recargar()}}
          >
            <img src={agujaIcono} className="w-4 h-4"/>{s.SubCategoriaNombre}
          </span>
        </li>
      ))}
    </ul>
  );
}
