CREATE DATABASE webapp_ventas

USE webapp_ventas

CREATE TABLE moneda (
MonedaId VARCHAR(27) PRIMARY KEY,
MonedaNombre VARCHAR(35),
MonedaSimbolo VARCHAR(5)
);

CREATE TABLE categoria (
CategoriaId VARCHAR(27) PRIMARY KEY,
CategoriaNombre VARCHAR(150)
);

CREATE TABLE producto (
ProductoId VARCHAR(27) PRIMARY KEY,
ProductoNombre VARCHAR(150),
ProductoDescripcion TEXT,
CategoriaId VARCHAR(27),
ProductoStock DECIMAL(12,2),
MonedaId VARCHAR(27),
ProductoSubtotal DECIMAL(12,2),
ProductoDescuento DECIMAL(12,2),
ProductoDescuentoPorcentaje DECIMAL(5,2),
ProductoEnvio DECIMAL(12,2),
ProductoTotal DECIMAL(12,2),
FOREIGN KEY (CategoriaId) REFERENCES categoria(categoriaid),
FOREIGN KEY (MonedaId) REFERENCES moneda(MonedaId)
);

CREATE TABLE servicio (
ServicioId VARCHAR(27) PRIMARY KEY,
ServicioNombre VARCHAR(150),
ServicioDescripcion TEXT,
CategoriaId VARCHAR(27),
ServicioDuracionFormato ENUM('anos','meses','dias','horas','minutos'),
ServicioDuracion INT,
MonedaId VARCHAR(27),
ServicioSubtotal DECIMAL(12,2),
ServicioDescuento DECIMAL(12,2),
ServicioDescuentoPorcentaje DECIMAL(5,2),
ServicioGastosExtra DECIMAL(12,2),
ServicioTotal DECIMAL(12,2),
FOREIGN KEY (CategoriaId) REFERENCES categoria(categoriaid),
FOREIGN KEY (MonedaId) REFERENCES moneda(MonedaId)
);

CREATE TABLE productoImagen (
ProductoImagenId VARCHAR(27) PRIMARY KEY,
ProductoId VARCHAR(27),
ProductoImagenURL TEXT,
ProductoImagenNombre VARCHAR(300),
FOREIGN KEY (ProductoId) REFERENCES producto(ProductoId)
);

CREATE TABLE servicioImagen (
ServicioImagenId VARCHAR(27) PRIMARY KEY,
ServicioId VARCHAR(27),
ServicioImagenURL TEXT,
ServicioImagenNombre VARCHAR(300),
FOREIGN KEY (ServicioId) REFERENCES servicio(ServicioId)
);

CREATE TABLE usuario(
UsuarioId VARCHAR(27) PRIMARY KEY,
UsuarioNombre VARCHAR(150),
UsuarioCorreo VARCHAR(100),
UsuarioContrasena VARCHAR(100),
UsuarioContacto VARCHAR(25)
);
