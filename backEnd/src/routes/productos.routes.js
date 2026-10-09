import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import multer from 'multer';
import fs from 'node:fs';
import validarToken from '../validarToken.js';
import * as ProductoController from "../controllers/producto.controller.js"
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import config from '../config.js';

const router = express.Router()

// Para poder usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const { v2: cloudinaryV2 } = cloudinary;

cloudinaryV2.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_KEY,
  api_secret: config.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder: 'productos',
    allowed_formats: ['jpg', 'png', 'jpeg']
  }
});

const upload = multer({ storage });


//PRODUCTO
router.post('/crear',validarToken,upload.array('imagen',25), async (req, res) => {
    const ProductoImagenes = []
    for(const file of req.files){
        const imagen = file.path;
        if(imagen){
            ProductoImagenes.push(imagen)
        }
    } 
    req.ProductoImagenes = ProductoImagenes;

    ProductoController.crear(req,res)
});

router.get('/prenda/:ProductoSlug',async (req, res) => {
   ProductoController.obtenerProducto(req, res);
});

router.patch('/prenda/:id',validarToken,upload.array('imagen',25),async (req, res) => {
    const ProductoImagenes = []
    for(const file of req.files){
        const imagen = await guardarImagen(file);
        if(imagen){
            ProductoImagenes.push(imagen)
        }
    } 
    req.ProductoImagenes = ProductoImagenes;

    ProductoController.editarProducto(req, res);
});

router.delete('/prenda/:id',validarToken,async (req, res) =>  {
    ProductoController.Eliminar(req, res);
});

router.get('/catalogo/:CategoriaSlug/:SubCategoriaSlug',async(req,res) => {
    ProductoController.obtenerProductoCategoria_Subcategoria(req,res)
})

router.get('/catalogo/:CategoriaSlug',async(req,res) => {
    ProductoController.obtenerProductoCategoria(req,res)
})

router.get('/', async (req, res) => {
   ProductoController.obtenerTodos(req, res);
});

export default router