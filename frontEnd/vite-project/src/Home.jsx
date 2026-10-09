import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import React from 'react';


export default function Home() {
  useEffect(() => {
  const timer = setTimeout(() => {
    window.dispatchEvent(new Event("resize"));
  }, 100);

  return () => clearTimeout(timer);
}, []);


const settings = {
      infinite: true,
      speed: 900,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows:true,
      autoplay: true,
      autoplaySpeed: 2700,
      pauseOnHover: true,
      adaptiveHeight: false,
    };


  return (
  
    <div className="min-h-screen flex flex-col">

     <div className="w-screen relative -mt-12">
        <Slider {...settings}>   
           <div className="w-full overflow-hidden">
          <div>
            <img
              src="/img/slider-1.jpg"
              className="w-full h-[280px] object-cover"
              alt="Slide 1"
            />
          </div>
          </div>

          <div className="w-full overflow-hidden">
          <div>
            <img
              src="/img/slider-2.jpg"
              className="w-full h-[280px] object-cover"
              alt="Slide 2"
            />
          </div>
          </div>
         
           <div className="w-full overflow-hidden">
          <div>
            <img
              src="/img/slider-3.jpg"
              className="w-full h-[280px] object-cover"
              alt="Slide 3"
            />
          </div>
          </div>
          
        </Slider>
      </div>

      
<div className="flex items-center justify-center gap-3">
  <span className="w-16 h-px bg-stone-400"></span>
  <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
  <span className="w-16 h-px bg-stone-400"></span>
</div>

      <div className="max-w-3xl mx-auto px-6 text-center text-stone-700 mb-3">
  <h1 className="text-4xl md:text-5xl font-light tracking-wide mb-2">
    Sol del Este
  </h1>

  <h3 className="text-sm uppercase tracking-widest text-stone-500 mb-8">
    Tejidos artesanales hechos a mano
  </h3>


  <p className="text-base md:text-lg leading-relaxed mb-4">
    Piezas únicas de crochet, tejidas a mano con dedicación, paciencia  
    y amor por cada detalle.
  </p>

  <p className="text-base md:text-lg leading-relaxed mb-4">
    Inspirados en lo simple, lo natural y lo auténtico,  
    creamos tejidos cálidos, duraderos y llenos de personalidad.
  </p>

  <p className="text-base md:text-lg leading-relaxed mb-6">
    Nada se produce en serie: cada prenda tiene su propio tiempo  
    y su propia historia.
  </p>

  <p className="italic text-stone-600 mb-6">
    Abrigo · dedicación · diseño artesanal
  </p>

  <p className="text-base md:text-lg font-medium">
    ✨ Descubrí nuestras creaciones y llevate  
    un pedacito de sol tejido a mano
  </p>
</div>
<div className="flex items-center justify-center gap-3 my-8">
  <span className="w-16 h-px bg-stone-400"></span>
  <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
  <span className="w-16 h-px bg-stone-400"></span>
</div>

<Link
  to="/catalogo"
  className="inline-flex items-center justify-center mx-auto gap-2 px-5 py-2 bg-[#7A4A3C] text-white rounded-full"
>
  Ver Catálogo 🔍
</Link>

<div className="flex items-center justify-center gap-3 my-8">
  <span className="w-16 h-px bg-stone-400"></span>
  <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
  <span className="w-16 h-px bg-stone-400"></span>
</div>

<div className="max-w-3xl mx-auto px-6 text-center text-stone-700 mb-3">
<h3 className="text-sm uppercase tracking-widest text-stone-500 mb-8">
    Contacto
</h3>

<div className="flex items-center justify-center gap-2 mx-auto">
<a href="https://www.instagram.com/soldelestetejidos/">
<InstagramIcon />
</a>
<a href="https://www.instagram.com/soldelestetejidos/">
<h3>@soldelestetejidos</h3>
</a>

<a href="https://wa.me/+59898758707">
<WhatsAppIcon />
</a>
<a href="https://wa.me/+59898758707">
<h3>098 758 707</h3>
</a>
</div>



</div>
    </div>

   

   
  );
}

