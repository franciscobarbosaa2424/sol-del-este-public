import connection from "../mysql/db.js";
import slugify from "slugify";
import { createId } from '@paralleldrive/cuid2';

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

        const id = createId();

        const slug = await slugifyTexto(ProductoNombre)
        const respuesta = await verificarNombreSlug(slug)

        if(respuesta.error){
         throw new Error("Ya existe el nombre del producto");
        }

        try{
            await connection.query(
            `INSERT INTO producto (
            ProductoId, 
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
            ProductoSlug) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
            [ id, ProductoNombre,ProductoDescripcion,ProductoMarca,ProductoModelo,ProductoColor,SubCategoriaId,ProductoStock,MonedaId,ProductoSubtotal,ProductoEnvio,slug])
        } catch(e){
          throw e 
        }

        for(const imagen of ProductoImagenes){
        
            const idImagen = createId()
           // const imagenNuevaURL= imagen.replace('./public','http://localhost:3000')
            try{
                await connection.query(
                `INSERT INTO productoimagen(
                ProductoImagenId,ProductoId,ProductoImagenURL,ProductoImagenNombre)
                VALUES ('${idImagen}','${id}','${imagen}','')`)
            }catch(e){
                throw e
            }
        }

    return ({mensaje:"Producto creado exitosamente"})
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
    },id) =>{
        const campos = {
        ProductoNombre:ProductoNombre,
        ProductoDescripcion:ProductoDescripcion,
        ProductoMarca:ProductoMarca,
        ProductoModelo:ProductoModelo,
        ProductoColor:ProductoColor,
        SubCategoriaId:SubCategoriaId,
        ProductoStock:ProductoStock,
        MonedaId:MonedaId,
        ProductoSubtotal:ProductoSubtotal,
        ProductoEnvio:ProductoEnvio
        }
        console.log(id)
        const [productoExiste] = await connection.query(
            `SELECT ProductoId FROM producto WHERE ProductoId=?`,[id]
        );
        
        if (productoExiste.length === 0) {
        throw new Error('Producto no encontrado');
        }
     
        if (Object.keys(campos).length === 0) {
        throw new Error("No se enviaron campos para actualizar");
        }
        console.log("llega hasta aca")
        const columnas = Object.keys(campos);        
        const valores = Object.values(campos);      

        const setSQL = columnas.map(c => `${c} = ?`).join(', ');
        const sql = `UPDATE producto SET ${setSQL} WHERE ProductoId = ?`;
     
        try{
            await connection.query(sql, [...valores, id]);
            console.log("edita")
        }catch(e){         
            throw e
        }

            try{
                await connection.query(`DELETE FROM productoimagen WHERE ProductoId=?`,[id])
            }catch(e){
                throw e
            }
            
           for(const imagen of ProductoImagenes){
            
            const idImagen = createId()
            const imagenNuevaURL= imagen.replace('./public','http://localhost:3000')
            try{
                await connection.query(
                `INSERT INTO productoimagen(
                ProductoImagenId,ProductoId,ProductoImagenURL,ProductoImagenNombre)
                VALUES ('${idImagen}','${id}','${imagenNuevaURL}','')`)
            }catch{
            throw new Error("No se pudo dar de alta las imágenes")
            }
            }
        
        return ({mensaje:"Prenda editada correctamente"});
    }
    

    export const obtenerTodos = async(
      query,
      page,
      limit,
      offset  
    ) =>{

        const likeQuery = `%${query}%`;
   
        const [productos] = await connection.query(`
            SELECT ProductoId,ProductoNombre,ProductoDescripcion,ProductoMarca,ProductoModelo,
            ProductoColor,SubCategoriaId,ProductoStock,MonedaId,ProductoSubtotal,ProductoEnvio,ProductoTotal,ProductoSlug 
             FROM producto 
             WHERE ProductoNombre LIKE ? OR ProductoDescripcion LIKE ?
             LIMIT ? OFFSET ?`,[likeQuery,likeQuery,parseInt(limit), parseInt(offset)])

        if(productos.length === 0) return {mensaje:"No hay productos"}
            

        const [[{ total }]] = await connection.query(`SELECT COUNT(*) AS total FROM producto WHERE ProductoNombre LIKE ? OR ProductoDescripcion LIKE ?`,[likeQuery,likeQuery]);
        

        for (const producto of productos) {
        const [imagenes] = await connection.query(`
        SELECT ProductoImagenURL FROM productoimagen
        WHERE ProductoId = ?`, [producto.ProductoId]);

        producto.ProductoImagenes = imagenes;
        }

        return ({
            total,
            page: parseInt(page),
            totalPaginas: Math.ceil(total / limit),
            productos})
    }

    export const obtenerProductoCategoria_Subcategoria = async(
        query,
        page,
        limit,
        offset,
        CategoriaSlug,
        SubCategoriaSlug) =>{
      
        const [CategoriaId] = await connection.query(`
            SELECT CategoriaId FROM categoria WHERE CategoriaSlug=?`,[CategoriaSlug])
        
        if (CategoriaId.length === 0) {
        throw new Error("Categoría no encontrada");
        }

        const [SubCategoriaId] = await connection.query(`
            SELECT SubCategoriaId FROM subcategoria WHERE SubCategoriaSlug=?
            AND CategoriaId=?`,[SubCategoriaSlug,CategoriaId[0].CategoriaId])

        const likeQuery = `%${query}%`;

        const [productos] = await connection.query(`
            SELECT ProductoId,ProductoNombre,ProductoDescripcion,ProductoMarca,ProductoModelo,
            ProductoColor,SubCategoriaId,ProductoStock,MonedaId,ProductoSubtotal,ProductoEnvio,ProductoTotal,ProductoSlug 
            FROM producto 
            WHERE SubCategoriaId=? AND (ProductoNombre LIKE ?
            OR ProductoDescripcion LIKE ?)
            LIMIT ? OFFSET ?`,[SubCategoriaId[0].SubCategoriaId,likeQuery,likeQuery,parseInt(limit), parseInt(offset)])

        const [[{ total }]] = await connection.query(`SELECT COUNT(*) AS total FROM producto WHERE SubCategoriaId=?`,[SubCategoriaId[0].SubCategoriaId]);

        for (const producto of productos) {
        const [imagenes] = await connection.query(`
        SELECT ProductoImagenURL FROM productoimagen
        WHERE ProductoId = ?`, [producto.ProductoId]);

        producto.ProductoImagenes = imagenes;
        }

        return ({
            total,
            page: parseInt(page),
            totalPaginas: Math.ceil(total / limit),
            productos: productos}) 
    }

    export const obtenerProductoCategoria = async(
        query,
        page,
        limit,
        offset,
        CategoriaSlug
    ) =>{

        const [CategoriaId] = await connection.query(`
            SELECT CategoriaId FROM categoria WHERE CategoriaSlug=?`,[CategoriaSlug])

        if(CategoriaId.length===0){
        throw new Error('No se encuentra categoria')
        }

        const [subcategorias] = await connection.query(`
            SELECT SubcategoriaId FROM subcategoria WHERE CategoriaId=?`,[CategoriaId[0].CategoriaId])
    
        if(subcategorias.length===0){
        throw new Error(`No se encuentra subcategorias`)
        }

        const productos = [] 

        for(const subcategoria of subcategorias){
            const likeQuery = `%${query}%`;
            var [consulta] = await connection.query(`
            SELECT ProductoId,ProductoNombre,ProductoDescripcion,ProductoMarca,ProductoModelo,
            ProductoColor,SubCategoriaId,ProductoStock,MonedaId,ProductoSubtotal,ProductoEnvio,ProductoTotal,ProductoSlug 
            FROM producto WHERE SubCategoriaId=?
            AND (ProductoNombre LIKE ?
            OR ProductoDescripcion LIKE ?)
            `,[subcategoria.SubcategoriaId,likeQuery,likeQuery])

            if (consulta && consulta.length > 0) {
            productos.push(...consulta)
            }
        }

        // Total de productos sin paginar
        const total = productos.length;

        for (const producto of productos) {
        const [imagenes] = await connection.query(`
        SELECT ProductoImagenURL FROM productoimagen
        WHERE ProductoId = ?`, [producto.ProductoId]);

        producto.ProductoImagenes = imagenes;
        }

        //PAGINAR
        const productosPaginados = productos.slice(offset, offset + parseInt(limit));          

        return ({
            total,
            page: parseInt(page),
            totalPaginas: Math.ceil(total / limit),
            productos: productosPaginados})  
    }

    

    export const obtenerProducto = async(ProductoSlug) =>{

        const [productos] = await connection.query(`
        SELECT ProductoId,ProductoNombre,ProductoDescripcion,ProductoMarca,ProductoModelo,
        ProductoColor,SubCategoriaId,ProductoStock,MonedaId,ProductoSubtotal,ProductoEnvio,ProductoTotal,ProductoSlug 
        FROM producto WHERE ProductoSlug=?`,[ProductoSlug] )

        const [categoria] = await connection.query(`
        SELECT CategoriaId FROM subcategoria WHERE SubCategoriaId=?`,[productos[0].SubCategoriaId])

        productos[0].CategoriaId = categoria[0].CategoriaId

        for(const producto of productos){
        const [imagenes] = await connection.query(`
            SELECT ProductoImagenURL FROM productoimagen
            WHERE ProductoId = ?`,[producto.ProductoId])

        producto.ProductoImagenes = imagenes
        }

        return (productos[0])
    }

    export const Eliminar = async(id) =>{

        const [existe] = await connection.query(`
        SELECT * FROM producto WHERE ProductoId=?`,[id] )

        if (existe.length === 0){
        throw new Error("No exite el producto")  
        }
        
        try{
         await connection.query(`
        DELETE FROM productoimagen WHERE ProductoId=?`,[id] )
            
        await connection.query(`
        DELETE FROM producto WHERE ProductoId=?`,[id] )

        return ({mensaje:'Prenda eliminada'})
        }catch(e){
        throw e
        }
    }

async function slugifyTexto(input){
    //SLUG DEL NOMBRE PARA ENDPOINTS
        const slug = slugify(input, {
        lower: true,
        strict: true
        });
        return slug;
}

async function verificarNombreSlug(nombre) {
    let slugResponse = await slugifyTexto(nombre)
    let [consulta] = await connection.query(`
        SELECT * FROM producto WHERE ProductoSlug=?`,[slugResponse])
    
        if (consulta.length > 0){
            return {
            error: true,
            mensaje: 'Ya existe ese nombre de producto'
            };
        }
        
        return{
            error: false,
            mensaje:""
        }
}