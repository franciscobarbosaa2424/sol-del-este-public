import express from 'express';
import * as utilController from '../controllers/util.controller.js'
import validarToken from '../validarToken.js';


const router = express.Router()


//WHATSAPP
router.post('/mensaje', async (req,res) => {
   utilController.EnviarMensaje(req,res) 
})


//USUARIO
router.post('/login', async (req,res) => {
     utilController.crearToken(req,res)
})

router.post('/crear-usuario',validarToken, async (req,res) => {    
    utilController.crear(req,res)
})

router.get('/auth/estado',validarToken,async (req, res) => {
res.json({
    autenticado: true,
    usuario: {
      id: req.usuario.id,
      correo: req.usuario.correo
    },
    expiraEn: req.usuario.exp
  });
});

router.get('/logout',validarToken, (req,res)=>{
  utilController.logout(req,res)
})



export default router