import { useEffect, useState } from "react";
import axios from 'axios';
import React from "react";
import { Search } from "lucide-react";
//import { addMonths, format } from 'date-fns';
import { ChevronRight,ChevronLeft,ChevronDown } from "lucide-react";
import toast from "react-hot-toast"
import Login from "./Login"
import { Navigate, useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from "../Utilities/AuthContext";
import { API_URL } from "../config";



export default function Categorias(){
const [categorias,setCategorias] = useState([]);
const [page, setPage] = useState(1);
const [totalPaginas, setTotalPaginas] = useState(1);
const limit = 12;
const navigate = useNavigate();
const [mensajeEliminar, setMensajeEliminar] = useState(false);
const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
const [abrirSubCategorias, setAbrirSubCategorias] = useState(null)

const { checkAuth } = useAuth();
const [autenticado, setAutenticado] = useState(false);
  
    useEffect(()=>{
          const fetchData =  async () => {
          try{
          await axios.get(`${API_URL}/api/util/auth/estado`,
             {
              withCredentials: true
            }
          )
          setAutenticado(true)
          
        }catch(error){
          toast.error(
                error.response?.data?.mensaje ||
                "Usuario necesita iniciar sesión"
              );
          setAutenticado(false)
        }
      }
    fetchData()
    },[])

  
    useEffect(()=>{
    axios.get(`${API_URL}/api/categorias/todas?page=${page}&limit=${limit}`)
    .then(res => {setCategorias(res.data.categorias)
      setTotalPaginas(res.data.totalPaginas);
    })
    .catch((e)=>{toast.error(
            e.response?.data?.mensaje ||
            "Error al obtener las categorias"
          )})
    },[page,limit])



  const anterior = () =>{
    if (page > 1) setPage(page - 1)
  }

  const siguiente = () =>{
   if (page < totalPaginas) setPage(page + 1)
  }

  /*if (categorias.length===0) {
    return <div className="p-6">No hay categorías</div>;
  }*/

const agregarCategoria =()=>{
navigate(`/crear-categoria`)
}

const editarCategoria =(d)=>{
navigate(`/editar/categoria/${d.CategoriaId}`)
}


const eliminarCategoria = async (c)=>{
try{
    const res = await axios.delete(`${API_URL}/api/categorias/${c}`,{
      withCredentials:true,
      headers: {
              "Content-Type": "application/json",
            }
    })
    await checkAuth();
    toast.success(res.data.mensaje)
}catch(error){
    toast.error(error.response?.data?.mensaje || "No se pudo eliminar la categoria")
}
}

if(!autenticado) return <Login/>

const setearId = (id)=>setAbrirSubCategorias(abrirSubCategorias === id ? null : id);

return(
<>
{mensajeEliminar && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
      
      <h2 className="text-lg font-semibold mb-2">
        ¿Eliminar categoría?
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Esta acción no se puede deshacer.
      </p>

      <div className="flex justify-end gap-3">
        <button
          className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          onClick={()=>setMensajeEliminar(false)}
        >
          Cancelar
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
          onClick={()=>{eliminarCategoria(categoriaAEliminar),setMensajeEliminar(false)}}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}



<div className="p-4 space-y-1 fixed top-20 inset-x-0 bottom-0 z-40 items-center justify-center bg-white overflow-y-auto">

  <div className="items-center justify-items-center text-xl font-bold">
  <h1>Categorías:</h1>
  </div>
  <button className="cursor-pointer p-2" onClick={()=>agregarCategoria()}>
    <AddIcon size={20}/>
  </button>


  {categorias.map((c) => (
  <div
    key={c.CategoriaId}
    className="
      grid grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-12
      items-center gap-x-2 gap-y-1
      p-3 text-sm border rounded-lg shadow-sm bg-white
      relative
    "
  >

    <span className="font-bold">
      {c.CategoriaNombre}
    </span>

    <button className="bg-black text-white px-5 py-1.5 rounded-2xl justify-self-end cursor-pointer hover:bg-gray-900" onClick={()=> setearId(c.CategoriaId)}>
     {abrirSubCategorias === c.CategoriaId ? <ChevronDown size={20}/> : <ChevronLeft size={20}/>} 
    </button>
    
    <div className="col-span-3 flex justify-end">
    <button className="cursor-pointer p-2" onClick={()=> editarCategoria(c)}>
      <EditIcon/>
    </button>

    <button className="cursor-pointer p-2" onClick={()=> {setCategoriaAEliminar(c.CategoriaId),setMensajeEliminar(true)}}>
      <DeleteIcon/>
    </button>
    </div>

    {abrirSubCategorias === c.CategoriaId && (
      <>
      <div className="col-span-12 border-t">
      <SubCategorias CategoriaId={c.CategoriaId}/>
      </div>
      </>
    )}
  </div>
))}


    <div className="flex items-center justify-center gap-2 mt-1 w-full">
      <button
        onClick={anterior}
        disabled={page === 1}
        className="bg-[#7A4A3C] text-[#EFE6DA] px-4 py-1 rounded cursor-pointer"
      >
        <ChevronLeft size={20}/>
      </button>

      <span>Página {page} de {totalPaginas}</span>

      <button
        onClick={siguiente}
        disabled={page === totalPaginas}
        className="bg-[#7A4A3C] text-[#EFE6DA] px-4 py-1 rounded cursor-pointer"
      >
        <ChevronRight size={20}/>
      </button>
    </div>
</div>



</>
);
}

function SubCategorias({CategoriaId}){
  const [subcategorias, setSubcategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const [mensajeEliminar, setMensajeEliminar] = useState(false);
  const [subcategoriaAEliminar, setSubcategoriaAEliminar] = useState(null);
  const { checkAuth } = useAuth();


  const editarSubCategoria =(s)=>{
  navigate(`/editar/subcategoria/${s.SubCategoriaId}`)
  }

  const eliminarSubCategoria = async (s) =>{
  try{
    const res = await axios.delete(`${API_URL}/api/subcategorias/sub/${s}`,{
      withCredentials:true,
      headers: {
              "Content-Type": "application/json",
            },});
      await checkAuth();
      toast.success(res.data.mensaje)
  }catch(error){
      toast.error(error.response?.data?.mensaje || "No se pudo eliminar la subcategoria")
  }
  }

  useEffect(()=>{
    setCargando(true)

    axios.get(`${API_URL}/api/subcategorias/sub?categoria=${CategoriaId}`)
    .then(res => {setSubcategorias(res.data)})
    .catch((e)=>{toast.error(
            e.response?.data?.mensaje ||
            "Error al obtener las subcategorias"
          )})
    .finally(()=>setCargando(false))
    },[CategoriaId])

   // if (cargando===false && subcategorias.length === 0) return <p>No hay subcategorías</p>

    const agregarSubCategoria =()=>{
    navigate(`/categoria/crear-subcategoria/${CategoriaId}`)
    }

    return(
      <>
      {mensajeEliminar && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
                
                <h2 className="text-lg font-semibold mb-2">
                  ¿Eliminar subcategoría y sus respectivos productos?
                </h2>

                <p className="text-sm text-gray-600 mb-6">
                  Esta acción no se puede deshacer.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                    onClick={()=>setMensajeEliminar(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    onClick={()=>{eliminarSubCategoria(subcategoriaAEliminar),setMensajeEliminar(false)}}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
        )}
          <button className="cursor-pointer p-2" onClick={()=>agregarSubCategoria()}>
            <AddIcon size={20}/>
          </button>
          <ul className="p-4 space-y-2">
          {subcategorias.map((s) => (
              <li
                key={s.SubCategoriaId}
                className="grid grid-cols-6 items-center"
              >

                <span className="px-5 py-2">
                {s.SubCategoriaNombre}
                </span>

                <div className="justify-items-end">
                <span className="cursor-pointer p-2" onClick={()=>editarSubCategoria(s)}>
                  <EditIcon/>
                </span>

                <span className="cursor-pointer p-2" onClick={()=>{setSubcategoriaAEliminar(s.SubCategoriaId),setMensajeEliminar(true)}}>
                  <DeleteIcon/>
                </span>
                </div>
                
              </li>
            ))}

            {cargando===false  && (
            subcategorias.length === 0 && (
              <p>No hay subcategorías</p>
            ))}
            </ul>
      

      </>
    )
}



