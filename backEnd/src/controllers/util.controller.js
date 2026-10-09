import * as utilService from '../services/util.service.js';

export const crearToken = async(req,res) =>{
    try{

    const {UsuarioCorreo,UsuarioContrasena} = req.body

    const resultado = await utilService.crearToken(UsuarioCorreo,UsuarioContrasena)

    res.cookie("token", resultado.token, {
        httpOnly: true,
        secure: true, // true en producción con https
        sameSite: "none",//lax en dev
        path:"/"
        });

    return res.json({mensaje:"Usuario autenticado"})
    }catch (error) {
    res.status(400).json({ error: error.message });
    }
}

export const logout = async(req,res) =>{
    try{
        res.clearCookie("token", {
        httpOnly: true,
        secure: true, 
        sameSite: "none",
        path:"/" 
        });

        return res.json({mensaje: "Logout exitoso"})
    }catch (error) {
    res.status(400).json({ error: error.message });
    }
}

export const crear = async(req,res) =>{
    try{
        const body = {
            UsuarioNombre:req.body.UsuarioNombre,
            UsuarioCorreo:req.body.UsuarioCorreo,
            UsuarioContrasena:req.body.UsuarioContrasena,
            UsuarioContacto:req.body.UsuarioContacto
        }
   
        const usuario = await utilService.crearUsuario(body)

        res.json(usuario)
    }catch (error) {
    res.status(400).json({ error: error.message });
    }
}

export const EnviarMensaje = async(req,res) =>{
    try{
        const{FormularioURL} = req.body

        const mensaje = await utilService.EnviarMensaje(FormularioURL)
        return res.json(mensaje)
    }catch (error) {
    res.status(400).json({ error: error.message });
    }
}