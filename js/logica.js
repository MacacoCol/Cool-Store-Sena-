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