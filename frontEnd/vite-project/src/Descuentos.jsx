import { useEffect, useState } from "react";
import axios from 'axios';
import React from "react";
import { Search } from "lucide-react";
import { ChevronRight,ChevronLeft } from "lucide-react";
import toast from "react-hot-toast"
import { Navigate, useNavigate, useParams } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from "../Utilities/AuthContext";
import Login from "./Login";
import { API_URL } from "../config";



export default function CrearGrupoDescuento(){
const {ProductoId} = useParams();
const [descuentos,setDescuentos] = useState([]);
const [page, setPage] = useState(1);
const [totalPaginas, setTotalPaginas] = useState(1);
const limit = 12;
const navigate = useNavigate();
const [mensajeEliminar, setMensajeEliminar] = useState(false);
const [descuentoAEliminar, setDescuentoAEliminar] = useState(null);
const { checkAuth } = useAuth();
const [autenticado, setAutenticado] = useState(false);
const[cargando, setCargando]  = useState(true)

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
        }finally{
          setCargando(false)
        }
      }
    fetchData()
    },[])

    
    useEffect(()=>{
    axios.get(`${API_URL}/api/descuentos/todos?ProductoId=${ProductoId}&page=${page}&limit=${limit}`)
    .then(res => {setDescuentos(res.data.descuentos)
      setTotalPaginas(res.data.totalPaginas);
    })
    .catch((e)=>{toast.error(
            e.response?.data?.mensaje ||
            "Error al obtener los descuentos"
          )})
    },[ProductoId,page,limit])



  const anterior = () =>{
    if (page > 1) setPage(page - 1)
  }

  const siguiente = () =>{
   if (page < totalPaginas) setPage(page + 1)
  }

 /* if (descuentos.length===0) {
    return <div className="p-6">No hay descuentos</div>;
  }*/
/*
const hoy = new Date()
    const ahora = formatInTimeZone(hoy,'America/Montevideo',"yyyy-MM-dd'T'HH:mm")
    const fechaFin = format(addMonths(ahora, 1), "yyyy-MM-dd'T'HH:mm");
    const ahoraAuxiliar = new Date();
*/

const fechaSlice= (d)=>{
const slicedDate = d.slice(0,10)
const replacedLine = slicedDate.replaceAll('-','/')
return replacedLine
}

const horaSlice= (d)=>{
const slicedHora = d.slice(11,19)
return slicedHora
}

const editarDescuento =(d)=>{
navigate(`/descuento/${d.DescuentoId}`)
}

const crearDescuento = () =>{
navigate(`/crear-descuento/${ProductoId}`)
}

const eliminarDescuento = async (d)=>{
try{
    const res = await axios.delete(`${API_URL}/api/descuentos/${d}`,{
      withCredentials:true,
      headers: {
              "Content-Type": "application/json",
            }
    })

    await checkAuth();
    toast.success(res.data.mensaje)
}catch(error){
    toast.error(error.response?.data?.mensaje || "No se pudo eliminar el descuento")
}
}

if(!autenticado) return <Login/>
if(cargando) return <p>Cargando...</p>


return(
<>
{mensajeEliminar && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
      
      <h2 className="text-lg font-semibold mb-2">
        ¿Eliminar descuento?
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
        onClick={()=>{eliminarDescuento(descuentoAEliminar),setMensajeEliminar(false)}}
        >
          Eliminar
        </button>
      </div>
    </div>
  </div>
)}



<div className="p-4 space-y-1 fixed top-20 inset-x-0 bottom-0 z-40 items-center justify-center bg-white overflow-y-auto">

  <div className="flex items-center justify-between">
  <h4>Descuentos de la prenda:</h4>

  <button className="cursor-pointer" onClick={crearDescuento}>
    <AddIcon size={20}/>
  </button>
  </div>
  <h4 className={`${descuentos.length === 0 ?"" :"hidden"}`}>No hay descuentos</h4>

  {descuentos.map((d) => (
  <div
    key={d.DescuentoId}
    className="
      grid grid-cols-1
      sm:grid-cols-2
      md:grid-cols-4
      lg:grid-cols-12
      items-center gap-x-2 gap-y-1
      p-3 text-sm border rounded-lg shadow-sm bg-white
      relative
    "
  >

    <span className="font-medium lg:col-span-3">{d.TipoPromo}</span>


    <div className="flex items-center gap-2 lg:col-span-4">
    <b>Inicio</b>

    <span>
    {fechaSlice(d.DescuentoFechaInicio)}
    </span>

    <span>
    {horaSlice(d.DescuentoFechaInicio)}
    </span>
    </div>

    <div className="flex items-center gap-2 lg:col-span-4">
    <b>Fin</b>

    <span>
      {fechaSlice(d.DescuentoFechaFin)}
    </span>

    <span>
      {horaSlice(d.DescuentoFechaFin)}
    </span>
    </div>

    <span className="font-bold">
      {d.DescuentoPorcentaje}%
    </span>
    
    <div className="absolute right-8">
    <button className="cursor-pointer p-2" onClick={()=> editarDescuento(d)}>
      <EditIcon/>
    </button>

    <button className="cursor-pointer p-2" onClick={()=> {setDescuentoAEliminar(d.DescuentoId),setMensajeEliminar(true)}}>
      <DeleteIcon/>
    </button>
    </div>
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



