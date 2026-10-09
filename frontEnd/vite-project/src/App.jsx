// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Productos from "./Productos";
import Navbar from "./Navbar";
import ProductDetail from "./ProductDetail";
import CrearProducto from "./CrearProducto";
import Login from "./Login"
import CrearUsuario from "./CrearUsuario";
import CrearCategoria from "./CrearCategoria";
import CrearSubCategoria from "./CrearSubCategoria";
import { ErrorBoundary } from "../Utilities/ErrorBoundaries";
import './index.css';
import ProductList from "./ProductList";
import EditarProducto from "./EditarProducto";
import CrearGrupoDescuento from "./CrearGrupoDescuento";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "../Utilities/ProtectedRoute";
import WhatsAppIcono from "./WhatsAppIcono";
import Descuentos from "./Descuentos"
import EditarDescuento from "./EditarDescuento";
import CrearDescuento from "./CrearDescuento";
import Categorias from "./Categorias";
import EditarCategoria from "./EditarCategoria"
import EditarSubCategoria from "./EditarSubCategoria";


function App() {
  return (
    <>
    <Router> 
      <Navbar />
      <div className="min-h-screen pt-20 bg-[#EFE6DA]">
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/catalogo" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
          <Productos />
          </ErrorBoundary>
          } />

        <Route path="/prenda/:ProductoSlug" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
          <ProductDetail />
          </ErrorBoundary>
          } />
        
        <Route path="/editar/:ProductoSlug" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
          <EditarProducto />
          </ErrorBoundary>
          } />
        
        <Route path="/catalogo/:CategoriaSlug" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
          <ProductList />
          </ErrorBoundary>
          } />

        <Route path="/catalogo/:CategoriaSlug/:SubCategoriaSlug" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
          <ProductList />
          </ErrorBoundary>
          } />


        <Route path="/editar/subcategoria/:SubCategoriaId" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
          <ProtectedRoute>
            <EditarSubCategoria/>
          </ProtectedRoute>
          </ErrorBoundary>
          } />

        <Route path="/editar/categoria/:CategoriaId" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
            <ProtectedRoute>
              <EditarCategoria />
            </ProtectedRoute>
          </ErrorBoundary>
          } />

        <Route path="/crear-descuento/:ProductoId" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
            <ProtectedRoute>
              <CrearDescuento/>
            </ProtectedRoute>
          </ErrorBoundary>
          } />

      <Route path="/categorias" element={
        <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
          <ProtectedRoute>
              <Categorias />
          </ProtectedRoute>
        </ErrorBoundary>
        } />

        <Route path="/descuentos/:ProductoId" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse con soporte.</>}>
            <ProtectedRoute>
              <Descuentos />
            </ProtectedRoute>
          </ErrorBoundary>
          }/>

          
        <Route path="/descuento/:DescuentoId" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse con soporte.</>}>
            <ProtectedRoute>
              <EditarDescuento/>
            </ProtectedRoute>   
          </ErrorBoundary>
          }/>
 
 
           <Route path="/login" element={
            <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
            <Login />
            </ErrorBoundary>
            } />

            <Route path="/crear-producto" element={
              <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
                <ProtectedRoute>
                  <CrearProducto />
                </ProtectedRoute>
              </ErrorBoundary>
              } />

            <Route path="/crear-usuario" element={
              <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
                <ProtectedRoute>
                  <CrearUsuario />
                </ProtectedRoute>
              </ErrorBoundary>
              } />

            <Route path="/crear-grupo-descuento" element={
              <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
                <ProtectedRoute>
                  <CrearGrupoDescuento />
                </ProtectedRoute>
              </ErrorBoundary>
            }/>

            <Route path="/crear-categoria" element={
            <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
            <ProtectedRoute>
                <CrearCategoria />
            </ProtectedRoute>
            </ErrorBoundary>
            } />

            <Route path="/categoria/crear-subcategoria/:categoria" element={
            <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
              <ProtectedRoute>
                <CrearSubCategoria />
              </ProtectedRoute>
            </ErrorBoundary>
            } />
        
        <Route path="/:CategoriaSlug/:SubCategoriaSlug" element={
          <ErrorBoundary fallback={<>No se pudo cargar esta sección. Contactarse al 092212572</>}>
          <ProductList />
          </ErrorBoundary>
          } />
      </Routes>
    </div>
    </Router>
    <WhatsAppIcono/>
    </>
  );
}

export default App;

