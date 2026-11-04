// ==========================================================
// logica.js — Datos y funciones de Cool Studio (sin DOM)
// Aquí vive la "lógica": qué camisetas hay y cómo se calcula.
// Lo visual (DOM y eventos) está en tienda.js
// ==========================================================

// ---------- Constantes ----------
const nombreTienda = "Cool Studio";
const IVA = 0.19;
const COSTO_ENVIO = 9900;
const ENVIO_GRATIS_DESDE = 150000;
const CLAVE_CARRITO = "coolstudio_carrito"; // nombre con el que se guarda en el navegador

// ---------- Datos: arreglo de objetos (llave: valor) ----------
const camisetas = [
    {
        id: 1, nombre: "Camiseta ROAD gris", precio: 59900, color: "gris", imagen: "camisa-gris.svg",
        tallas: ["S", "M", "L", "XL"], disponible: true, descripcion: "Algodón peinado, letras negras minimalistas."
    },
    {
        id: 2, nombre: "Camiseta NOIR", precio: 64900, color: "negro", imagen: "camisa-negra.svg",
        tallas: ["S", "M", "L", "XL"], disponible: true, descripcion: "Negra con letras lima, corte oversize."
    },
    {
        id: 3, nombre: "Camiseta LIMA", precio: 62900, color: "lima", imagen: "camisa-lima.svg",
        tallas: ["M", "L", "XL"], disponible: true, descripcion: "Color lima brillante, estampado tipográfico."
    },
    {
        id: 4, nombre: "Camiseta VINTAGE", precio: 67900, color: "crema", imagen: "camisa-crema.svg",
        tallas: ["S", "M", "L"], disponible: false, descripcion: "Tono crema con letras urbanas estilo vintage." // agotada a propósito
    },
    {
        id: 5, nombre: "Camiseta STREET", precio: 64900, color: "azul", imagen: "camisa-azul.svg",
        tallas: ["S", "M", "L", "XL"], disponible: true, descripcion: "Azul profundo, letras blancas de gran formato."
    },
    {
        id: 6, nombre: "Camiseta BLOCK", precio: 59900, color: "blanco", imagen: "camisa-blanca.svg",
        tallas: ["M", "L", "XL"], disponible: true, descripcion: "Blanca con letras rojas en bloque."
    }
];

// ---------- Funciones de apoyo ----------
function buscarPorId(id) {
    return camisetas.find((c) => c.id === id);
}

// Función clásica
function calcularTotal(precio, cantidad) {
    return precio * cantidad;
}

// Función flecha (una sola línea: no lleva return)
const conIVA = (valor) => Math.round(valor * (1 + IVA));

// Da formato de pesos colombianos: 59900 -> $ 59.900
const formatearPesos = (valor) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(valor);

// ---------- Estado del carrito ----------
// Cada ítem guarda solo { id, talla, cantidad }; el nombre y el precio se buscan en "camisetas"
let carrito = cargarCarrito();

function esItemValido(item) {
    const camiseta = item ? buscarPorId(item.id) : undefined;
    return Boolean(camiseta) && camiseta.tallas.includes(item.talla) && Number.isInteger(item.cantidad) && item.cantidad > 0;
}

function cargarCarrito() {
    try {
        const guardado = localStorage.getItem(CLAVE_CARRITO);
        const lista = guardado ? JSON.parse(guardado) : [];
        return Array.isArray(lista) ? lista.filter(esItemValido) : [];
    } catch (error) {
        return []; // si el navegador no deja guardar, se empieza vacío
    }
}

function guardarCarrito() {
    try {
        localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
    } catch (error) {
        // sin almacenamiento: el carrito vive solo mientras la página esté abierta
    }
}

// Agrega una camiseta. Devuelve { ok, mensaje } para que quien la llame lo muestre
function agregarAlCarrito(id, talla, cantidad = 1) {
    const camiseta = buscarPorId(id);
    if (!camiseta) {
        return { ok: false, mensaje: "No encontramos ese producto" };
    }
    if (!camiseta.disponible) {
        return { ok: false, mensaje: camiseta.nombre + " está agotada" };
    }
    if (!talla) {
        return { ok: false, mensaje: "Selecciona una talla primero" };
    }
    if (!camiseta.tallas.includes(talla)) {
        return { ok: false, mensaje: "La talla " + talla + " no está disponible" };
    }

    const existente = carrito.find((item) => item.id === id && item.talla === talla);
    if (existente) {
        existente.cantidad += cantidad; // misma camiseta y talla: solo suma, no duplica la fila
    } else {
        carrito.push({ id: id, talla: talla, cantidad: cantidad });
    }
    guardarCarrito();
    return { ok: true, mensaje: camiseta.nombre + " (talla " + talla + ") agregada al carrito" };
}

// Suma o resta unidades. Si llega a 0 se quita: nunca hay cantidades negativas
function cambiarCantidad(id, talla, cambio) {
    const indice = carrito.findIndex((item) => item.id === id && item.talla === talla);
    if (indice === -1) {
        return;
    }
    carrito[indice].cantidad += cambio;
    if (carrito[indice].cantidad <= 0) {
        carrito.splice(indice, 1);
    }
    guardarCarrito();
}

function quitarDelCarrito(id, talla) {
    carrito = carrito.filter((item) => !(item.id === id && item.talla === talla));
    guardarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
}

// Total de unidades (lo que muestra el contador)
function contarProductos() {
    return carrito.reduce((suma, item) => suma + item.cantidad, 0);
}

// Subtotal, IVA, envío y total en pesos
function calcularResumen() {
    const subtotal = carrito.reduce(
        (suma, item) => suma + calcularTotal(buscarPorId(item.id).precio, item.cantidad),
        0
    );
    const iva = conIVA(subtotal) - subtotal;
    const envio = subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;
    return { subtotal: subtotal, iva: iva, envio: envio, total: subtotal + iva + envio };
}

console.log(nombreTienda + ": " + camisetas.length + " camisetas, " + contarProductos() + " en el carrito");