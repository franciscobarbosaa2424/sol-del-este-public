// src/pages/Productos.jsx
import ProductList from "./ProductList";
import React from 'react';

export default function Productos() {
  return (
    <div className="min-h-screen bg-[#EFE6DA] p-6">
      {/*<h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Catálogo</h1>*/}
      <ProductList />
    </div>
  );
}
