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
import { randomUUID } from 'node:crypto';

const router = express.Router()

// Para poder usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const carpetaImagenes = path.join(__dirname, '../public/img');

fs.mkdirSync(carpetaImagenes, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, carpetaImagenes);
    },
    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        cb(null, `${randomUUID()}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
            return cb(new Error('Solo se permiten imágenes JPG o PNG'));
        }

        cb(null, true);
    }
});







//PRODUCTO
router.post('/crear',validarToken,upload.array('imagen',25), async (req, res) => {
    const ProductoImagenes = [];

    for (const file of req.files ?? []) {
        const imagen = `${req.protocol}://${req.get('host')}/img/${file.filename}`;
        ProductoImagenes.push(imagen);
    }

    req.ProductoImagenes = ProductoImagenes;

    ProductoController.crear(req, res);
});

router.get('/prenda/:ProductoSlug',async (req, res) => {
   ProductoController.obtenerProducto(req, res);
});

router.patch('/prenda/:id',validarToken,upload.array('imagen',25),async (req, res) => {
    const ProductoImagenes = [];

    for (const file of req.files ?? []) {
        const imagen = `${req.protocol}://${req.get('host')}/img/${file.filename}`;
        ProductoImagenes.push(imagen);
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