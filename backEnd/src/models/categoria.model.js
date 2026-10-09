import connection from "../mysql/db.js";
import slugify from "slugify";

    export const crear = async (CategoriaNombre) =>{

        const respuesta = await verificarCategoriaSlug(CategoriaNombre)

        if(respuesta.error){  
        throw new Error('Ya existe esa categoria');
        }

        const CategoriaSlug = await slugifyTexto(CategoriaNombre)
        
        try{
            console.log("entra e inserta categoria")
            await connection.query(`INSERT INTO categoria(CategoriaNombre,CategoriaSlug) 
                VALUES ('${CategoriaNombre}','${CategoriaSlug}')`)

            return ({mensaje:"Categoría creada exitosamente"})
        }catch(e){
            throw e
        }
    }

    export const obtenerCategorias = async() =>{
        const [categorias] = await connection.query(`SELECT CategoriaId,CategoriaNombre,CategoriaSlug FROM categoria`)

        return categorias
    }

    export const obtenerCategoriasTodas = async(
        query,
        page,
        limit,
        offset
    )=>{

        const [categorias] = await connection.query(`
            SELECT CategoriaId,CategoriaNombre,CategoriaSlug 
            FROM categoria LIMIT ? OFFSET ?`,[parseInt(limit), parseInt(offset)])
        
        const [[{ total }]] = await connection.query(`
            SELECT COUNT(*) AS total FROM categoria`);


       return ({
            total,
            page: parseInt(page),
            totalPaginas: Math.ceil(total / limit),
            categorias: categorias}) 
    }

    export const obtenerCategoria = async(CategoriaId) =>{

        const [categoria] = await connection.query(`
            SELECT CategoriaId,CategoriaNombre,CategoriaSlug FROM categoria
            WHERE CategoriaId=?`,[parseInt(CategoriaId)])
        
        if (categoria.length === 0){
        throw new Error("No se encontró la categoría")
        }    

        return categoria[0]
    }

    export const editarCategoria = async(CategoriaNombre,CategoriaId) =>{

        const respuesta = await verificarCategoriaSlug(CategoriaNombre)

        if(respuesta.error){  
        throw new Error('Ya existe esa categoria');
        }
       
        const CategoriaSlug = await slugifyTexto(CategoriaNombre)

        try{
            await connection.query(`
                UPDATE categoria SET CategoriaNombre = ?, CategoriaSlug = ? WHERE CategoriaId = ?`,
                [CategoriaNombre,CategoriaSlug,parseInt(CategoriaId)])

                return ({mensaje:"Categoría editada correctamente"})
        }catch(e){
            throw e
        }
    }

    export const eliminarCategoria = async(CategoriaId)=>{

        const con = await connection.getConnection();

        try{
            
            const [subcategorias] = await con.query(`
            SELECT * FROM subcategoria WHERE CategoriaId = ?`,[parseInt(CategoriaId)])
            
            await con.beginTransaction()
            if (subcategorias.length > 0){
                let mensaje;
                for(const s of subcategorias){
                        const [productos] = await con.query(`SELECT ProductoId FROM producto WHERE SubCategoriaId=?`,[parseInt(s.SubcategoriaId)])  
                        
                        for(const p of productos){
                                await con.query(`DELETE FROM descuento WHERE ProductoId=?`,[p.ProductoId])   
                                await con.query(`DELETE FROM productoimagen WHERE ProductoId=?`,[p.ProductoId])
                                await con.query(`DELETE FROM producto WHERE ProductoId=?`,[p.ProductoId])
                        }
                await con.query(`DELETE FROM subcategoria WHERE SubCategoriaId=?`,[parseInt(s.SubcategoriaId)])              
                }
               
                await con.query(`DELETE FROM categoria WHERE CategoriaId=?`,[parseInt(CategoriaId)])
                mensaje = {mensaje: "Categoría y subcategorías eliminadas exitosamente"}

            } else{
                await con.query(`DELETE FROM categoria WHERE CategoriaId=?`,[parseInt(CategoriaId)])
                mensaje = {mensaje: "Categoría eliminada exitosamente"}
            }
            await con.commit();
            return mensaje;
        }catch(e){
            await con.rollback();
            throw e;
        }finally{
            con.release();
        }
    }

    async function verificarCategoriaSlug(nombre) {
        let slugResponse = await slugifyTexto(nombre)
        let [consulta] = await connection.query(`
            SELECT * FROM categoria WHERE CategoriaSlug=?`,[slugResponse])
        console.log(consulta)
            if (consulta.length > 0){
                return {
                error: true,
                mensaje: 'Ya existe esa categoria'
                };
            }
            
            return{
                error: false,
                mensaje:""
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