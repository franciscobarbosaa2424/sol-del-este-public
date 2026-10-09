import jwt from "jsonwebtoken"
import config from "./config.js"

export default function validarToken(req, res, next){
    //console.log("Cookies:", req.cookies);
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ autenticado: false, mensaje: "Usuario necesita iniciar sesión" });
    }

    try {
        //valida firma y expiración
        const decoded = jwt.verify(token, config.JWT_SECRET);

        req.usuario = decoded; // usuario para rutas protegidas
        next(); 

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ autenticado: false, mensaje: "Token expirado" });
        }

        return res.status(401).json({ autenticado: false, mensaje: "Token inválido" });
    }
              
}

