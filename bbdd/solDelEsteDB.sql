/*
SQLyog Community v13.3.0 (64 bit)
MySQL - 8.0.41 : Database - webapp_ventas2
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `categoria` */

DROP TABLE IF EXISTS `categoria`;

CREATE TABLE `categoria` (
  `CategoriaId` int NOT NULL AUTO_INCREMENT,
  `CategoriaNombre` varchar(150) DEFAULT NULL,
  `CategoriaSlug` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`CategoriaId`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `categoria` */

insert  into `categoria`(`CategoriaId`,`CategoriaNombre`,`CategoriaSlug`) values 
(8,'Prueba8','prueba8'),
(20,'Categoria de Prueba 2','categoria-de-prueba-2');

/*Table structure for table `descuento` */

DROP TABLE IF EXISTS `descuento`;

CREATE TABLE `descuento` (
  `DescuentoId` int NOT NULL AUTO_INCREMENT,
  `ProductoId` varchar(27) DEFAULT NULL,
  `DescuentoPorcentaje` decimal(5,2) DEFAULT NULL,
  `DescuentoFechaInicio` datetime DEFAULT NULL,
  `DescuentoFechaFin` datetime DEFAULT NULL,
  `TipoPromo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`DescuentoId`),
  KEY `ProductoId` (`ProductoId`),
  CONSTRAINT `descuento_ibfk_1` FOREIGN KEY (`ProductoId`) REFERENCES `producto` (`ProductoId`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `descuento` */

insert  into `descuento`(`DescuentoId`,`ProductoId`,`DescuentoPorcentaje`,`DescuentoFechaInicio`,`DescuentoFechaFin`,`TipoPromo`) values 
(21,'i9e0th787rz6pxfw2zdw650g',10.00,'2026-10-05 16:19:00','2028-10-31 16:19:00','Promocion de Prueba'),
(22,'mha5v4scdnaniy435ae2uo9p',10.00,'2026-10-05 16:19:00','2028-10-31 16:19:00','Promocion de Prueba');

/*Table structure for table `moneda` */

DROP TABLE IF EXISTS `moneda`;

CREATE TABLE `moneda` (
  `MonedaId` int NOT NULL AUTO_INCREMENT,
  `MonedaNombre` varchar(35) DEFAULT NULL,
  `MonedaSimbolo` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`MonedaId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `moneda` */

insert  into `moneda`(`MonedaId`,`MonedaNombre`,`MonedaSimbolo`) values 
(1,'Pesos Uruguayos','UYU'),
(2,'Dolares','USD');

/*Table structure for table `producto` */

DROP TABLE IF EXISTS `producto`;

CREATE TABLE `producto` (
  `ProductoId` varchar(27) NOT NULL,
  `ProductoNombre` varchar(150) DEFAULT NULL,
  `ProductoDescripcion` text,
  `ProductoMarca` varchar(150) DEFAULT NULL,
  `ProductoModelo` varchar(150) DEFAULT NULL,
  `ProductoColor` varchar(50) DEFAULT NULL,
  `SubCategoriaId` int DEFAULT NULL,
  `ProductoStock` decimal(12,0) DEFAULT NULL,
  `MonedaId` int DEFAULT NULL,
  `ProductoSubtotal` decimal(12,2) DEFAULT NULL,
  `ProductoEnvio` decimal(12,2) DEFAULT NULL,
  `ProductoTotal` decimal(12,2) GENERATED ALWAYS AS ((`ProductoSubtotal` + `ProductoEnvio`)) STORED,
  `ProductoSlug` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`ProductoId`),
  KEY `MonedaId` (`MonedaId`),
  KEY `idx_producto_subcategoria` (`SubCategoriaId`),
  KEY `idx_producto_nombre` (`ProductoNombre`),
  KEY `idx_producto_descripcion` (`ProductoDescripcion`(255)),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`SubCategoriaId`) REFERENCES `subcategoria` (`SubcategoriaId`),
  CONSTRAINT `producto_ibfk_2` FOREIGN KEY (`MonedaId`) REFERENCES `moneda` (`MonedaId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `producto` */

insert  into `producto`(`ProductoId`,`ProductoNombre`,`ProductoDescripcion`,`ProductoMarca`,`ProductoModelo`,`ProductoColor`,`SubCategoriaId`,`ProductoStock`,`MonedaId`,`ProductoSubtotal`,`ProductoEnvio`,`ProductoSlug`) values 
('i9e0th787rz6pxfw2zdw650g','Prueba nueva 09102026','Esto es una prueba','Sol del Este','Conjunto Primavera','crema - canela',10,1,1,1800.00,280.00,'prueba-nueva-09102026'),
('mha5v4scdnaniy435ae2uo9p','Prueba 2','Descripción de prenda nro. 2','Sol del Este','Primavera','Café',17,1,1,4000.00,800.00,'prueba-2');

/*Table structure for table `productoimagen` */

DROP TABLE IF EXISTS `productoimagen`;

CREATE TABLE `productoimagen` (
  `ProductoImagenId` varchar(27) NOT NULL,
  `ProductoId` varchar(27) DEFAULT NULL,
  `ProductoImagenURL` text,
  `ProductoImagenNombre` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`ProductoImagenId`),
  KEY `ProductoId` (`ProductoId`),
  CONSTRAINT `productoimagen_ibfk_1` FOREIGN KEY (`ProductoId`) REFERENCES `producto` (`ProductoId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `productoimagen` */

insert  into `productoimagen`(`ProductoImagenId`,`ProductoId`,`ProductoImagenURL`,`ProductoImagenNombre`) values 
('cn2c7mnycdnkoxeif22worvx','mha5v4scdnaniy435ae2uo9p','http://localhost:3000/img/c4a560a3-e9b3-414c-9365-889036bf8cd2.jpeg',''),
('j75b348rmaobsdb3fbu8mebi','mha5v4scdnaniy435ae2uo9p','http://localhost:3000/img/e8e84586-e489-4f4d-93fa-0345360688a3.jpeg',''),
('v26pja54e17szz8i213a4rek','i9e0th787rz6pxfw2zdw650g','http://localhost:3000/img/a04ca30d-c5c3-4f8b-920d-7c2296a4b0dd.jpeg',''),
('xj00pbo2yi489wsonro60qhu','i9e0th787rz6pxfw2zdw650g','http://localhost:3000/img/5f36a1a1-7811-47f4-a7dc-c451d11730e8.jpeg','');

/*Table structure for table `rol` */

DROP TABLE IF EXISTS `rol`;

CREATE TABLE `rol` (
  `RolId` int NOT NULL AUTO_INCREMENT,
  `RolNombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`RolId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `rol` */

insert  into `rol`(`RolId`,`RolNombre`) values 
(1,'Administrador');

/*Table structure for table `subcategoria` */

DROP TABLE IF EXISTS `subcategoria`;

CREATE TABLE `subcategoria` (
  `SubcategoriaId` int NOT NULL AUTO_INCREMENT,
  `CategoriaId` int DEFAULT NULL,
  `SubCategoriaNombre` varchar(150) DEFAULT NULL,
  `SubCategoriaSlug` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`SubcategoriaId`),
  KEY `idx_subcategoria_categoria` (`CategoriaId`),
  CONSTRAINT `subcategoria_ibfk_1` FOREIGN KEY (`CategoriaId`) REFERENCES `categoria` (`CategoriaId`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `subcategoria` */

insert  into `subcategoria`(`SubcategoriaId`,`CategoriaId`,`SubCategoriaNombre`,`SubCategoriaSlug`) values 
(10,8,'Subcategoria Prueba','subcategoria-prueba'),
(11,8,'Subcategoria Prueba 2','subcategoria-prueba-2'),
(17,20,'Subcategoria Prueba 3','subcategoria-prueba-3');

/*Table structure for table `usuario` */

DROP TABLE IF EXISTS `usuario`;

CREATE TABLE `usuario` (
  `UsuarioId` varchar(27) NOT NULL,
  `UsuarioNombre` varchar(150) DEFAULT NULL,
  `UsuarioCorreo` varchar(100) DEFAULT NULL,
  `UsuarioContrasena` varchar(100) DEFAULT NULL,
  `UsuarioContacto` varchar(25) DEFAULT NULL,
  `RolId` int DEFAULT NULL,
  PRIMARY KEY (`UsuarioId`),
  KEY `RolId` (`RolId`),
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`RolId`) REFERENCES `rol` (`RolId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `usuario` */

insert  into `usuario`(`UsuarioId`,`UsuarioNombre`,`UsuarioCorreo`,`UsuarioContrasena`,`UsuarioContacto`,`RolId`) values 
('qdmk6la5t2djd0szd9id0j01','Sol Del Este','portfolio@portfolio.com','$2b$10$lFec4eLRvLW/tgoPLBbkqu0fEPJre1HgcAMXmg6LHVsSf4hRXHfe2','59899999999',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
