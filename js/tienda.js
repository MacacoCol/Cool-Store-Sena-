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


// ---------- PARTE B: tallas y filtros ----------
// Marcar una talla dentro de una tarjeta.
// Un solo listener en el contenedor sirve para todas las tarjetas (e.target dice dónde se hizo clic)
if (rejilla) {
    rejilla.addEventListener("click", (e) => {
        const botonTalla = e.target.closest(".talla");
        if (!botonTalla) {
            return; // el clic fue en otra parte de la tarjeta
        }
        const estabaMarcada = botonTalla.getAttribute("aria-pressed") === "true";
        const tarjeta = botonTalla.closest(".producto");
        tarjeta.querySelectorAll(".talla").forEach((b) => b.setAttribute("aria-pressed", "false"));
        botonTalla.setAttribute("aria-pressed", estabaMarcada ? "false" : "true"); // volver a pulsarla la desmarca
    });
}

// Filtros por talla y color: ocultan las tarjetas que no coinciden
const formFiltros = document.querySelector("#filtros");
const textoResultados = document.querySelector("#resultados");

function aplicarFiltros() {
    const tallasElegidas = [...formFiltros.querySelectorAll('input[name="talla"]:checked')].map((i) => i.value);
    const colorElegido = formFiltros.querySelector("#color").value;
    const tarjetas = document.querySelectorAll(".producto");
    let visibles = 0;

    tarjetas.forEach((tarjeta) => {
        const tallasTarjeta = tarjeta.dataset.talla.split(" ");
        const cumpleTalla = tallasElegidas.length === 0 || tallasElegidas.some((t) => tallasTarjeta.includes(t));
        const cumpleColor = colorElegido === "" || tarjeta.dataset.color === colorElegido;
        const mostrar = cumpleTalla && cumpleColor;

        tarjeta.classList.toggle("oculto", !mostrar); // la clase "oculto" viene del CSS
        if (mostrar) {
            visibles++;
        }
    });

    textoResultados.textContent =
        visibles === 0
            ? "No hay camisetas con esos filtros."
            : "Mostrando " + visibles + " de " + tarjetas.length + " camisetas";
}

if (formFiltros) {
    formFiltros.addEventListener("submit", (e) => {
        e.preventDefault(); // evita que la página se recargue
        aplicarFiltros();
    });
    formFiltros.addEventListener("change", aplicarFiltros); // se filtra apenas marcas algo
    document.querySelector("#btn-limpiar").addEventListener("click", () => {
        formFiltros.reset();
        aplicarFiltros();
    });
    aplicarFiltros(); // muestra "Mostrando 6 de 6" al cargar
}


// ---------- PARTE C: agregar al carrito ----------
if (rejilla) {
    rejilla.addEventListener("click", (e) => {
        const botonAgregar = e.target.closest(".btn-agregar");
        if (!botonAgregar) {
            return;
        }
        const tarjeta = botonAgregar.closest(".producto");
        const tallaMarcada = tarjeta.querySelector('.talla[aria-pressed="true"]');
        const talla = tallaMarcada ? tallaMarcada.dataset.talla : "";

        const resultado = agregarAlCarrito(Number(tarjeta.dataset.id), talla);
        mostrarAviso(resultado.mensaje, !resultado.ok);
        actualizarContador();
    });
}