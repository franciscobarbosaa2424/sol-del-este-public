import { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import React from "react";
import { Search } from "lucide-react";
import { addMonths, format } from 'date-fns';
import {formatInTimeZone} from 'date-fns-tz';
import { ChevronRight,ChevronLeft } from "lucide-react";
import toast from "react-hot-toast"
import Login from "./Login"
import { MdClose } from "react-icons/md";
import { useAuth } from "../Utilities/AuthContext";
import { API_URL } from "../config";


export default function CrearGrupoDescuento(){
const [productos,setProductos] = useState([]);
const [seleccionados, setSeleccionados] = useState({});
const [monedas, setMonedas] = useState({})
const [page, setPage] = useState(1);
const [totalPaginas, setTotalPaginas] = useState(1);
const limit = 8;
const [query, setQuery] = useState("")
const [inputValue, setInputValue] = useState("");
const [abrirGrid, setAbrirGrid] = useState(false);

const { checkAuth } = useAuth();
const[autenticado, setAutenticado] = useState(false);
    
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



const hoy = new Date()
const ahora = formatInTimeZone(hoy,'America/Montevideo',"yyyy-MM-dd'T'HH:mm")
const fechaFin = format(addMonths(ahora, 1), "yyyy-MM-dd'T'HH:mm");
const ahoraAuxiliar = new Date();

const [formulario,setFormulario] = useState({
        DescuentoPorcentaje: 0.00,
        DescuentoFechaInicio:ahora.toString().slice(0,10),
        DescuentoHoraInicio: ahoraAuxiliar.toString().slice(16,21),
        DescuentoFechaFin: fechaFin.toString().slice(0,10),
        DescuentoHoraFin: fechaFin.toString().slice(11,19),
        TipoPromo:"",
        Productos: []
    })

// eslint-disable-next-line react-hooks/exhaustive-deps
    const queryDebounced =  useCallback(
        debounce((value) => {
        setQuery(value);
        setPage(1); 
        }, 400)
    ,[]);

useEffect(() => {
  if (productos.length === 0) return;

  //las monedas que existen se cargan en monedaIdsUnicos
  //asi es mas facil de indexar en el grid en caso que haya muchos productos

  const monedaIdsUnicos = [...new Set(productos.map(p => p.MonedaId))];

  if (monedaIdsUnicos.length===0) return;

  monedaIdsUnicos.forEach((monedaId) => {
    if (monedas[monedaId]) return; // ya cargada

    axios.get(`${API_URL}/api/monedas/nombre?MonedaId=${monedaId}`)
      .then(res => {
        setMonedas(prev => ({
          ...prev,
          [monedaId]: res.data[0].MonedaSimbolo
        }));
      })
      .catch((error)=>{toast.error(
        error.response?.data?.mensaje ||
        "Error al obtener las monedas"
      )});
  });
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [productos]);


useEffect(()=>{
axios.get(`${API_URL}/api/productos?query=${query}&page=${page}&limit=${limit}`)
.then(res => {setProductos(res.data.productos)
  setTotalPaginas(res.data.totalPaginas);
})
.catch((e)=>{toast.error(
        e.response?.data?.mensaje ||
        "Error al obtener los productos"
      )})
},[query,page,limit])


 const toggleCheck = (id) => {
    setSeleccionados((prev) => ({
      ...prev,
      [id]: !prev[id], // !prev cambia el estado de true a false o viceversa
    }));
  };


  const anterior = () =>{
    if (page > 1) setPage(page - 1)
  }

  const siguiente = () =>{
   if (page < totalPaginas) setPage(page + 1)
  }

  if (productos.length===0) {
    return <div className="p-6">No hay productos</div>;
  }

const handleSubmit = async (e) => {
e.preventDefault();

    const formData = new FormData();

    // Agregar todos los campos del formulario
    for (const key in formulario) {
      formData.append(key, formulario[key]);
    }

    const productosSeleccionados = Object.keys(seleccionados).filter(id => seleccionados[id]) //trae solo los true del seleccionado

    const payload = {
      ...formulario,
      Productos: productosSeleccionados
    };


    try {
      const res = await axios.post(`${API_URL}/api/descuentos/grupo`, payload, {
        withCredentials:true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      await checkAuth();

      toast.success(res.data.mensaje);
    } catch (error) {
      toast.error(
        error.response?.data?.mensaje ||
        "Error al crear grupo de descuento"
      );
    }
} 

const handleChange = (e) => {
const { name, value } = e.target;
setFormulario({ ...formulario, [name]: value})};

const handleGrid = () => {
  setAbrirGrid(!abrirGrid)
}


if(!autenticado) return <Login/>

return(
<>
{abrirGrid && (
<div className="p-4 space-y-1 fixed top-20 inset-x-0 bottom-0 z-40 items-center justify-center bg-white overflow-y-auto">
    <button className="absolute right-2 cursor-pointer" onClick={()=>setAbrirGrid(false)}>
      <MdClose size={20}/>
    </button>
    <div className="relative w-full max-w-md mt-1">
        
        <Search className="absolute left-2 top-2 h-5 w-5 text-gray-400" />

        <input
          type="text"
          placeholder="Buscar..."
          className="w-full pl-10 pr-3 py-1 border border-gray-300 rounded-lg"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value) //input para que se escriba en el momento
            queryDebounced(e.target.value)}}//espera 400 ms para buscar la query
        />
      </div>
      <h4>Seleccione prendas para generar grupo de descuento:</h4>
      
      {productos.map((p) => (
   
        <div
          key={p.ProductoId}
          className="grid grid-cols-2 gap-2 p-1 text-sm border rounded-lg shadow-sm bg-white"
        >
          {/*El !! es para que fuerce a que devuelva un valor booleano es igual a
          seleccionados[p.ProductoId] ? true : false
          */}
          <div className="flex gap-2">
            <input
            type="checkbox"
            checked={!!seleccionados[p.ProductoId]}
            onChange={() => toggleCheck(p.ProductoId)}
            className="h-5 w-5 accent-blue-600 cursor-pointer"
          />

          <span className="">{p.ProductoNombre}</span>
          </div>
          <span className="text-right">{monedas[p.MonedaId] ?? '...'} {p.ProductoTotal}</span>
        </div>
      ))}


    <div className="flex items-center justify-center gap-2 mt-1 w-full">
      <button
        onClick={anterior}
        disabled={page === 1}
        className="bg-gray-300 px-4 py-2 rounded cursor-pointer disabled:opacity-50"
      >
        <ChevronLeft size={20}/>
      </button>

      <span>Página {page} de {totalPaginas}</span>

      <button
        onClick={siguiente}
        disabled={page === totalPaginas}
        className="bg-gray-300 px-4 py-1 rounded cursor-pointer disabled:opacity-50"
      >
        <ChevronRight size={20}/>
      </button>
    </div>

    <button onClick={handleSubmit} className="w-auto bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded transition">
      Crear Grupo de Descuento
    </button>   
</div>
)}

<div className="max-w-3xl mx-auto p-6 bg-white shadow space-y-4">
<div className="p-4 space-y-2 z-0">

<label className="block text-gray-700 mb-1">Porcentaje Descuento</label>
        <input type="number" 
        name="DescuentoPorcentaje"
        value={formulario.DescuentoPorcentaje} 
        required
        step="0.01"
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"/>

  <div className="flex gap-4">
  <label className="block text-gray-700 mb-1">Fecha y Hora Inicio</label>
  </div>
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
          <input type="date" 
          name="DescuentoFechaInicio"
          value={formulario.DescuentoFechaInicio} 
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"/>


          <input type="time" 
          name="DescuentoHoraFin"
          value={formulario.DescuentoHoraInicio} 
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"/>
  </div>

  <div className="flex gap-8">
  <label className="block text-gray-700 mb-1">Fecha y Hora Fin</label>
  </div>
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
          <input type="date" 
          name="DescuentoFechaFin"
          value={formulario.DescuentoFechaFin} 
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"/>


          <input type="time" 
          name="DescuentoHoraFin"
          value={formulario.DescuentoHoraFin} 
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"/>
  </div>

<label className="block text-gray-700 mb-1">Nombre Promoción</label>
        <input type="text" 
        name="TipoPromo"
        placeholder="Nombre Promoción..."
        value={formulario.TipoPromo} 
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"/>
</div>
</div>

    <div className="max-w-3xl mx-auto p-2 pl-10 bg-white shadow -mt-5">
    <button onClick={handleGrid} className="w-auto bg-black hover:bg-gray-800 text-white font-semibold py-2 px-6 rounded transition">
      Seleccionar productos
    </button>   
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
