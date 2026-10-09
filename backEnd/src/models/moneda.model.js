import connection from "../mysql/db.js"

    export const obtenerMonedas = async () =>{
        const [monedas] = await connection.query(`SELECT MonedaId, MonedaNombre, MonedaSimbolo FROM moneda`)
        return monedas
    } 


    export const obtenerNombreMoneda = async (id) =>{
        const [moneda] = await connection.query(`SELECT MonedaSimbolo FROM moneda WHERE MonedaId=?`,[id])
        return moneda
    }
