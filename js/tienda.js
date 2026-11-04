// ==========================================================
// tienda.js — DOM y eventos de Cool Studio
// Necesita que logica.js se cargue ANTES (ver los <script>)
// ==========================================================

// ---------- PARTE A: utilidades y catálogo ----------
// Aviso flotante: crea con JavaScript un elemento que no existe en el HTML
function mostrarAviso(texto, esError = false) {
    let aviso = document.querySelector("#aviso");
    if (!aviso) {
        aviso = document.createElement("p");
        aviso.id = "aviso";
        aviso.setAttribute("role", "status");
        document.body.appendChild(aviso);
    }
    aviso.textContent = texto;
    aviso.classList.toggle("aviso-error", esError);
    aviso.classList.add("visible");
    clearTimeout(mostrarAviso.temporizador);
    mostrarAviso.temporizador = setTimeout(() => aviso.classList.remove("visible"), 2500);
}

// Contador del botón "Carrito" del encabezado
function actualizarContador() {
    const enlace = document.querySelector("#carrito") || document.querySelector('a[href="carrito.html"]');
    if (enlace) {
        enlace.textContent = "Carrito (" + contarProductos() + ")";
    }
}
actualizarContador();

// Catálogo: una tarjeta por cada camiseta del arreglo.
// Los data-* guardan los datos que luego leen los filtros (dataset)
const rejilla = document.querySelector("#catalogo");

function crearTarjeta(camiseta) {
    const agotada = !camiseta.disponible;
    const botonesTalla = camiseta.tallas
        .map((t) => '<button type="button" class="talla" data-talla="' + t + '" aria-pressed="false">' + t + "</button>")
        .join("");

    return `
    <article class="producto${agotada ? " agotado" : ""}" data-id="${camiseta.id}" data-color="${camiseta.color}" data-talla="${camiseta.tallas.join(" ")}" data-precio="${camiseta.precio}">
      ${agotada ? '<span class="etiqueta etiqueta-agotado">AGOTADO</span>' : ""}
      <img src="img/${camiseta.imagen}" alt="${camiseta.nombre}" width="300" height="300" loading="lazy">
      <h3><a href="producto.html">${camiseta.nombre}</a></h3>
      <p class="descripcion">${camiseta.descripcion}</p>
      <div class="tallas" role="group" aria-label="Elige tu talla">${botonesTalla}</div>
      <p class="precio">${formatearPesos(camiseta.precio)}</p>
      <button type="button" class="btn btn-agregar"${agotada ? " disabled" : ""}>${agotada ? "Agotado" : "Agregar al carrito"}</button>
    </article>`;
}

if (rejilla) {
    rejilla.innerHTML = camisetas.map(crearTarjeta).join("");
}