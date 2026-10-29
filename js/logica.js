// ==========================================================
// logica.js — Lógica de Cool Studio (solo consola, sin DOM)
// ==========================================================

// ---------- PARTE 1: variables, tipos de datos y arreglo ----------
const nombreTienda = "Cool Studio"; // string: no cambia
const IVA = 0.19;                   // number: constante
let totalCarrito = 0;               // number: cambia al agregar productos
let carrito = [];                   // arreglo vacío: aquí se hace push

// Arreglo de objetos (llave: valor). Los índices empiezan en 0.
const camisetas = [
    { id: 1, nombre: "Camiseta ROAD gris",  precio: 59900, color: "gris",   tallas: ["S", "M", "L", "XL"], disponible: true },
    { id: 2, nombre: "Camiseta NOIR",       precio: 64900, color: "negro",  tallas: ["S", "M", "L", "XL"], disponible: true },
    { id: 3, nombre: "Camiseta LIMA",       precio: 62900, color: "lima",   tallas: ["M", "L", "XL"],      disponible: true },
    { id: 4, nombre: "Camiseta VINTAGE",    precio: 67900, color: "crema",  tallas: ["S", "M", "L"],       disponible: false }, // agotada a propósito
    { id: 5, nombre: "Camiseta STREET",     precio: 64900, color: "azul",   tallas: ["S", "M", "L", "XL"], disponible: true },
    { id: 6, nombre: "Camiseta BLOCK",      precio: 59900, color: "blanco", tallas: ["M", "L", "XL"],      disponible: true }
];

// Pruebas por consola (F12 > Consola)
console.log("Tienda: " + nombreTienda); // concatenación
console.log("Camisetas en el catálogo:", camisetas.length);
console.log("Primera camiseta:", camisetas[0].nombre);
console.log("Tipo de nombreTienda:", typeof nombreTienda);
console.log("Tipo de IVA:", typeof IVA);
console.log("Tipo de disponible:", typeof camisetas[0].disponible);
console.log("Tipo de camisetas:", typeof camisetas);
console.log("5 == '5' ->", 5 == "5");   // true: compara solo el valor
console.log("5 === '5' ->", 5 === "5"); // false: compara valor y tipo


// ---------- PARTE 2: filtros y métodos de arreglos ----------
// filter: devuelve TODAS las que cumplan la condición
const filtrarPorColor = (color) => camisetas.filter((c) => c.color === color);
const filtrarPorTalla = (talla) => camisetas.filter((c) => c.tallas.includes(talla));

// find: devuelve solo la PRIMERA que cumpla (o undefined si no hay)
const buscarPrimeraPorTalla = (talla) => camisetas.find((c) => c.tallas.includes(talla));

// map: crea un arreglo nuevo solo con los nombres
const nombres = camisetas.map((c) => c.nombre);

// reduce: llega a un solo resultado (suma de todos los precios)
const sumaPrecios = camisetas.reduce((suma, c) => suma + c.precio, 0);

console.log("Color azul:", filtrarPorColor("azul"));
console.log("Talla S (todas):", filtrarPorTalla("S").map((c) => c.nombre));
console.log("Talla XL (primera):", buscarPrimeraPorTalla("XL").nombre);
console.log("Nombres:", nombres);
console.log("Suma de precios del catálogo:", sumaPrecios);


// ---------- PARTE 3: funciones, carrito, condicionales y ciclos ----------
// Función clásica
function calcularTotal(precio, cantidad) {
    return precio * cantidad;
}

// Función flecha (una sola línea: no lleva return)
const conIVA = (valor) => Math.round(valor * (1 + IVA));

// Agregar al carrito: if / else if / else con push
function agregarAlCarrito(camiseta, talla, cantidad = 1) {
    if (!camiseta.disponible) {
        alert("Producto agotado: " + camiseta.nombre);
    } else if (!camiseta.tallas.includes(talla)) {
        console.log("La talla " + talla + " no está disponible para " + camiseta.nombre);
    } else {
        carrito.push({
            id: camiseta.id,
            nombre: camiseta.nombre,
            talla: talla,
            cantidad: cantidad,
            precio: camiseta.precio
        });
        // Se recalcula el total sumando precio x cantidad de cada ítem
        totalCarrito = carrito.reduce(
            (suma, item) => suma + calcularTotal(item.precio, item.cantidad),
            0
        );
        console.log("Agregada: " + camiseta.nombre + " (talla " + talla + ") x" + cantidad);
    }
}

// Pruebas
agregarAlCarrito(camisetas[0], "M", 2); // ok
agregarAlCarrito(camisetas[1], "L");    // ok
agregarAlCarrito(camisetas[2], "S");    // talla no disponible
agregarAlCarrito(camisetas[3], "M");    // agotada -> sale un alert al recargar (comenta esta línea si te molesta)

console.log("Carrito:", carrito);
console.log("Ítems en el carrito:", carrito.length);
console.log("Subtotal:", totalCarrito);
console.log("Total con IVA:", conIVA(totalCarrito));

// Operadores lógicos: && (y), || (o), ! (no)
const hayEnvioGratis = totalCarrito >= 150000 && carrito.length > 0;
console.log("¿Envío gratis?", hayEnvioGratis);

// Ciclo for clásico (por índice)
console.log("--- Catálogo (for clásico) ---");
for (let i = 0; i < camisetas.length; i++) {
    console.log(i + ". " + camisetas[i].nombre + " - $" + camisetas[i].precio);
}

// Ciclo for...of (moderno, recorre cada elemento)
console.log("--- Disponibilidad (for...of) ---");
for (const camiseta of camisetas) {
    console.log(camiseta.nombre + ": " + (camiseta.disponible ? "disponible" : "agotada"));
}