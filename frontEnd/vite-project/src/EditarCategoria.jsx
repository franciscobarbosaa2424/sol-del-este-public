import { useState,useEffect } from "react"
import axios from 'axios'
import toast from "react-hot-toast"
import Login from "./Login"
import { useAuth } from "../Utilities/AuthContext";
import { useParams } from "react-router-dom";
import React from 'react';
import { API_URL } from "../config";

export default function CrearCategoria(){
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


    const {CategoriaId} = useParams();
    
   
    const [formData,setFormData] = useState({
        CategoriaNombre:""
    })

    useEffect(()=>{
      try{
            axios.get(`${API_URL}/api/categorias/${CategoriaId}`,formData,{
              withCredentials:true,
              headers: {
            "Content-Type": "application/json"
              }
            })
            .then((res)=>{
              const categoria = res.data;
              setFormData({CategoriaNombre: categoria.CategoriaNombre})})
          }catch(error){
            toast.error(error.data.mensaje || 'No se pudo cargar los datos del descuento')
          }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[CategoriaId])

    const handleChange = (e) =>{
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
      //${import.meta.env.VITE_API_URL}
        try{
            const res = await axios.patch(`${API_URL}/api/categorias/${CategoriaId}`,formData,{
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
    if(cargando) return <p>Cargando...</p>

    return(
        <form 
        onSubmit={handleSubmit} 
        className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Editar Categoría</h2>

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
          Editar
        </button>
        </div>
      </form>
        )
}
