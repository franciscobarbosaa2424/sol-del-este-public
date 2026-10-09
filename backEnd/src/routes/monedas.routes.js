import express from 'express';
//import { Moneda } from '../mysql/mysql.js';
import * as monedaController from '../controllers/moneda.controller.js';
const router = express.Router()

//MONEDAS

router.get('/nombre', monedaController.obtenerNombreMoneda)

router.get('/',monedaController.obtenerMonedas)



export default router