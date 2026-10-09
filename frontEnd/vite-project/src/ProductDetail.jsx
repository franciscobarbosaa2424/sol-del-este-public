import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactImageMagnify from 'react-image-magnify';
import './index.css';
import { MdClose } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from "react-hot-toast";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { API_URL } from "../config";


export default function ProductDetail() {
    const {ProductoSlug} = useParams();
    const [producto, setProducto] = useState();
    const [mainImage, setMainImage] = useState(); 
    const [selected, setSelected] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [SubCategoriaNombre,setSubCategoriaNombre] = useState("");
    const SubCategoriaId = producto?.SubCategoriaId;
    const [MonedaSimbolo, setMonedaSimbolo] = useState("")
    const MonedaId = producto?.MonedaId
    const [auth, setAuth] = useState(false)
    const [descuentos, setDescuentos] = useState([])
    const [ProductoConDescuento,setProductoConDescuento] = useState(0.00)
    const ProductoIdAux = producto?.ProductoId
    const [mensajeEliminar, setMensajeEliminar] = useState(false);


    const navigate = useNavigate();

    useEffect(()=>{
      if(!ProductoIdAux) return;

      axios.get(`${API_URL}/api/descuentos?ProductoId=${ProductoIdAux}`)
      .then((res) => {
      setDescuentos(res.data.descuentos)   
    })
      .catch(console.error("Error al obtener el producto"))

    },[ProductoIdAux]);

    useEffect(()=>{
      if(!producto) return;
      if(!descuentos) return;

      aplicarDescuentos(descuentos)
      
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[descuentos])


    useEffect(() => {
        axios.get(`${API_URL}/api/util/auth/estado`, { withCredentials: true })
        
          .then(res => {setAuth(res.data.autenticado)});
      }, []);
    

    // Detectar tamaño de pantalla
    useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 768); // md breakpoint
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() =>{
        axios.get(`${API_URL}/api/productos/prenda/${ProductoSlug}`)
        .then(response => setProducto(response.data))
        .catch(console.error("Error al obtener el producto:"));
        },[ProductoSlug]);
    
    useEffect(() => {
      if(!SubCategoriaId) return;
      axios.get(`${API_URL}/api/subcategorias/nombre?SubCategoriaId=${SubCategoriaId}`)
      .then(res => setSubCategoriaNombre(res.data[0].SubCategoriaNombre))
      .catch(console.error("Error al obtener el producto"))
    },[SubCategoriaId])

    useEffect(() => {
      if(!MonedaId) return;
      axios.get(`${API_URL}/api/monedas/nombre?MonedaId=${MonedaId}`)
      .then(res => setMonedaSimbolo(res.data[0].MonedaSimbolo))
      .catch(console.error("Error al obtener el producto"))
    },[MonedaId])

    useEffect(() => {
    if (producto?.ProductoImagenes?.length > 0) {
    setMainImage(producto.ProductoImagenes[0].ProductoImagenURL);
    }
    }, [producto]);

    
    const abrirLink = async () => {
      try{
      const res = await axios.post(`${API_URL}/api/util/mensaje`,
      {
        FormularioURL:`https://www.soldelestetejidos.com/prenda/${ProductoSlug}`
      },
      {withCredentials: true}
      )
    
      const {productoURL}= res.data

      window.open(productoURL,"_blank"); // _blank = nueva pestaña
      
      }catch{
      toast.error("No se pudo abrir el chat")
      }
      
    };


    if (!producto) {
    return <div className="p-6">Cargando producto...</div>;
    }
    
     const {
        ProductoId,
        ProductoNombre,
        ProductoDescripcion,
        ProductoMarca,
        ProductoModelo,
        ProductoColor,
        ProductoStock,
        ProductoSubtotal,
        ProductoEnvio,
        ProductoTotal,
        ProductoImagenes
    } = producto; 

    const settings = {
      dots: true,
      infinite: true,
      speed: 900,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
    };

    const eliminar = async(ProductoId)=> {

          
          try{
          const res = await axios.delete(`${API_URL}/api/productos/prenda/${ProductoId}`,{
            withCredentials:true,
            headers: {
                    "Content-Type": "application/json",
                  }
          })

          toast.success(res.data.mensaje)
          }catch(error){
              toast.error(error.response?.data?.mensaje || "No se pudo eliminar la prenda")
          }
    }

    const editarProducto = () =>{
      if(!producto) return;
      navigate(`/editar/${producto.ProductoSlug}`)
    }

    const descuentosNavigate = () =>{
      if(!producto) return;
      navigate(`/descuentos/${producto.ProductoId}`)
    }

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

    
    



    return (
<>
            {mensajeEliminar && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md animate-fade-in">
                  
                  <h2 className="text-lg font-semibold mb-2">
                    ¿Eliminar producto?
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
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                    onClick={()=>{eliminar(ProductoId),setMensajeEliminar(false)}}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}

      <div className="max-w-5xl mx-auto p-6 gap-8 bg-[#EFE6DA]">

        
        
            {auth && (
              <div className="grid grid-cols-3 gap-6">
              <button className="bg-black text-white p-2 rounded" onClick={editarProducto}>
                Editar Producto
              </button>
              <button className="bg-black text-white p-2 rounded" onClick={descuentosNavigate}>
                Descuentos
              </button>
              <button className="bg-red-500 text-white p-2 rounded" onClick={()=>setMensajeEliminar(true)}>
                Eliminar Producto
              </button>
              </div>
            )}
        

        <h1 className="text-3xl font-light tracking-wide mb-8 text-center uppercase">{ProductoNombre}</h1>
        
        <div>
          {/* 
          CONFIGURACION QUE TAMBIEN QUEDA BIEN: 
          largeImage: {
                src: mainImage,
                width: 1600,
                height: 1000,
              },
              enlargedImageContainerDimensions: { width: '325%', height: '100%',},
          */}
        <div className={`flex ${isMobile ? "justify-center items-center": "px-30"} gap-4 w-full mx-auto`}>
        <div className="flex-shrink-0 w-11/12 sm:w-64 aspect-[4/5] border-4 border-gray-300 rounded-lg overflow-visible bg-gray-100 flex items-center justify-center">
          {isMobile ? 
          <img onClick={()=>setSelected(true)} src={mainImage} alt="Imagen principal" className="max-h-full max-w-full object-contain" />
          :
            <div onClick={()=>setSelected(true)}>
            <ReactImageMagnify
            {...{
              smallImage: {
                src: mainImage,
                isFluidWidth: true,
                style: {objectFit: 'contain'}
              },
              largeImage: {
                src: mainImage,
                width: 3200,
                height: 2000,
              },
              enlargedImageContainerDimensions: { width: '700%', height: '100%'},
              enlargedImagePosition: 'beside', 
              shouldUsePositiveSpaceLens: true,
            }}
          />
          </div>
          } 
        </div>

        {isMobile===false && (
        <ul className="grid grid-cols-1 text-gray-700 px-16 gap-0.5 mt-3">
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Modelo:</strong> {ProductoModelo}</li>
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Color:</strong> {ProductoColor}</li>
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Stock:</strong> {ProductoStock > 0 ? ProductoStock  : "A consultar"}</li>
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Subtotal:</strong> {parseFloat(ProductoSubtotal).toFixed(2)}</li>
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Envío:</strong> {parseFloat(ProductoEnvio).toFixed(2)}</li>
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Total:</strong> <span className={`font-semibold ${descuentos.length > 0 ? "line-through text-red-500" : ""}`}>{} {parseFloat(ProductoTotal).toFixed(2)} {MonedaSimbolo}</span>
            <span className={`${descuentos.length > 0 ? "visible font-semibold" : "invisible"}`}>{} {parseFloat(ProductoConDescuento).toFixed(2)} {MonedaSimbolo}</span></li>
          </ul>
          )}
      </div>

          {/* Miniaturas */}
          <div className={`flex gap-2 ${isMobile ? "justify-center" : "px-30"} flex-wrap
          mt-4`}>
            {ProductoImagenes.slice(0,5).map((img, idx) => {
              if (idx === 4 && ProductoImagenes.length > 5) {
                const restantes = ProductoImagenes.length - 5;
                return (
              <div
                key="extra"
                onClick={() => setSelected(true)} 
                className="w-16 h-16 flex items-center justify-center bg-black text-white text-sm font-semibold rounded cursor-pointer mt-3"
              >
                +{restantes}
              </div>
            );
              }

              return(
              <img
                key={idx}
                src={img.ProductoImagenURL}
                onClick={() => setMainImage(img.ProductoImagenURL)}
                className={`w-12 h-auto cursor-pointer border-2 rounded transition ${
                  mainImage === img ? 'border-blue-500' : 'border-transparent hover:border-blue-400'
                }`}
                alt={`Miniatura ${idx + 1}`}
              />
              )
      })}
      </div>
        </div>

      {selected && (
        isMobile ? (
              <div className="fixed inset-0 z-50 flex flex-col justify-center items-center  bg-opacity-80 bg-black ">         
              <MdClose
                    onClick={() => setSelected(false)}
                    size={25}
                    className="absolute top-4 right-4 text-white bg-gray-700 rounded-full p-1 cursor-pointer z-50"
                  />
              <div
                  className="w-11/12 max-w-3xl p-4 relative bg-black"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <Slider {...settings}>
                    {ProductoImagenes.map((img, idx) => (
                      <div key={idx} className="flex justify-center items-center w-full">
                      <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={4}
                        pinch={{ step: 24 }}
                        doubleClick={{ disabled: false }}
                      >
                        <TransformComponent>
                              <img key={idx} src={img.ProductoImagenURL} 
                              className={`w-full h-[70vh] max-h-[80vh] object-contain block rounded-lg
                              `}/>
                       </TransformComponent>
                       </TransformWrapper>
                        </div>
                    ))}
                  </Slider>
                </div>
                </div>
        ) 
        :
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center  bg-opacity-80 bg-black ">         
              <MdClose
                    onClick={() => setSelected(false)}
                    size={25}
                    className="absolute top-4 right-4 text-white bg-gray-700 rounded-full p-1 cursor-pointer z-50"
                  />
              <div
                  className="w-11/12 max-w-3xl p-4 relative bg-black"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <Slider {...settings}>
                    {ProductoImagenes.map((img, idx) => (
                      <div key={idx} className="flex justify-center items-center w-full">
                              <img key={idx} src={img.ProductoImagenURL} 
                              className={`w-full h-[70vh] max-h-[80vh] object-contain block rounded-lg
                              `}/>                     
                        </div>
                    ))}
                  </Slider>
                </div>
                </div>
          )}


          {isMobile && (
            <ul className="text-sm text-gray-700 space-y-2 p-10">
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Modelo:</strong> {ProductoModelo}</li>
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Color:</strong> {ProductoColor}</li>
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Stock:</strong> {ProductoStock > 0 ? ProductoStock  : "A consultar"}</li>
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Subtotal:</strong> {parseFloat(ProductoSubtotal).toFixed(2)}</li>
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Envío:</strong> {parseFloat(ProductoEnvio).toFixed(2)}</li>
            <li className="text-sm uppercase tracking-widest text-stone-500 mb-8"><strong>Total:</strong> <span className={`font-semibold ${descuentos.length > 0 ? "line-through text-red-500" : ""}`}>{} {parseFloat(ProductoTotal).toFixed(2)} {MonedaSimbolo}</span>
            <span className={`${descuentos.length > 0 ? "visible font-semibold" : "invisible"}`}>{} {parseFloat(ProductoConDescuento).toFixed(2)} {MonedaSimbolo}</span></li>
              </ul>
              )}
        
          <p className="text-base text-gray-700 md:text-lg leading-relaxed mb-4 mt-15">{ProductoDescripcion}</p>

        
          
          <button onClick={()=>abrirLink()} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition cursor-pointer">
            Consultar por WhatsApp
          </button>
      
      </div>

</>
    );
}
