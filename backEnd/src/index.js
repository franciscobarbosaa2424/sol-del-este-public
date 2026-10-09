import express from 'express';
import cors from 'cors';
import config from './config.js';
import { fileURLToPath } from 'url';
import path from 'path';
import cookieParser from "cookie-parser";
import { resolve6 } from 'node:dns';
import utilRoutes from './routes/util.routes.js'
import descuentosRoutes from './routes/descuentos.routes.js'
import categoriasRoutes from './routes/categorias.routes.js'
import subcategoriasRoutes from './routes/subcategorias.routes.js'
import monedasRoutes from './routes/monedas.routes.js'
import productosRoutes from './routes/productos.routes.js'
import connection from "./mysql/db.js";

const app = express()

const allowedOrigins = [
  "https://soldelestetejidos.com",
  "https://www.soldelestetejidos.com"
];


app.use(cookieParser());
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true
}));
app.use(express.json())



app.use('/api/descuentos',descuentosRoutes)
app.use('/api/categorias',categoriasRoutes)
app.use('/api/subcategorias',subcategoriasRoutes)
app.use('/api/monedas',monedasRoutes)
app.use('/api/productos',productosRoutes)
app.use('/api/util',utilRoutes)
app.get('/',(req,res)=>{
  res.send('<h1>Inicio cambiado</h1>')
})



app.listen(config.PORT,'0.0.0.0' ,() => {
    console.log(`Server escuchando en puerto ${config.PORT}`)
})
