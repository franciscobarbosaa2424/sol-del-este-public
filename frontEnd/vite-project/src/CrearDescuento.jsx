import { useState,useEffect } from "react";
import axios from "axios";
import { MdImage,MdClose } from "react-icons/md";
import { useParams } from "react-router-dom";
import { AuthProvider } from "../Utilities/AuthContext";
import toast from "react-hot-toast";
import { addMonths, format } from 'date-fns';
import {formatInTimeZone} from 'date-fns-tz';
import { useAuth } from "../Utilities/AuthContext";
import Login from "./Login"
import React from 'react';
import { API_URL } from "../config";

export default function CrearDescuento(){
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

    const{ProductoId} = useParams();

    const hoy = new Date()
    const ahora = formatInTimeZone(hoy,'America/Montevideo',"yyyy-MM-dd'T'HH:mm")
    const fechaFin = format(addMonths(ahora, 1), "yyyy-MM-dd'T'HH:mm");
    const ahoraAuxiliar = new Date();

    const [formData,setFormData] = useState({
        DescuentoPorcentaje:0.00,
        DescuentoFechaInicio:ahora.toString().slice(0,10),
        DescuentoHoraInicio: ahoraAuxiliar.toString().slice(16,21),
        DescuentoFechaFin: fechaFin.toString().slice(0,10),
        DescuentoHoraFin: fechaFin.toString().slice(11,19),
        TipoPromo:""
    });

    const handleChange = (e) =>{
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
            const res = await axios.post(`${API_URL}/api/descuentos/${ProductoId}`,formData,{
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
                "No se pudo crear el descuento"
              );
        }
    }

    if(!autenticado) return <Login/>

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
          Crear Descuento
        </button>
        </div>
      </form>
    )
}