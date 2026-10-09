// components/ProductList.jsx
import React, { useEffect, useState, useCallback   } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import { useParams } from "react-router-dom";
import { SlidersHorizontal,Search } from "lucide-react";
import FiltersSidebar from "./FiltersSidebar"
import { API_URL } from "../config";


export default function ProductList() {
  const {CategoriaSlug,SubCategoriaSlug} = useParams()
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const limit = 12;
  const [open,setOpen] = useState(false);
  const [query, setQuery] = useState("")
  const [inputValue, setInputValue] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const queryDebounced =  useCallback(
      debounce((value) => {
      setQuery(value);
      setPage(1); 
      }, 400)
  ,[]);

  useEffect(() => {
   if (CategoriaSlug && SubCategoriaSlug){
    axios.get(`${API_URL}/api/productos/catalogo/${CategoriaSlug}/${SubCategoriaSlug}?query=${query}&page=${page}&limit=${limit}`)
    .then(
        response => {
          setProductos(response.data.productos);
          setTotalPaginas(response.data.totalPaginas);
      })
      .catch(console.error("Error al obtener productos"));
   } else if(CategoriaSlug){
    axios.get(`${API_URL}/api/productos/catalogo/${CategoriaSlug}?query=${query}&page=${page}&limit=${limit}`)
    .then(
        response => {
          setProductos(response.data.productos);
          setTotalPaginas(response.data.totalPaginas);
      })
      .catch(console.error("Error al obtener productos"));
   }else{
     axios.get(`${API_URL}/api/productos?query=${query}&page=${page}&limit=${limit}`)
   .then(
        response => {
          setProductos(response.data.productos);
          setTotalPaginas(response.data.totalPaginas);
      })
      .catch(console.error("Error al obtener productos:"));
   }

  },[CategoriaSlug,SubCategoriaSlug,query,page,limit]);

  const anterior = () =>{
    if (page > 1) setPage(page - 1)
  }

  const siguiente = () =>{
   if (page < totalPaginas) setPage(page + 1)
  }

  if (!productos) {
    return <div className="p-6">No hay productos</div>;
  }

  

  return (
    <>
      <div className="px-4 flex">
        <div className="p-2 ">
        <button
          onClick={() => setOpen(true)}
          className="p-2 border rounded cursor-pointer bg-white"
        >
          <SlidersHorizontal className="w-6 h-6" />
        </button>
        </div>
      <div className="relative w-full max-w-md mt-2">
        
        <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />

        <input
          type="text"
          placeholder="Buscar..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value) //input para que se escriba en el momento
            queryDebounced(e.target.value)}}//espera 400 ms para buscar la query
        />
      </div>
      </div>  

      <div className="bg-[#EFE6DA]">
        {/* Botón */}
        

        {/* Sidebar */}
        {open && <FiltersSidebar abrirFiltros={open} setAbrirFiltros={setOpen}/>}
      

  <div className="w-full flex flex-wrap justify-center gap-4 px-4 py-4 overflow-hidden">
      {productos.map((producto) => (
        <ProductCard key={producto.ProductoSlug} producto={producto} />
      ))}
    </div>

    <div className="flex items-center justify-center gap-2 mt-6 w-full">
      <button
        onClick={anterior}
        disabled={page === 1}
        className="bg-[#7A4A3C] text-[#EFE6DA] px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
      >
        ← Anterior
      </button>

      <span>Página {page} de {totalPaginas}</span>

      <button
        onClick={siguiente}
        disabled={page === totalPaginas}
        className="bg-[#7A4A3C] text-[#EFE6DA] px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
      >
        Siguiente →
      </button>
    </div>
    </div>

</>

  );
}




function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);  
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

