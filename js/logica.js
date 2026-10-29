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