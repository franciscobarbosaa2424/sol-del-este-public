import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import axios from 'axios';
import { API_URL } from "../config";

export default function ProductCard({ producto }) {

  const {
    ProductoId,
    ProductoNombre,
    ProductoTotal,
    MonedaId,
    ProductoImagenes
  } = producto;


  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/prenda/${producto.ProductoSlug}`);
  };

  const [descuentos, setDescuentos] = useState([])
  const [ProductoConDescuento,setProductoConDescuento] = useState(0.00)
  const [MonedaSimbolo, setMonedaSimbolo] = useState("")

  useEffect(()=>{
   
    axios.get(`${API_URL}/api/descuentos?ProductoId=${ProductoId}`)
    .then((res) => {
        setDescuentos(res.data.descuentos)   
    })
    .catch(console.error("Error al obtener descuentos del producto"))
  },[ProductoId]);
  
  useEffect(()=>{
    if(!producto) return;
    if(!descuentos) return;
    aplicarDescuentos(descuentos) 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[descuentos])

  function aplicarDescuentos(descuentos) {
    let precioAuxiliar = ProductoTotal;
      //cuando hay un solo descuento hay un objeto
      //cuando hay varios descuentos hay un array
    const lista = Array.isArray(descuentos) ? descuentos : [descuentos]
      
    lista.forEach(d => {
    const descuento = (100 - d.DescuentoPorcentaje) / 100;
    precioAuxiliar = precioAuxiliar * descuento;
    });  

    setProductoConDescuento(precioAuxiliar);
  }

  useEffect(() => {
      if(!MonedaId) return;
      axios.get(`${import.meta.env.VITE_API_URL}/api/monedas/nombre?MonedaId=${MonedaId}`)
      .then(res => setMonedaSimbolo(res.data[0].MonedaSimbolo))
      .catch(console.error("Error al obtener el producto"))
    },[MonedaId])

  return (
     <div
      onClick={handleClick}
      className="bg-white shadow hover:shadow-lg overflow-hidden flex flex-col cursor-pointer w-xs rounded-lg w-full"
    >
      <div className="w-full rounded-lg">     
        <img
          src={ProductoImagenes?.[0]?.ProductoImagenURL}
          alt={ProductoNombre}
          className="w-full sm:h-44 md:h-96 object-contain bg-white sm:p-1"
        />
        
      </div>
      <div className="p-3 flex-grow flex flex-col">
        <h3 className="text-sm font-bold text-gray-800 mb-2">{ProductoNombre}</h3>
        {/* Precio */}
        <div className="text-sm text-gray-700 mb-2">
            <span className={`font-semibold ${descuentos.length > 0 ? "line-through text-red-500" : ""}`}> {parseFloat(ProductoTotal).toFixed(2)} {MonedaSimbolo}</span>
            <span className={`${descuentos.length > 0 ? "visible font-semibold" : "invisible"}`}>{} {parseFloat(ProductoConDescuento).toFixed(2)} {MonedaSimbolo}</span>
        </div>
      </div>
    </div>
  );
}
