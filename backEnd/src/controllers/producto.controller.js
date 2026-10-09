import * as productoService from "../services/producto.service.js"

    export const crear = async(req,res)=>{
        try{

            const producto = await productoService.crear({
            ProductoNombre:req.body.ProductoNombre,
            ProductoDescripcion:req.body.ProductoDescripcion,
            ProductoMarca:req.body.ProductoMarca,
            ProductoModelo:req.body.ProductoModelo,
            ProductoColor:req.body.ProductoColor,
            SubCategoriaId:parseInt(req.body.SubCategoriaId),
            ProductoStock:parseFloat(req.body.ProductoStock),
            MonedaId:parseInt(req.body.MonedaId),
            ProductoSubtotal:parseFloat(req.body.ProductoSubtotal),
            ProductoEnvio:parseFloat(req.body.ProductoEnvio),
            ProductoImagenes:req.ProductoImagenes
            })

            return res.json(producto)

        }catch (error) {
        res.status(400).json({ error: error.message });
        }
    }

    export const obtenerTodos = async(req,res) =>{
        try{
            const { query='', page = 1, limit = 12 } = req.query;
            const offset = (page - 1) * limit;

            const productos = await productoService.obtenerTodos(query,page,limit,offset)

            return res.json(productos)
        }catch (error) {
        res.status(400).json({ error: error.message });
        }
    }

     export const obtenerProductoCategoria_Subcategoria = async(req,res) =>{
        try{
            const { query='' ,page = 1, limit = 2 } = req.query;
            const offset = (page - 1) * limit;
            const{CategoriaSlug, SubCategoriaSlug} =req.params

            const productos = await productoService.obtenerProductoCategoria_Subcategoria(query, page, limit, offset, CategoriaSlug, SubCategoriaSlug)

            return res.json(productos)
        }catch (error) {
        res.status(400).json({ error: error.message });
        }
    }

     export const obtenerProductoCategoria = async(req,res)=>{
        try{
            const { query='', page = 1, limit = 2 } = req.query;
            const offset = (page - 1) * limit;
            const{CategoriaSlug} =req.params

            const productos = await productoService.obtenerProductoCategoria(query,page,limit,offset,CategoriaSlug)

            return res.json(productos)
        }catch (error) {
        res.status(400).json({ error: error.message });
        }
    }

    export const obtenerProducto = async(req,res) =>{
        try{
            const {ProductoSlug}  = req.params
            const producto = await productoService.obtenerProducto(ProductoSlug)
            return res.json(producto)
        }catch (error) {
        res.status(400).json({ error: error.message });
        }
    }

    export const editarProducto = async(req,res) =>{
        try{
        console.log("entra a editar controladora")
        const {id} = req.params;

        const producto = await productoService.editarProducto({
        ProductoNombre:req.body.ProductoNombre,
        ProductoDescripcion:req.body.ProductoDescripcion,
        ProductoMarca:req.body.ProductoMarca,
        ProductoModelo:req.body.ProductoModelo,
        ProductoColor:req.body.ProductoColor,
        SubCategoriaId:parseInt(req.body.SubCategoriaId),
        ProductoStock:parseFloat(req.body.ProductoStock),
        MonedaId:parseInt(req.body.MonedaId),
        ProductoSubtotal:parseFloat(req.body.ProductoSubtotal),
        ProductoEnvio:parseFloat(req.body.ProductoEnvio),
        ProductoImagenes:req.ProductoImagenes
        },
        id)
        return res.json(producto)
        }catch(error){
        res.status(400).json({ error: error.message });
        }
    }

    export const Eliminar = async(req,res) =>{
        try{
            const {id}  = req.params
            const respuesta = await productoService.Eliminar(id)
            return res.json(respuesta)
        }catch(error){
        res.status(400).json({ error: error.message });
        }
    }