-- ==========================================================
-- cool.sql — Base de datos de Cool Studio (tienda de camisetas)
-- Motor: MySQL 8 | Herramienta: MySQL Workbench
-- Contenido: DDL (estructura) + DML (datos y consultas)
-- ==========================================================

-- Si la base existe se elimina y se crea de nuevo (así el script se puede repetir)
DROP DATABASE IF EXISTS cool;
CREATE DATABASE cool CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cool;

-- ==========================================================
-- PARTE 1. DDL: catálogo y usuarios (tablas "padre")
-- Convención: tablas en plural, columnas en singular
-- ==========================================================

CREATE TABLE categorias (
                            id_categoria INT AUTO_INCREMENT PRIMARY KEY,
                            nombre       VARCHAR(100) NOT NULL UNIQUE,
                            descripcion  TEXT
);

CREATE TABLE productos (
                           id_producto  INT AUTO_INCREMENT PRIMARY KEY,
                           nombre       VARCHAR(120) NOT NULL,
                           descripcion  TEXT,
                           precio       DECIMAL(10,0) NOT NULL CHECK (precio > 0),
                           id_categoria INT NOT NULL,
                           CONSTRAINT fk_productos_categoria
                               FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
                                   ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Una variante = un producto en una talla y color, con su propio stock
CREATE TABLE variantes (
                           id_variante INT AUTO_INCREMENT PRIMARY KEY,
                           id_producto INT NOT NULL,
                           talla       VARCHAR(5)  NOT NULL,
                           color       VARCHAR(30) NOT NULL,
                           stock       INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
                           UNIQUE (id_producto, talla, color),
                           CONSTRAINT fk_variantes_producto
                               FOREIGN KEY (id_producto) REFERENCES productos (id_producto)
                                   ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE usuarios (
                          id_usuario     INT AUTO_INCREMENT PRIMARY KEY,
                          nombre         VARCHAR(100) NOT NULL,
                          correo         VARCHAR(120) NOT NULL UNIQUE,
                          clave          VARCHAR(255) NOT NULL,  -- se guarda cifrada (hash), nunca en texto plano
                          estado         VARCHAR(10)  NOT NULL DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
                          fecha_registro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE direcciones (
                             id_direccion INT AUTO_INCREMENT PRIMARY KEY,
                             id_usuario   INT NOT NULL,
                             direccion    VARCHAR(150) NOT NULL,
                             ciudad       VARCHAR(80)  NOT NULL,
                             departamento VARCHAR(80)  NOT NULL,
                             telefono     VARCHAR(20),
                             CONSTRAINT fk_direcciones_usuario
                                 FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
                                     ON UPDATE CASCADE ON DELETE RESTRICT
);