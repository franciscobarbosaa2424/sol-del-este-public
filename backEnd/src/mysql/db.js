import mysql from 'mysql2/promise'
import config from '../config.js'

const datosconexion = {
    host: config.DB_HOST,
    user: config.DB_USER,
    port: Number(config.DB_PORT),
    password: config.DB_PASS,
    database: config.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}


const connection = mysql.createPool(datosconexion)

export default connection