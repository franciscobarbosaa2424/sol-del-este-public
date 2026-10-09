import connection from "../mysql/db.js";
import slugify from "slugify";

    export const obtenerSubCategoria = async (categoria) =>{
        const [subcategorias] = await connection.query(`SELECT SubCategoriaId,CategoriaId,SubCategoriaNombre,SubCategoriaSlug FROM subcategoria WHERE CategoriaId=?`,[categoria])
        return subcategorias
    }

     export const obtenerDatosSubCategoria = async (SubCategoriaId) =>{
        const [subcategoria] = await connection.query(`SELECT SubCategoriaId,CategoriaId,SubCategoriaNombre,SubCategoriaSlug FROM subcategoria WHERE SubcategoriaId=?`,[SubCategoriaId])
        return subcategoria[0]
    }

    export const obtenerSubCategorias = async () =>{
        const [subcategorias] = await connection.query(`SELECT SubCategoriaId,CategoriaId,SubCategoriaNombre,SubCategoriaSlug FROM subcategoria`)
        return subcategorias
    }

    export const obtenerNombreSubCategoria = async (SubCategoriaId) =>{
        const [SubCategoriaNombre] = await connection.query(`SELECT SubCategoriaNombre FROM subcategoria WHERE SubCategoriaId=?`,[SubCategoriaId])

        return SubCategoriaNombre
    }

    export const crear = async (CategoriaId,SubCategoriaNombre) =>{

        const [categoria] = await connection.query(`SELECT CategoriaId FROM categoria WHERE CategoriaId=${CategoriaId}`)

        const [subcategoria] = await connection.query(`SELECT SubCategoriaNombre FROM subcategoria WHERE SubCategoriaNombre='${SubCategoriaNombre}'`)

        if(subcategoria.length > 0 ) {
        throw new Error("Ya existe una Subcategoria con ese nombre")
        }

        if(categoria && subcategoria.length === 0){

            const SubCategoriaSlug = await slugifyTexto(SubCategoriaNombre)
            
            try{
                await connection.query(`
                    INSERT INTO subcategoria(CategoriaId,SubCategoriaNombre,SubCategoriaSlug) VALUES (${CategoriaId},'${SubCategoriaNombre}','${SubCategoriaSlug}')`)
                    return ({mensaje:"Subcategoría creada exitosamente"})
            }catch(e){
                throw e
            }
        }    
    }

    export const editarSubcategoria = async (body,SubCategoriaId) =>{
        
        const respuesta = await verificarSubCategoriaSlug(body.SubCategoriaNombre,body.CategoriaId)

        if(respuesta.error){  
        throw new Error('Ya existe esa subcategoria');
        }

        const SubCategoriaSlug = await slugifyTexto(body.SubCategoriaNombre)

        try{
            await connection.query(`
                UPDATE subcategoria SET CategoriaId = ?,SubCategoriaNombre = ?, SubCategoriaSlug = ? WHERE SubCategoriaId = ?`,
                [parseInt(body.CategoriaId),body.SubCategoriaNombre,SubCategoriaSlug,parseInt(SubCategoriaId)])

                return ({mensaje:"Subcategoría editada correctamente"})
        }catch(e){
            throw e
        }
    }

    export const eliminarSubcategoria = async (SubCategoriaId) =>{

        const con = await connection.getConnection();
        const [productos] = await connection.query(`
        SELECT * FROM producto WHERE SubCategoriaId = ?`,[parseInt(SubCategoriaId)])

        if(productos.length > 0){ 
            
            try{
                await con.beginTransaction()
                for(const p of productos){
                await con.query(`DELETE FROM descuento WHERE ProductoId=?`,[p.ProductoId])   
                await con.query(`DELETE FROM productoimagen WHERE ProductoId=?`,[p.ProductoId])
                await con.query(`DELETE FROM producto WHERE ProductoId=?`,[p.ProductoId])                      
                }

                await con.query(`DELETE FROM subcategoria WHERE SubCategoriaId=?`,[SubCategoriaId])
                await con.commit()
                return ({ mensaje: "Subcategoría eliminada correctamente" })                   
            }catch(e){
                await con.rollback()
                throw e
            }finally{
                con.release()
            }                 
        }else{
            try{
                await connection.query(`DELETE FROM subcategoria WHERE SubCategoriaId=?`,[SubCategoriaId])
                return ({ mensaje: "Subcategoría eliminada correctamente" });
            }catch(e){
                throw e
            }
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

async function verificarSubCategoriaSlug(nombre,categoria) {
    const slugResponse = await slugifyTexto(nombre)
    const [consulta] = await connection.query(`
        SELECT * FROM subcategoria WHERE SubCategoriaSlug=? AND CategoriaId=?`,[slugResponse,categoria])
    
        if (consulta.length > 0){
            return {
            error: true,
            mensaje: 'Ya existe esa subcategoria'
            };
        }
        
        return{
            error: false,
            mensaje:""
        }
}