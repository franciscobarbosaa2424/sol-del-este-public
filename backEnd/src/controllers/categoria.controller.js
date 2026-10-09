import * as categoriaService from "../services/categoria.service.js"

    export const crear = async (req,res) =>{
        try{
            const {CategoriaNombre} = req.body

            const categoria = await categoriaService.crear(CategoriaNombre)

            return res.json(categoria)
        }catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    export const obtenerCategoriasTodas = async(req,res)=>{
        try{
            const { query='', page = 1, limit = 2 } = req.query;
            const offset = (page - 1) * limit;

            const categorias = await categoriaService.obtenerCategoriasTodas({
            query: query,
            page: page,
            limit: limit,
            offset: offset
            })

            return res.json(categorias)
        }catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    export const obtenerCategorias = async(req,res) =>{
        try{
            const categorias = await categoriaService.obtenerCategorias()
            return res.json(categorias)
        }catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    export const obtenerCategoria = async(req,res) =>{
        try{
            const {CategoriaId} = req.params;
            const categoria = await categoriaService.obtenerCategoria(CategoriaId)
            res.json(categoria)
        }catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    export const editarCategoria = async(req,res) =>{
        try{
            const {CategoriaId} = req.params
            const {CategoriaNombre} = req.body

            const categoria =  await categoriaService.editarCategoria(CategoriaNombre,CategoriaId)

            return res.json(categoria)
        }catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    export const eliminarCategoria = async(req,res)=>{
        try{
            const {CategoriaId}  =req.params;
            const categoria = await categoriaService.eliminarCategoria(CategoriaId)
            res.json(categoria)
        }catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    