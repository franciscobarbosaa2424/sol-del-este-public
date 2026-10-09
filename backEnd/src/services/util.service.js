import * as UtilModel from '../models/util.model.js';
import { validarUsuario } from "../mysql/validaciones/validacion.js";

export const crearToken = async(UsuarioCorreo,UsuarioContrasena) =>{
    
    if(!UsuarioCorreo){
    throw new Error('Error: No hay correo electrónico')
    }

    if(!UsuarioContrasena){
    throw new Error('Error: No hay contraseña')
    }

    const token = await UtilModel.crearToken(UsuarioCorreo,UsuarioContrasena)

    return token
}

export const crearUsuario = async(body) =>{
    console.log('llega a service y pasa')
    const resultado = await validarUsuario(body)
        
    if (!resultado.success) {
    throw new Error(resultado.error.flatten())
    }
    
    const usuario = await UtilModel.crearUsuario(body)

    return usuario
}

export const EnviarMensaje = async(FormularioURL) =>{
    if(!FormularioURL){
    throw new Error('No puede ir al link de consulta')
    }

    const mensaje = await UtilModel.EnviarMensaje(FormularioURL)

    return mensaje
}