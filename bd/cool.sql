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

-- ==========================================================
-- PARTE 2. DDL: pedidos, detalle (tabla intermedia) y pagos
-- ==========================================================

CREATE TABLE pedidos (
                         id_pedido    INT AUTO_INCREMENT PRIMARY KEY,
                         id_usuario   INT NOT NULL,
                         id_direccion INT NOT NULL,
                         fecha        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                         estado       VARCHAR(15) NOT NULL DEFAULT 'pendiente'
                             CHECK (estado IN ('pendiente', 'pagado', 'entregado', 'cancelado')),
                         costo_envio  DECIMAL(10,0) NOT NULL DEFAULT 0,
                         CONSTRAINT fk_pedidos_usuario
                             FOREIGN KEY (id_usuario) REFERENCES usuarios (id_usuario)
                                 ON UPDATE CASCADE ON DELETE RESTRICT,
                         CONSTRAINT fk_pedidos_direccion
                             FOREIGN KEY (id_direccion) REFERENCES direcciones (id_direccion)
                                 ON UPDATE CASCADE ON DELETE RESTRICT
) AUTO_INCREMENT = 101;

-- Relación de muchos a muchos entre pedidos y variantes.
-- Llave primaria compuesta: cada variante aparece una sola vez por pedido
CREATE TABLE detalle_pedido (
                                id_pedido       INT NOT NULL,
                                id_variante     INT NOT NULL,
                                cantidad        INT NOT NULL CHECK (cantidad > 0),
                                precio_unitario DECIMAL(10,0) NOT NULL,   -- precio al momento de la compra
                                PRIMARY KEY (id_pedido, id_variante),
                                CONSTRAINT fk_detalle_pedido
                                    FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
                                        ON UPDATE CASCADE ON DELETE CASCADE,
                                CONSTRAINT fk_detalle_variante
                                    FOREIGN KEY (id_variante) REFERENCES variantes (id_variante)
                                        ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE pagos (
                       id_pago    INT AUTO_INCREMENT PRIMARY KEY,
                       id_pedido  INT NOT NULL,
                       metodo     VARCHAR(30) NOT NULL,
                       monto      DECIMAL(10,0) NOT NULL CHECK (monto > 0),
                       estado     VARCHAR(15) NOT NULL DEFAULT 'pendiente'
                           CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
                       fecha_pago DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                       CONSTRAINT fk_pagos_pedido
                           FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido)
                               ON UPDATE CASCADE ON DELETE RESTRICT
);