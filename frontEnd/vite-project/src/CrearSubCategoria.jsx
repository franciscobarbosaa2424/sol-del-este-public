import { useState,useEffect } from "react";
import axios from 'axios';
import { Listbox } from "@headlessui/react";
import toast from "react-hot-toast";
import { useAuth } from "../Utilities/AuthContext";
import Login from "./Login"
import { useParams } from "react-router-dom";
import React from 'react';
import { API_URL } from "../config";


export default function CrearSubCategoria(){
    const{categoria} = useParams();
    const[categorias,setCategorias]=useState([]);

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

     useEffect(()=> {
        axios.get(`${API_URL}/api/categorias`)
        .then(res => setCategorias(res.data))
        .catch(err => console.error(err))
      },[])

    const [formData,setFormData] = useState({
        CategoriaId:0,
        SubCategoriaNombre:""
    })

    useEffect(()=>{
      if(categorias.length === 0) return
      setFormData({
        CategoriaId:Number(categoria),
        SubCategoriaNombre:""
      });
    },[categoria,categorias])

    const handleChange = (e) =>{
        setFormData({
        ...formData,
        [e.target.name]: e.target.value
    })
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()

        try{
            const res = await axios.post(`${API_URL}/api/subcategorias`,formData,{
              withCredentials:true,
                headers: {
            "Content-Type": "application/json"
          }
        })

        await checkAuth();

        toast.success(res.data.mensaje)
        
        }catch(e){
            toast.error(
                e.response?.data?.mensaje ||
                "No se pudo crear la subcategoria"
              );
        }
    }

    if(!autenticado) return <Login/>

    return(
        <form 
        onSubmit={handleSubmit} 
        className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-4"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">Crear Subcategoría</h2>

        <Listbox value={formData.CategoriaId} onChange={(value) =>{
          setFormData((prev)=>({
            ...prev,
            CategoriaId: value
          }))
          }}>
        <div className="relative">
          <Listbox.Button className="border border-gray-300 rounded px-3 py-2 text-sm w-48 bg-white">
            {formData.CategoriaId
              ? categorias.find((c) => c.CategoriaId === formData.CategoriaId)?.CategoriaNombre
              : " ▼ Seleccionar categoría"}
          </Listbox.Button>
          <Listbox.Options className="absolute mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-40 overflow-y-auto">
            <Listbox.Option key={0} value={0} className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer">
              (Todas)
            </Listbox.Option>
            {categorias.map((cat) => (
              <Listbox.Option
                key={cat.CategoriaId}
                value={cat.CategoriaId}
                className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer"
              >
                {cat.CategoriaNombre}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox> 

        <div className="mb-4">
        <label className="block text-gray-700 mb-1">Nombre Subcategoría</label>
        <input type="text" 
        name="SubCategoriaNombre"
        value={formData.SubCategoriaNombre} 
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
