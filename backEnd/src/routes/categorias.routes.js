import express from 'express';
import validarToken from '../validarToken.js';
import * as CategoriaController from '../controllers/categoria.controller.js'

const router = express.Router()

//CATEGORIA
router.post('/crear',validarToken,CategoriaController.crear)

router.get('/todas', CategoriaController.obtenerCategoriasTodas)

router.get('/', CategoriaController.obtenerCategorias)

router.get('/:CategoriaId',CategoriaController.obtenerCategoria)

router.patch('/:CategoriaId', CategoriaController.editarCategoria)

router.delete('/:CategoriaId', CategoriaController.eliminarCategoria)

export default router
