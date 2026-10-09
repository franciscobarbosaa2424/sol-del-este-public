import { useState,useEffect } from "react"
import axios from 'axios'
import toast from "react-hot-toast"
import Login from "./Login"
import { useAuth } from "../Utilities/AuthContext";
import { useParams } from "react-router-dom"
import React from 'react';
import { API_URL } from "../config";

export default function EditarDescuento(){
  const { checkAuth } = useAuth();
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando]  = useState(true)
  const {DescuentoId} = useParams();


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

  

  
  const [formData,setFormData] = useState({
        DescuentoPorcentaje:0.00,
        DescuentoFechaInicio:"",
        DescuentoHoraInicio: "",
        DescuentoFechaFin: "",
        DescuentoHoraFin: "",
        TipoPromo:""
    })

  useEffect(()=>{
    if(!DescuentoId) return

    const fetchDescuento = async ()=>{
    try{
      const res = await axios.get(`${API_URL}/api/descuentos/${DescuentoId}`)

          const descuento = res.data
          setFormData({
          DescuentoPorcentaje: descuento.DescuentoPorcentaje,
          DescuentoFechaInicio: descuento.DescuentoFechaInicio.slice(0,10),
          DescuentoHoraInicio:descuento.DescuentoFechaInicio.slice(11,19),
          DescuentoFechaFin: descuento.DescuentoFechaFin.slice(0,10),
          DescuentoHoraFin: descuento.DescuentoFechaFin.slice(11,19),
          TipoPromo: descuento.TipoPromo
          })

    }catch(error){
    toast.error(error.response?.data?.mensaje || 'No se pudo cargar los datos del descuento')
    }
  }

  fetchDescuento()
},[DescuentoId])

    

    const handleChange = (e) =>{
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
            const res = await axios.patch(`${API_URL}/api/descuentos/${DescuentoId}`,formData,{
              withCredentials:true,
              headers: {
            "Content-Type": "application/json"
              }
            })
        
        await checkAuth();

        toast.success(res.data.mensaje);
        
        }catch(error){
             toast.error(
                error.response?.data?.mensaje ||
                "No se pudo editar el descuento"
              );
        }
    }

    if(!autenticado) return <Login/>
    if(cargando) return <p>Cargando...</p>

    return(
        <form 
        onSubmit={handleSubmit} 
        className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-4"
        >
          <label className="block text-gray-700 mb-1">Porcentaje Descuento</label>
            <input type="number" 
            name="DescuentoPorcentaje"
            value={formData.DescuentoPorcentaje} 
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
          value={formData.DescuentoFechaInicio} 
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"/>


          <input type="time" 
          name="DescuentoHoraInicio"
          value={formData.DescuentoHoraInicio} 
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"/>
        </div>

        <div className="flex gap-8">
          <label className="block text-gray-700 mb-1">Fecha y Hora Fin</label>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
          <input type="date" 
          name="DescuentoFechaFin"
          value={formData.DescuentoFechaFin} 
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"/>


          <input type="time" 
          name="DescuentoHoraFin"
          value={formData.DescuentoHoraFin} 
          onChange={handleChange}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring"/>
        </div>

        <label className="block text-gray-700 mb-1">Nombre Promoción</label>
          <input type="text" 
          name="TipoPromo"
          placeholder="Nombre Promoción..."
          value={formData.TipoPromo} 
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring"/>

        <div className="flex justify-center">
        <button 
          type="submit" 
          className="w-xl bg-black text-[#EFE6DA] py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Editar Descuento
        </button>
        </div>
      </form>
        )
}
