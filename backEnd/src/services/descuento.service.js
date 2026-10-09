import * as DescuentoModel from "../models/descuento.model.js";
import {formatInTimeZone} from 'date-fns-tz';
import {ValidarDescuento} from "../mysql/validaciones/validacion.js";

export const crearGrupo = async ({
    DescuentoPorcentaje,
    DescuentoFechaInicio,
    DescuentoHoraInicio,
    DescuentoFechaFin,
    DescuentoHoraFin,
    TipoPromo,
    Productos
    }) =>{
    
    const descuentoInicio = DescuentoFechaInicio+'T'+DescuentoHoraInicio
    const descuentoFin    = DescuentoFechaFin+'T'+DescuentoHoraFin

    if (DescuentoPorcentaje<=0) {
    throw new Error("No hay porcentaje para aplicar");
    }

    if (!DescuentoFechaInicio) {
    throw new Error("No hay fecha de inicio para aplicar");
    }

    if (!DescuentoHoraInicio) {
    throw new Error("No hay hora de inicio para aplicar");
    }

    if (!DescuentoFechaFin) {
    throw new Error("No hay fecha de finalización para aplicar");
    }

    if (!DescuentoHoraFin) {
    throw new Error("No hay hora de finalización para aplicar");
    }

    if(descuentoFin < descuentoInicio){
     throw new Error("La fecha de finalización no puede ser menor a la de inicio");   
    }

    if (!Productos || Productos.length === 0) {
    throw new Error("No hay productos para aplicar descuento");
    }

    const resultado = await DescuentoModel.crearGrupo({
    DescuentoPorcentaje,
    descuentoInicio,
    descuentoFin,
    TipoPromo,
    Productos})

    return resultado
}

export const crearDescuento = async ({
    ProductoId,
    DescuentoPorcentaje,
    DescuentoFechaInicio,
    DescuentoHoraInicio,
    DescuentoFechaFin,
    DescuentoHoraFin,
    TipoPromo
    }) =>{

    if (!ProductoId) {
    throw new Error("No hay producto para aplicar descuento");
    }

    const descuentoInicio = DescuentoFechaInicio+'T'+DescuentoHoraInicio
    const descuentoFin    = DescuentoFechaFin+'T'+DescuentoHoraFin


    const resultado = await DescuentoModel.crearDescuento({
    ProductoId,
    DescuentoPorcentaje,
    descuentoInicio,
    descuentoFin,
    TipoPromo
    })

    return resultado
}


export const obtenerDescuentos = async ({
    ProductoId
    }) =>{

    const hoy = new Date()
    const ahora = formatInTimeZone(hoy,'America/Montevideo',"yyyy-MM-dd HH:mm:ss")

    const resultado = await DescuentoModel.obtenerDescuentos({
    ProductoId,
    ahora
    })

    return resultado
}

export const obtenerTodosDescuentos = async ({
    ProductoId,
    page,
    limit
    }) => {

    const offset = (page - 1) * limit;

    const resultado = await DescuentoModel.obtenerTodosDescuentos({
        ProductoId,
        page,
        limit,
        offset   
    })

    return resultado
}

export const obtenerDescuento = async (DescuentoId) =>{
    if(DescuentoId<=0){
    throw new Error("No se pudo obtener el id del descuento")
    }
  
    const resultado = await DescuentoModel.obtenerDescuento(DescuentoId)

    if(!resultado || resultado.length===0) {
    throw new Error("No se pudo obtener los datos del descuento")
    }

    return resultado
}

export const editarDescuento = async (body,DescuentoId) => {

    const descuentoExiste = await DescuentoModel.descuentoExiste(DescuentoId)
    if (!descuentoExiste ||descuentoExiste.length === 0) {
        throw new Error("Descuento no encontrado");
    }

    const validacion = await ValidarDescuento(body);

    if (!validacion.success) {
         throw new Error("Error de validación");
    }

    const campos = validacion.data;

    if (Object.keys(campos).length === 0) {
        throw new Error("No se enviaron campos para actualizar");
    }

    const resultado = await DescuentoModel.editarDescuento({
        campos:campos,
        DescuentoId:DescuentoId})

    return resultado
}

 export const eliminarDescuento = async (DescuentoId) => {
    if(DescuentoId<=0){
    throw new Error("No se pudo obtener el id del descuento")
    }

    const resultado = await DescuentoModel.eliminarDescuento(DescuentoId)

    return resultado
 }