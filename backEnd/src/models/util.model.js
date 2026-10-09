import connection from "../mysql/db.js";
import jwt from 'jsonwebtoken';
import bcrypt, { hash } from 'bcrypt'
import config from '../config.js'
import { createId } from '@paralleldrive/cuid2';

    export const EnviarMensaje = async(FormularioURL) =>{

        const [celular] = await connection.query(`SELECT UsuarioContacto from usuario WHERE RolId=1`)
       
        if(celular.length===0){
        throw new Error("No se pudo obtener el celular del usuario")
        }
        
        const productoURL=`https://wa.me/${celular[0].UsuarioContacto}?text=Hola,%20estoy%20interesado/a%20en%20esta%20prenda%20-->%20${FormularioURL}`
        return ({productoURL})
    }


     export const crearUsuario = async(body) =>{
     
        const id = createId();

        const hash = await bcrypt.hash(body.UsuarioContrasena,10)

        try{
        await connection.query(
            `INSERT INTO usuario(UsuarioId,UsuarioNombre,UsuarioCorreo,UsuarioContrasena,UsuarioContacto,RolId)
            VALUES (?,?,?,?,?,?)`,[id,body.UsuarioNombre,body.UsuarioCorreo,hash,body.UsuarioContacto,1])

        return ({mensaje:"Usuario creado correctamente"})
        }catch(e){
            throw e
        }
     }

     export const crearToken = async(UsuarioCorreo,UsuarioContrasena) =>{

        const [id] = await connection.query(`SELECT UsuarioId FROM usuario WHERE UsuarioCorreo=? and (RolId=1 or RolId=2)`,[UsuarioCorreo])
        const [contrasena] = await connection.query(`SELECT UsuarioContrasena FROM usuario WHERE UsuarioCorreo=?`,[UsuarioCorreo])

        if(contrasena.length === 0) {
            throw new Error('Usuario NO encontrado')
        }
        
        const resultado = await bcrypt.compare(UsuarioContrasena,contrasena[0].UsuarioContrasena)
      
        if(resultado){
            console.log('entra aresultado porque hay')
            const token = jwt.sign(
                { id: id[0].UsuarioId, correo: UsuarioCorreo},
                config.JWT_SECRET,
                { expiresIn: '3h'}
            )
            console.log('pasa la firma')
            return ({
                id:id[0].UsuarioId,
                correo:UsuarioCorreo,
                token:token});
        }else{
            throw new Error('Usuario o contraseña incorrectos');
        }
    }

    
