import * as SubcategoriaModel from "../models/subcategoria.model.js"
import {ValidarSubCategoria,ValidarSubCategoriaParcial} from "../mysql/validaciones/validacion.js"

 export const obtenerSubCategoria = async (categoria) =>{
        if(!categoria){
            throw new Error("No se obtiene la subcategoria")
        }
        
        const subcategorias = await SubcategoriaModel.obtenerSubCategoria(categoria)
        
        return subcategorias
}

export const obtenerDatosSubCategoria = async (SubCategoriaId) =>{
    if(!SubCategoriaId){
        throw new Error("No se obtiene la subcategoria")
    }

    const resultado = await SubcategoriaModel.obtenerDatosSubCategoria(SubCategoriaId)
    
    return resultado
}

export const obtenerSubCategorias = async () =>{
    const subcategorias = await SubcategoriaModel.obtenerSubCategorias()
    return subcategorias
}

export const obtenerNombreSubCategoria = async (SubCategoriaId) =>{
    if(!SubCategoriaId){
        throw new Error("No se obtiene la subcategoria")
    }

    const subcategoria = await SubcategoriaModel.obtenerNombreSubCategoria(SubCategoriaId)

    return subcategoria
}

    export const crear = async (body) =>{

        const bodyParseado = {
            CategoriaId: parseInt(body.CategoriaId),
            SubCategoriaNombre: body.SubCategoriaNombre
        }

        const resultado = await ValidarSubCategoria(bodyParseado)

        const {CategoriaId,SubCategoriaNombre} = resultado.data

        if(!resultado.success){
            throw new Error("Error al validar la SubCategoria")
        }

        const subcategoria = await SubcategoriaModel.crear(CategoriaId,SubCategoriaNombre)

        return subcategoria
    }

    export const editarSubcategoria = async (body,SubCategoriaId) =>{
  
        const resultado = await ValidarSubCategoriaParcial(body)

        if(!resultado.success){
           throw new Error("Error al validar la subcategoria al editar")
        }

        const subcategoria =  await SubcategoriaModel.editarSubcategoria(body,SubCategoriaId)

        return subcategoria
    }

    export const eliminarSubcategoria = async (SubCategoriaId) =>{
        const resultado  = await SubcategoriaModel.eliminarSubcategoria(SubCategoriaId)
        return resultado
    }