import express from 'express';
import validarToken from '../validarToken.js';
import * as descuentoController from "../controllers/descuento.controller.js";
const router = express.Router()


//DESCUENTOS

router.get('/todos', descuentoController.obtenerTodosDescuentos)

router.post('/grupo', validarToken,descuentoController.crearGrupo)

router.get('/', descuentoController.obtenerDescuentos)

router.get('/:DescuentoId',descuentoController.obtenerDescuento)

router.post('/:ProductoId',validarToken,descuentoController.crearDescuento)

router.patch('/:DescuentoId',validarToken,descuentoController.editarDescuento)

router.delete('/:DescuentoId',validarToken,descuentoController.eliminarDescuento)

export default router
