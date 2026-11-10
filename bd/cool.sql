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

-- ==========================================================
-- PARTE 3. DML: datos de prueba (primero los padres, luego los hijos)
-- ==========================================================

INSERT INTO categorias (id_categoria, nombre, descripcion) VALUES
                                                               (1, 'Tipográficas', 'Camisetas con letras grandes y frases'),
                                                               (2, 'Minimalistas', 'Diseños limpios y de pocos elementos'),
                                                               (3, 'Ediciones limitadas', 'Lanzamientos por tiempo corto');

INSERT INTO productos (id_producto, nombre, descripcion, precio, id_categoria) VALUES
                                                                                   (1, 'Camiseta ROAD',    'Algodón peinado, letras negras minimalistas', 59900, 2),
                                                                                   (2, 'Camiseta NOIR',    'Negra con letras lima, corte oversize',        64900, 1),
                                                                                   (3, 'Camiseta LIMA',    'Color lima brillante, estampado tipográfico',  62900, 1),
                                                                                   (4, 'Camiseta VINTAGE', 'Tono crema con letras urbanas',                67900, 2),
                                                                                   (5, 'Camiseta STREET',  'Azul profundo, letras blancas de gran formato', 64900, 1),
                                                                                   (6, 'Camiseta BLOCK',   'Blanca con letras rojas en bloque',            59900, 1);

INSERT INTO variantes (id_variante, id_producto, talla, color, stock) VALUES
                                                                          (101, 1, 'M',  'gris',   15),
                                                                          (102, 1, 'L',  'gris',    8),
                                                                          (103, 2, 'L',  'negro',  20),
                                                                          (104, 2, 'M',  'negro',  10),
                                                                          (105, 3, 'M',  'lima',   12),
                                                                          (106, 3, 'XL', 'lima',    6),
                                                                          (107, 4, 'M',  'crema',   0),   -- agotada a propósito
                                                                          (108, 5, 'S',  'azul',    9),
                                                                          (109, 6, 'L',  'blanco', 14);

INSERT INTO usuarios (id_usuario, nombre, correo, clave) VALUES
                                                             (1, 'Alejandro García', 'alejandro@correo.com', 'hash_de_prueba_1'),
                                                             (2, 'María Restrepo',   'maria@correo.com',     'hash_de_prueba_2');

INSERT INTO direcciones (id_direccion, id_usuario, direccion, ciudad, departamento, telefono) VALUES
                                                                                                  (1, 1, 'Calle 10 # 5-20',  'Bogotá',   'Cundinamarca', '3001112233'),
                                                                                                  (2, 2, 'Carrera 7 # 45-10', 'Medellín', 'Antioquia',    '3104445566');

INSERT INTO pedidos (id_pedido, id_usuario, id_direccion, estado, costo_envio) VALUES
                                                                                   (101, 1, 1, 'pagado', 0),
                                                                                   (102, 2, 2, 'pagado', 9900);

-- Pedido 101: ROAD M x2 + NOIR L x1 = $ 184.700 (el mismo ejemplo del carrito de la página)
INSERT INTO detalle_pedido (id_pedido, id_variante, cantidad, precio_unitario) VALUES
                                                                                   (101, 101, 2, 59900),
                                                                                   (101, 103, 1, 64900),
                                                                                   (102, 105, 1, 62900);

-- Monto = subtotal + IVA 19% + envío
INSERT INTO pagos (id_pedido, metodo, monto, estado) VALUES
                                                         (101, 'Tarjeta de crédito', 219793, 'aprobado'),
                                                         (102, 'PSE',
                                                          84751, 'aprobado');

-- ==========================================================
-- PARTE 4. DML: consultas, actualizaciones, borrado y transacción
-- ==========================================================

-- 4.1 Consulta básica: productos con su categoría (INNER JOIN con alias)
SELECT p.id_producto, p.nombre AS producto, p.precio, c.nombre AS categoria
FROM productos p
         INNER JOIN categorias c ON p.id_categoria = c.id_categoria;

-- 4.2 LEFT JOIN: todas las categorías, aunque no tengan productos
SELECT c.nombre AS categoria, COUNT(p.id_producto) AS cantidad_productos
FROM categorias c
         LEFT JOIN productos p ON p.id_categoria = c.id_categoria
GROUP BY c.id_categoria, c.nombre;

-- 4.3 Detalle de cada compra (la "factura")
SELECT pe.id_pedido, u.nombre AS cliente, u.correo, d.ciudad,
       pr.nombre AS producto, v.talla, v.color,
       dp.cantidad, dp.precio_unitario,
       dp.cantidad * dp.precio_unitario AS subtotal,
       pg.metodo AS pago
FROM pedidos pe
         INNER JOIN usuarios u         ON pe.id_usuario   = u.id_usuario
         INNER JOIN direcciones d      ON pe.id_direccion = d.id_direccion
         INNER JOIN detalle_pedido dp  ON dp.id_pedido    = pe.id_pedido
         INNER JOIN variantes v        ON dp.id_variante  = v.id_variante
         INNER JOIN productos pr       ON v.id_producto   = pr.id_producto
         LEFT JOIN  pagos pg           ON pg.id_pedido    = pe.id_pedido
ORDER BY pe.id_pedido;

-- 4.4 Cuánto ha comprado cada cliente (sin IVA ni envío)
SELECT u.nombre AS cliente, SUM(dp.cantidad * dp.precio_unitario) AS total_comprado
FROM usuarios u
         INNER JOIN pedidos pe        ON pe.id_usuario = u.id_usuario
         INNER JOIN detalle_pedido dp ON dp.id_pedido  = pe.id_pedido
GROUP BY u.id_usuario, u.nombre;

-- 4.5 UPDATE: descontar una unidad del stock de la variante 101
SELECT id_variante, stock FROM variantes WHERE id_variante = 101;
UPDATE variantes SET stock = stock - 1 WHERE id_variante = 101;
SELECT id_variante, stock FROM variantes WHERE id_variante = 101;

-- 4.6 UPDATE: el pedido 101 pasa de "pagado" a "entregado"
UPDATE pedidos SET estado = 'entregado' WHERE id_pedido = 101;
SELECT id_pedido, estado FROM pedidos;

-- 4.7 DELETE con condición: quitar la variante agotada que nunca se vendió
-- (si la variante tuviera ventas, MySQL no la dejaría borrar: integridad referencial)
DELETE FROM variantes WHERE id_variante = 107 AND stock = 0;
SELECT * FROM variantes;

-- 4.8 Transacción: una compra completa (todo se guarda o nada se guarda)
START TRANSACTION;

INSERT INTO pedidos (id_usuario, id_direccion, estado, costo_envio)
VALUES (2, 2, 'pagado', 9900);
SET @id_pedido = LAST_INSERT_ID();   -- el número que MySQL le asignó al pedido

INSERT INTO detalle_pedido (id_pedido, id_variante, cantidad, precio_unitario)
VALUES (@id_pedido, 103, 1, 64900);

UPDATE variantes SET stock = stock - 1 WHERE id_variante = 103;

INSERT INTO pagos (id_pedido, metodo, monto, estado)
VALUES (@id_pedido, 'Tarjeta de crédito', 87131, 'aprobado');

COMMIT;      -- si algo falla antes, en lugar de COMMIT se ejecuta ROLLBACK;

SELECT * FROM pedidos;

-- 4.9 Prueba de integridad referencial (ejecútala sola: debe dar ERROR)
-- No se puede borrar una categoría que tiene productos:
-- DELETE FROM categorias WHERE id_categoria = 1;