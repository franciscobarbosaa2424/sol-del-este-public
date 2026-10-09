import connection from "../mysql/db.js";

    export const crearGrupo = async ({
    DescuentoPorcentaje,
    descuentoInicio,
    descuentoFin,
    TipoPromo,
    Productos}) =>{
        
    const con = await connection.getConnection();
    await con.beginTransaction()
    
        try{
            for(const p of Productos){
            await con.query(`
            INSERT INTO descuento(ProductoId,
            DescuentoPorcentaje,
            DescuentoFechaInicio,
            DescuentoFechaFin,
            TipoPromo)
            VALUES (?,?,?,?,?)`,[p,DescuentoPorcentaje,descuentoInicio,descuentoFin,TipoPromo])
            }
            await con.commit();
            
            return ({mensaje:"Grupo de descuento creado exitosamente"})
        }catch(error){
            await con.rollback();
            throw error;
        }finally{
            con.release();
        }      
    }

    export const crearDescuento = async ({
    ProductoId,
    DescuentoPorcentaje,
    descuentoInicio,
    descuentoFin,
    TipoPromo
    }) =>{ 
       
     
        try{
            await connection.query(`
            INSERT INTO descuento(ProductoId,
            DescuentoPorcentaje,
            DescuentoFechaInicio,
            DescuentoFechaFin,
            TipoPromo)
            VALUES (?,?,?,?,?)`,[ProductoId,DescuentoPorcentaje,descuentoInicio,descuentoFin,TipoPromo])
            return {mensaje:"Descuento creado exitosamente"}
        }catch(e){
            throw e
        }
    }

    export const obtenerDescuentos = async ({
    ProductoId,
    ahora
    }) =>{

    const [descuentos] = await connection.query(`
    SELECT DescuentoId,DescuentoPorcentaje, DescuentoFechaInicio, DescuentoFechaFin, TipoPromo
    FROM descuento WHERE ProductoId = ? 
    AND (DescuentoFechaInicio <= ? AND DescuentoFechaFin >= ?)
    `,[ProductoId,ahora,ahora])

    return {descuentos: descuentos}
    }

    //descuentos paginados
    export const obtenerTodosDescuentos = async ({
    ProductoId,
    page,
    limit,
    offset
    }) => {
    
    const [descuentos] = await connection.query(`
    SELECT DescuentoId,DescuentoPorcentaje, DescuentoFechaInicio, DescuentoFechaFin, TipoPromo
    FROM descuento WHERE ProductoId = ? 
    LIMIT ? OFFSET ?`,[ProductoId,parseInt(limit),parseInt(offset)])

    const [[{ total }]] = await connection.query(`SELECT COUNT(*) AS total FROM descuento WHERE ProductoId = ?`,[ProductoId]);

    return {
        total,
        page: parseInt(page),
        totalPaginas: Math.ceil(total / limit),
        descuentos: descuentos
        }
    }

    export const obtenerDescuento = async (DescuentoId) =>{
  
        const [descuento] = await connection.query(`
            SELECT 
            DescuentoId,
            DescuentoPorcentaje,
            DATE_FORMAT(DescuentoFechaInicio, '%Y-%m-%d %H:%i:%s') AS DescuentoFechaInicio,
            DATE_FORMAT(DescuentoFechaFin, '%Y-%m-%d %H:%i:%s') AS DescuentoFechaFin,
            TipoPromo
            FROM descuento WHERE DescuentoId = ?`,[DescuentoId])

        return descuento[0]
    }

    export const descuentoExiste = async (DescuentoId) => {
        const [descuentoExiste] = await connection.query(
            `SELECT DescuentoId FROM descuento WHERE DescuentoId=?`,[DescuentoId]
        );
        return descuentoExiste
    }

    export const editarDescuento = async ({
        campos,
        DescuentoId    
    }) => {

        const columnas = Object.keys(campos);        
        const valores = Object.values(campos);      

        const setSQL = columnas.map(c => `${c} = ?`).join(', ');
        const sql = `UPDATE descuento SET ${setSQL} WHERE DescuentoId = ?`;
 
        try {
            await connection.query(sql, [...valores, DescuentoId]);

            return ({mensaje:"Descuento editado exitosamente"})
        } catch (e) {
            throw e
        }
    }

    export const eliminarDescuento = async (DescuentoId) => {
        try{
            const [descuento] = await connection.query(`
                DELETE FROM descuento WHERE DescuentoId=?`,[DescuentoId])
                
            return ({mensaje: "Descuento eliminado exitosamente"})
        }catch(e){
            throw e
        }
    
    }

