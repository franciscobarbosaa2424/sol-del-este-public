import * as CategoriaModel from "../models/categoria.model.js"
import { ValidarCategoria } from "../mysql/validaciones/validacion.js"


    export const crear = async (CategoriaNombre) =>{

        const resultado = await ValidarCategoria({CategoriaNombre:CategoriaNombre})

        if(resultado.success === false){
        throw new Error('Error al validar la Categoria')
        }

        const categoria = await CategoriaModel.crear(CategoriaNombre)

        return categoria
    }

    export const obtenerCategoriasTodas = async({
        query,
        page,
        limit,
        offset
    })=>{

        const resultado = await CategoriaModel.obtenerCategoriasTodas(query,page,limit,offset)
        
        return resultado
    }

    export const obtenerCategorias = async() =>{
        const categorias = await CategoriaModel.obtenerCategorias()

        return categorias
    }

    export const obtenerCategoria = async(CategoriaId) =>{
        if(!CategoriaId){
        throw new Error("No hay categoria")
        }

        const categoria = await CategoriaModel.obtenerCategoria(CategoriaId)

        return categoria
    }

    export const editarCategoria = async(CategoriaNombre,CategoriaId) =>{
        
        const resultado = await ValidarCategoria({CategoriaNombre:CategoriaNombre})

        if(resultado.success === false){
        throw new Error("Error al validar la categoria al editar")  
        }

        const categoria = await CategoriaModel.editarCategoria(CategoriaNombre,CategoriaId)

        return categoria
    }

    export const eliminarCategoria = async(CategoriaId)=>{
        if(!CategoriaId){
            throw new Error("No hay categoria para eliminar")
        }
        const resultado = await CategoriaModel.eliminarCategoria(CategoriaId)
        return resultado
    }