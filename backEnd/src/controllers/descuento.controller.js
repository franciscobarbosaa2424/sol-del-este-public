import * as descuentoService from "../services/descuento.service.js"

export const crearGrupo  = async (req,res) => {
    try{
        const resultado = await descuentoService.crearGrupo(req.body);
        res.json(resultado)
    }catch(error){
        res.status(404).json({ mensaje: error.message });
    }
}

export const crearDescuento = async (req,res) =>{
    try{
        const{ProductoId} = req.params
        const{
        DescuentoPorcentaje,
        DescuentoFechaInicio,
        DescuentoHoraInicio,
        DescuentoFechaFin,
        DescuentoHoraFin,
        TipoPromo
        }=req.body

        const descuentoData = {
        ProductoId,
        DescuentoPorcentaje,
        DescuentoFechaInicio,
        DescuentoHoraInicio,
        DescuentoFechaFin,
        DescuentoHoraFin,
        TipoPromo
        };

        const resultado = await descuentoService.crearDescuento(descuentoData)
        res.json(resultado)
    }catch(error){
        res.status(404).json({ mensaje: error.message });
    }
}

export const obtenerDescuentos = async (req,res) =>{
    try{
    const { ProductoId } = req.query;
  
    const descuentos = await descuentoService.obtenerDescuentos({
    ProductoId,
    })

    res.json(descuentos)
    
    }catch(error){
    res.status(404).json({ mensaje: error.message });
    }
}

export const obtenerTodosDescuentos = async(req,res) =>{
    try{
    const { ProductoId ,page = 1, limit = 12 } = req.query;
    
    const descuentos = await descuentoService.obtenerTodosDescuentos({
        ProductoId,
        page,
        limit
    })

    res.json(descuentos)
    }catch(error){
    res.status(404).json({ mensaje: error.message });
    }
}

export const obtenerDescuento = async(req,res) =>{
    try{
    const {DescuentoId} = req.params
    
    const descuento = await descuentoService.obtenerDescuento(DescuentoId)

    return res.json(descuento)
    }catch(error){
    res.status(404).json({ mensaje: error.message });    
    }
}

export const editarDescuento = async (req,res) => {
    const {DescuentoId} = req.params;

    const body = {
        DescuentoPorcentaje: parseFloat(req.body.DescuentoPorcentaje),
        DescuentoFechaInicio: req.body.DescuentoFechaInicio+'T'+req.body.DescuentoHoraInicio,
        DescuentoFechaFin: req.body.DescuentoFechaFin+'T'+req.body.DescuentoHoraFin,
        TipoPromo: req.body.TipoPromo
    }

    const descuento = await descuentoService.editarDescuento(body,DescuentoId)

    return res.json(descuento)
}

 export const eliminarDescuento = async (req,res) => {
    const{DescuentoId} = req.params

    const descuento = await descuentoService.eliminarDescuento(DescuentoId)

    return res.json(descuento)
 }
