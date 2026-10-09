import { useState,useEffect } from "react";
import axios from "axios";
import { MdImage,MdClose } from "react-icons/md";
import { Listbox } from "@headlessui/react";
//import toast from "react-hot-toast"
import Login from "./Login"
import toast from "react-hot-toast";
import { useAuth } from "../Utilities/AuthContext";
import React from 'react';
import { API_URL } from "../config";


const CrearProducto = () => {
  const[categorias,setCategorias]=useState([]);
  const[subcategorias,setSubcategorias]=useState([]);
  const[monedas,setMonedas]=useState([]);
  const[categoria,setCategoria] = useState(0);

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
    axios.get(`${API_URL}/api/monedas`)
    
    .then(res => setMonedas(res.data))
    .catch(err => console.error(err))
  },[])

  useEffect(()=> {
    axios.get(`${API_URL}/api/categorias`)
    .then(res => setCategorias(res.data))
    .catch(err => console.error(err))
  },[])

   useEffect(()=> {
    axios.get(`${API_URL}/api/subcategorias/sub?categoria=${categoria}`)
    .then(res => setSubcategorias(res.data))
    .catch(err => console.error(err))
  },[categoria])

  const [formulario, setFormulario] = useState({
        ProductoNombre:"",
        ProductoDescripcion:"",
        ProductoMarca:"",
        ProductoModelo:"",
        ProductoColor:"",
        ProductoStock:"1.00",
        MonedaId:1,
        ProductoSubtotal:"0.00",
        ProductoEnvio:"0.00",
        SubCategoriaId:0,       
  });

  const [imagenes, setImagenes] = useState([]);

  const [isDragging, setDragging] = useState(false)

  const [files, setFiles] = useState(null)

  const [imagesUrl, setImagesUrl] = useState([])

  const [imageDeleted, setImageDeleted] = useState([])

  useEffect(() => {

    if(!files || files?.length === 0) return;
  
    const imagesPreview  = Array.from(files).map(file => URL.createObjectURL(file));
    setImagesUrl(imagenAnterior=> [...imagenAnterior,...imagesPreview])
    setImagesUrl(imagesPreview)

    return () => {
      imagesUrl.forEach(image => URL.revokeObjectURL(image))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value})};

  const handleImagenes = (e) => {
    e.preventDefault();
    if (e.target?.files) handleFiles(e.target.files);
  };

  const handleDragOver= (e) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave= () => {
    setDragging(false);
  };
  
  const handleDrop= (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  function deleteImage(imagen){
    setImageDeleted(imagen)
  }
  useEffect(()=> {
    for(const url of imagesUrl){
     if (imageDeleted == url){
      imagesUrl.pop()
      setImageDeleted([])
     } 
    }
  },[imageDeleted,imagesUrl])

  function handleFiles(fileList){
    const archivos = Array.from(fileList);

    if(!archivos || !archivos.every((file) => file.type.startsWith("image/"))){
      setFiles(null);
      return;
    } 
    
    setFiles(fileList); // si aún lo usás
    setImagenes(archivos);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(imagenes.length === 0){
      toast.error("El producto debe tener al menos una imagen")
      return
    }

    const formData = new FormData();

    // Agregar todos los campos del formulario
    for (const key in formulario) {
      formData.append(key, formulario[key]);
    }

    // Agregar imágenes
    for (let i = 0; i < imagenes.length; i++) {
      formData.append("imagen", imagenes[i]);
    }

    try {
      await axios.post(`${API_URL}/api/productos/crear`, formData, {
        withCredentials:true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await checkAuth();

      toast.success("Producto creado exitosamente");
      
    } catch (error) {
          toast.error(
            error.response?.data?.mensaje ||
            "Error al crear producto"
          );
    }
  };

  if(!autenticado) return <Login/>

  return (
    <div className="min-h-screen overflow-y-auto">
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow space-y-4 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-4">Crear Producto</h2>

      {[
        ["ProductoNombre", "Nombre del producto"],
        ["ProductoDescripcion", "Descripción", "textarea"],
        ["ProductoMarca", "Marca"],
        ["ProductoModelo", "Modelo"],
        ["ProductoColor", "Color"],
        ["ProductoStock", "Stock", "number"],
        ["ProductoSubtotal", "Total", "number"],
        ["ProductoEnvio", "Costo de Envío", "number"],
        
      ].map(([name, label, type = "text"]) => (
        <div key={name}>
          <label htmlFor={name} className="block font-medium text-gray-700">
            {label}
          </label>
          {type === "textarea" ? (
            <textarea
              name={name}
              id={name}
              required
              value={formulario[name]}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          ) : (
            <input
              type={type}
              name={name}
              id={name}
              required
              step="0.01"
              value={formulario[name]}
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-md p-2"
            />
          )}
        </div>
      ))}

      <div className="">
      <h4 className="p-2">Categoría</h4>
      <Listbox value={categoria} onChange={setCategoria}>
        <div className="relative">
          <Listbox.Button className="border border-gray-300 rounded px-3 py-2 text-sm w-48 bg-white">
            {categoria
              ? categorias.find((c) => c.CategoriaId === categoria)?.CategoriaNombre
              : " ▼ Seleccionar categoría"}
          </Listbox.Button>
          <Listbox.Options className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-40 overflow-y-auto">
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
      </div>

      <div>
      <h4 className="p-2">Subcategoría</h4>
      <Listbox value={formulario.SubCategoriaId} onChange={(value)=>{setFormulario((prev)=>({...prev,SubCategoriaId:value}))}}>
        <div className="relative">
          <Listbox.Button className="border border-gray-300 rounded px-3 py-2 text-sm w-48 bg-white">
            {formulario.SubCategoriaId
              ? subcategorias.find((c) => c.SubCategoriaId === formulario.SubCategoriaId)?.SubCategoriaNombre
              : " ▼ Seleccionar subcategoría"}
          </Listbox.Button>
          <Listbox.Options className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-40 overflow-y-auto">
            <Listbox.Option key={0} value={0} className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer">
              (Todas)
            </Listbox.Option>
            {subcategorias.map((cat) => (
              <Listbox.Option
                key={cat.SubCategoriaId}
                value={cat.SubCategoriaId}
                className="px-3 py-2 text-sm hover:bg-blue-100 cursor-pointer"
              >
                {cat.SubCategoriaNombre}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>  
      </div>

      <select name="MonedaId" value={formulario.MonedaId} onChange={handleChange}>
        <option value="">Seleccionar moneda</option>
        {monedas.map(mon => (
          <option key={mon.MonedaId} value={mon.MonedaId}>{mon.MonedaNombre}</option>
        ))}
      </select>



      {/*AGREGAR IMAGENES*/}
      <div className="min-w-64 max-w-7xl min-h-64 bg-white shadow-xl rounded-lg p-2 flex flex-col justify-center items-center">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-4 border-dashed w-full h-full rounded-lg p-1 flex-1 flex justify-center items-center
          ${isDragging ? 'text-gray-400 border-gray-400 bg-gray-100' : 'text-gray-200 border-gray-200'
          }`}>
        
        { imagesUrl.length == 0 ? (
          <div className="flex justify-center items-center h-full pointer-events-none">
            <div className="flex flex-col justify-center items-center w-full h-full">
              <MdImage size={100} />
              <label
                htmlFor="imageChooser"
                className="pointer-events-auto mt-2 leading-8 bg-gray-500 text-white py-2 px-4 w-47 h-13 rounded-lg hover:brightness-110"
              >
                Seleccionar imágenes
              </label>
              <input
                onChange={handleImagenes}
                className="hidden"
                id="imageChooser"
                type="file"
                accept="image/*"
                multiple
              />
              </div>
            </div>) : (
            
            <div className="w-full h-full flex justify-center align-top flex-wrap gap-1">
              {imagesUrl.map((image, index) => (
              <div key={index} className="relative">
              <img src={image} className="aspect-video w-32 rounded-md border-gray-700 border-1" />
              <MdClose onClick={() =>deleteImage(image)} size={25} className="absolute top-0 right-0 text-white bg-gray-600 rounded-3xl" />
              </div>
              ))}
            </div>)}
      </div>
      </div>

      <div className="pt-4 flex justify-center">
        <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 transition w-xl">
          Crear Producto
        </button>
      </div>
    </form>
    </div>
  );
};

export default CrearProducto;
