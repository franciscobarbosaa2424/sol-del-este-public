import { useState,useEffect } from "react"
import axios from 'axios'
import toast from "react-hot-toast"
import Login from "./Login"
import { useAuth } from "../Utilities/AuthContext";
import React from 'react';
import { API_URL } from "../config";

export default function CrearCategoria(){
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

    const [formData,setFormData] = useState({
        CategoriaNombre:""
    })

    const handleChange = (e) =>{
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
            const res = await axios.post(`${API_URL}/api/categorias/crear`,formData,{
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
                "No se pudo crear la categoría"
              );
        }
    }

    if(!autenticado) return <Login/>
    
    return(
        <form 
        onSubmit={handleSubmit} 
        className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Crear Categoría</h2>

        <div className="mb-4">
        <label className="block text-gray-700 mb-1">Nombre Categoría</label>
        <input type="text" 
        name="CategoriaNombre"
        value={formData.CategoriaNombre} 
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"/>
        </div>

        <div className="flex justify-center">
        <button 
          type="submit" 
          className="w-xl bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
        >
          Crear
        </button>
        </div>
      </form>
        )
}
