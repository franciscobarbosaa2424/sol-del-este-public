import express from 'express';
import validarToken from '../validarToken.js';
import * as subcategoriaController from "../controllers/subcategoria.controller.js"

const router = express.Router()

//SUBCATEGORIA

router.get('/nombre', subcategoriaController.obtenerNombreSubCategoria)

router.get('/sub', subcategoriaController.obtenerSubCategoria)

router.get('/', subcategoriaController.obtenerSubCategorias)

router.post('/',validarToken, subcategoriaController.crear)

router.get('/sub/:SubCategoriaId', subcategoriaController.obtenerDatosSubCategoria)

router.patch('/sub/:SubCategoriaId',validarToken,subcategoriaController.editarSubcategoria)

router.delete('/sub/:SubCategoriaId',validarToken,subcategoriaController.eliminarSubcategoria)

export default router