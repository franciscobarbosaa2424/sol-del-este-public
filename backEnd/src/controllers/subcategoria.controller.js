import * as subcategoriaService from "../services/subcategoria.service.js";

 export const obtenerSubCategoria = async (req,res) =>{

    try{
        const {categoria} = req.query
        const subcategorias = await subcategoriaService.obtenerSubCategoria(categoria)
        
        return res.json(subcategorias)
    } catch (error) {
    res.status(400).json({ error: error.message });
    }
}

export const obtenerDatosSubCategoria = async (req,res) =>{
    try{
    const {SubCategoriaId} = req.params
    const subcategoria = await subcategoriaService.obtenerDatosSubCategoria(SubCategoriaId)
    return res.json(subcategoria)
    }catch (error) {
    res.status(400).json({ error: error.message });
    }
}

export const obtenerSubCategorias = async (req,res) =>{
    try{
        const subcategorias = await subcategoriaService.obtenerSubCategorias()
        return res.json(subcategorias)
    }catch (error) {
    res.status(400).json({ error: error.message });
    }
}

export const obtenerNombreSubCategoria = async (req,res) =>{
    try{
        const {SubCategoriaId} = req.query;
        const subcategoria = await subcategoriaService.obtenerNombreSubCategoria(SubCategoriaId)
        return res.json(subcategoria)
    }catch (error) {
    res.status(400).json({ error: error.message });
    }
}

export const crear = async (req,res) =>{
    try{
        const body = req.body

        const subcategoria = await subcategoriaService.crear(body)

        return res.json(subcategoria)
    }catch (error) {
    res.status(400).json({ error: error.message });
    }
}

export const editarSubcategoria = async (req,res) =>{
    const {SubCategoriaId} = req.params;

    const body = {
        CategoriaId: parseInt(req.body.CategoriaId),
        SubCategoriaNombre: req.body.SubCategoriaNombre}

    const subcategoria = await subcategoriaService.editarSubcategoria(body,SubCategoriaId)

    return res.json(subcategoria)
}

export const eliminarSubcategoria = async (req,res) =>{
    try{
    const {SubCategoriaId} = req.params;
    const subcategoria = await subcategoriaService.eliminarSubcategoria(SubCategoriaId)
    return res.json(subcategoria)
    }catch (error) {
    res.status(400).json({ error: error.message });
    }

}
