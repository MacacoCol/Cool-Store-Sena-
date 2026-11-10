# Cool Studio — Tienda de camisas (HTML + CSS + Git)

Proyecto estático del caso de estudio del encuentro ADSO (21 de octubre de 2026):
maquetación de un e-commerce con HTML5 semántico, CSS con Flexbox y Grid,
diseño responsivo y control de versiones con Git.

## Cómo verlo en VS Code

1. Abre la carpeta `tienda-online` (`Archivo > Abrir carpeta`) o, desde Git Bash dentro de ella: `code .`
2. Instala la extensión **Live Server** o **Live Preview**.
3. Clic derecho en `index.html` > **Open with Live Server** (o *Show Preview*).

## Estructura

```
tienda-online/
├── index.html            Portada: header, nav, main, sections, articles, footer
├── catalogo.html         Catálogo con filtros y rejilla (Grid)
├── producto.html         Detalle de producto, tallas, opiniones
├── carrito.html          Carrito, datos de envío y medio de pago
├── lanzamientos.html     Recién llegados
├── arte.html             Ediciones limitadas
├── tienda.html           Sedes y cambios
├── editorial.html        Outfits completos
├── contacto.html         Formulario de contacto
├── registro.html         Registro de usuario
├── login.html            Inicio de sesión
├── recuperar.html        Recuperar contraseña
├── mantenimiento.html    Página fuera de servicio
├── css/
│   ├── base.css          Variables (:root), reset (*), body
│   ├── componentes.css   Header, botones, tarjetas, formularios, footer
│   └── paginas.css       Maquetación por página y media queries
├── img/                  Imágenes SVG (camisas, accesorios, favicon)
└── js/                   Vacía por ahora (JavaScript desde la próxima semana)
```

## Qué incluye (según lo pedido por el instructor)

- Estructura HTML5 semántica: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Encabezados `h1` a `h6`, párrafos, enlaces con ancla (`href="#catalogo"`), listas, imágenes con `alt`.
- Formularios con `label for` igual al `id` del `input` (registro, login, recuperar, contacto, envío).
- CSS por etiqueta, por clase (`.producto`) y por id (`#catalogo`).
- Modelo de caja: `padding`, `margin`, `border`, `border-radius`, `box-sizing`.
- Flexbox en el menú (`display: flex`, `gap`, `flex-wrap`) y Grid en el catálogo.
- Responsive con `viewport`, `@media (max-width)`, unidades relativas.
- Pseudoclases `:hover` y `:focus`.
- Variables CSS y colores hexadecimales (lima `#c3f400`).
- Historial de Git con commits descriptivos por archivo.

## Comandos de Git usados

```bash
git init
git config user.name "Tu nombre"
git config user.email "tu@correo.com"
git status
git add archivo
git commit -m "Agrega ..."
git log --oneline
```

## Entrega

Comprime la carpeta `tienda-online` **incluyendo la carpeta oculta `.git`** y agrega un archivo con tu nombre y número de ficha.

## Sesión 3: DOM, eventos y carrito

Se pasó de páginas estáticas a páginas interactivas con JavaScript.

- `js/logica.js`: datos de las camisetas, cálculo de subtotal, IVA, envío y total, y el estado del carrito (se guarda en `localStorage`).
- `js/tienda.js`: manipula el DOM con `querySelector`, `querySelectorAll`, `classList`, `dataset` y `addEventListener`.

Qué hace cada pantalla:

- **Catálogo:** tarjetas creadas desde el arreglo, filtros por talla y color con botón de limpiar, y contador de resultados.
- **Agregar al carrito:** exige elegir una talla, avisa si la camiseta está agotada y actualiza el contador del encabezado.
- **Carrito:** lista con suma, resta y quitar, y total en pesos colombianos (nunca queda en negativo).
- **Login:** validación con el evento `submit` (correo con `@`, contraseña de mínimo 8 caracteres).

Los commits siguen el formato `tipo: verbo en infinitivo` (`feat`, `fix`, `style`, `refactor`, `docs`).

## Sesión 4: base de datos

Modelo relacional de la tienda en MySQL 8, creado y probado con MySQL Workbench.

- `bd/cool.sql`: script con la estructura (DDL), los datos de prueba (DML), consultas con `JOIN`, actualizaciones, borrado con condición y una transacción.
- `bd/modelo-er.png`: diagrama entidad-relación.

Tablas (8): `categorias`, `productos`, `variantes`, `usuarios`, `direcciones`, `pedidos`, `detalle_pedido` y `pagos`.

Cómo usarlo: abrir `bd/cool.sql` en Workbench y ejecutarlo completo. Crea la base `cool` desde cero.

Las ramas siguen el formato `feature/nombre`: este trabajo se hizo en `feature/modelo-db` y se integró con `merge`.