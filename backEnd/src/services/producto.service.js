import * as ProductoModel from "../models/producto.model.js"
import { validarProducto,validarProductoParcial } from "../mysql/validaciones/validacion.js";

export const crear = async({
        ProductoNombre,
        ProductoDescripcion,
        ProductoMarca,
        ProductoModelo,
        ProductoColor,
        SubCategoriaId,
        ProductoStock,
        MonedaId,
        ProductoSubtotal,
        ProductoEnvio,
        ProductoImagenes
    }) =>{
    
    const body = {
        ProductoNombre:ProductoNombre,
        ProductoDescripcion:ProductoDescripcion,
        ProductoMarca:ProductoMarca,
        ProductoModelo:ProductoModelo,
        ProductoColor:ProductoColor,
        SubCategoriaId:SubCategoriaId,
        ProductoStock:ProductoStock,
        MonedaId:MonedaId,
        ProductoSubtotal:ProductoSubtotal,
        ProductoEnvio:ProductoEnvio,
        ProductoImagenes:ProductoImagenes
    }

        const resultado= await validarProducto(body)

        if (resultado.success === false) {
        throw new Error({ error: resultado.error.flatten() });
        }
        
        const producto = await ProductoModel.crear(body)

        return producto
    }

    export const obtenerTodos = async(
      query,
      page,
      limit,
      offset  
    ) =>{

        const resultado = await ProductoModel.obtenerTodos(query,page,limit,offset)
        return resultado
    }

    export const obtenerProductoCategoria_Subcategoria = async(
        query,
        page,
        limit,
        offset,
        CategoriaSlug,
        SubCategoriaSlug) =>{
            
        const productos = await ProductoModel.obtenerProductoCategoria_Subcategoria(query, page, limit, offset, CategoriaSlug, SubCategoriaSlug)
        return productos
    }

    export const obtenerProductoCategoria = async(
        query,
        page,
        limit,
        offset,
        CategoriaSlug
    ) =>{

        if(CategoriaSlug.length===0){
        throw new Error('No se encuentra categoria')
        }

        const productos = await ProductoModel.obtenerProductoCategoria(query,page,limit,offset,CategoriaSlug)

        return productos
    }

    export const obtenerProducto = async(ProductoSlug) =>{
        if(!ProductoSlug){
        throw new Error("No hay producto")
        }

        const producto = await ProductoModel.obtenerProducto(ProductoSlug)

        return producto
    }

    export const editarProducto = async({
        ProductoNombre,
        ProductoDescripcion,
        ProductoMarca,
        ProductoModelo,
        ProductoColor,
        SubCategoriaId,
        ProductoStock,
        MonedaId,
        ProductoSubtotal,
        ProductoEnvio,
        ProductoImagenes
        },
        id) =>{

        const body = {
        ProductoNombre:ProductoNombre,
        ProductoDescripcion:ProductoDescripcion,
        ProductoMarca:ProductoMarca,
        ProductoModelo:ProductoModelo,
        ProductoColor:ProductoColor,
        SubCategoriaId:SubCategoriaId,
        ProductoStock:ProductoStock,
        MonedaId:MonedaId,
        ProductoSubtotal:ProductoSubtotal,
        ProductoEnvio:ProductoEnvio,
        ProductoImagenes:ProductoImagenes
        }

        const resultado = await validarProductoParcial(body);

        if (resultado.success===false) {
        throw new Error(resultado.error.flatten())
        }

        console.log("pasa validaciones")
        const producto = await ProductoModel.editarProducto(body,id)

        return producto
    }

    export const Eliminar = async(id) =>{
        if(!id){
        throw new Error("No hay producto para eliminar")
        }
        const respuesta = await ProductoModel.Eliminar(id)
        return respuesta
    }