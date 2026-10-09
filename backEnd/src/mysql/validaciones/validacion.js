import zod from 'zod'
/*
    .refine(val => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
      message: "El número debe tener como máximo dos decimales"
    })*/

const productoEsquema = zod.object({
    ProductoNombre: zod.string().max(150),
    ProductoDescripcion: zod.string(),
    ProductoMarca: zod.string().max(150),
    ProductoModelo: zod.string().max(150),
    ProductoColor: zod.string().max(50),
    SubCategoriaId: zod.number(),
    ProductoStock: zod.number(),
    MonedaId: zod.number(),
    ProductoSubtotal: zod.number(),
    ProductoEnvio: zod.number(),
    ProductoImagenes: zod.array(zod.string())
})

const usuarioEsquema = zod.object({
UsuarioNombre: zod.string(150),
UsuarioCorreo: zod.string(100).email(),
UsuarioContrasena: zod.string(25),
UsuarioContacto:zod.string(25)
})

const categoriaEsquema = zod.object({
  CategoriaNombre: zod.string(150)
})

const subcategoriaEsquema = zod.object({
  CategoriaId: zod.number(),
  SubCategoriaNombre: zod.string(150)
})

const descuentoEsquema = zod.object({
DescuentoPorcentaje: zod.number(),
DescuentoFechaInicio: zod.string(20),
DescuentoFechaFin: zod.string(20),
TipoPromo: zod.string(50)
})

export async function validarProducto(input){
    return productoEsquema.safeParseAsync(input)
}

export async function validarProductoParcial(input){
  return productoEsquema.partial().safeParse(input)
}

export async function validarUsuario(input){
  return usuarioEsquema.safeParseAsync(input)
}

export async function ValidarCategoria(input){
  return categoriaEsquema.safeParseAsync(input)
}

export async function ValidarCategoriaParcial(input){
  return categoriaEsquema.partial().safeParse(input)
}

export async function ValidarSubCategoria(input){
  return subcategoriaEsquema.safeParseAsync(input)
}

export async function ValidarSubCategoriaParcial(input){
  return subcategoriaEsquema.partial().safeParse(input)
}

export async function ValidarDescuento(input){
  return descuentoEsquema.safeParseAsync(input)
}

