/* =========================================
   Vista Administrador · Usuarios
   Listado dinámico, búsqueda, filtro por tipo
   y eliminación (persistido en localStorage)

   Depende de js/usuarios-datos.js (debe cargarse antes que este archivo)
========================================= */

let usuarios = obtenerUsuarios();

const cuerpoTabla = document.getElementById("cuerpoTablaUsuarios");
const mensajeVacio = document.getElementById("mensajeVacio");
const buscador = document.getElementById("buscadorUsuarios");
const filtroTipo = document.getElementById("filtroTipo");
const avisoExito = document.getElementById("avisoExito");

// Devuelve la clase de color según el tipo de usuario.
function claseBadge(tipo) {
    switch (tipo) {
        case "Administrador":
            return "badge-administrador";
        case "Vendedor":
            return "badge-vendedor";
        default:
            return "badge-cliente";
    }
}

// Dibuja la tabla a partir de una lista ya filtrada.
function renderizarTabla(lista) {
    cuerpoTabla.innerHTML = "";

    if (lista.length === 0) {
        mensajeVacio.hidden = false;
        return;
    }
    mensajeVacio.hidden = true;

    lista.forEach((usuario) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${usuario.run}</td>
            <td>${usuario.nombre} ${usuario.apellidos}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.comuna}</td>
            <td><span class="badge-tipo ${claseBadge(usuario.tipo)}">${usuario.tipo}</span></td>
            <td class="col-acciones">
                <div class="acciones-usuario">
                    <button type="button" class="btn-accion btn-editar-usuario" data-run="${usuario.run}">Editar</button>
                    <button type="button" class="btn-accion btn-eliminar-usuario" data-run="${usuario.run}">Eliminar</button>
                </div>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

// Aplica el texto de búsqueda y el filtro de tipo sobre la lista completa.
function aplicarFiltros() {
    const texto = buscador.value.trim().toLowerCase();
    const tipo = filtroTipo.value;

    const filtrados = usuarios.filter((usuario) => {
        const coincideTexto =
            !texto ||
            usuario.nombre.toLowerCase().includes(texto) ||
            usuario.apellidos.toLowerCase().includes(texto) ||
            usuario.run.toLowerCase().includes(texto) ||
            usuario.correo.toLowerCase().includes(texto);

        const coincideTipo = !tipo || usuario.tipo === tipo;

        return coincideTexto && coincideTipo;
    });

    renderizarTabla(filtrados);
}

// Elimina un usuario por su RUN y vuelve a dibujar la tabla.
function eliminarUsuario(run) {
    usuarios = usuarios.filter((usuario) => usuario.run !== run);
    guardarUsuarios(usuarios);
    aplicarFiltros();
}

// Delegación de eventos para los botones de cada fila (se generan dinámicamente).
cuerpoTabla.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button");
    if (!boton) return;

    const run = boton.dataset.run;

    if (boton.classList.contains("btn-eliminar-usuario")) {
        const confirmado = confirm("¿Eliminar este usuario del listado?");
        if (confirmado) {
            eliminarUsuario(run);
        }
    }

    if (boton.classList.contains("btn-editar-usuario")) {
        // La vista "Editar usuario" se implementará junto al resto del
        // mantenedor (fuera del alcance de este archivo).
        alert("La edición de usuarios se implementará en la vista 'Editar usuario'.");
    }
});

buscador.addEventListener("input", aplicarFiltros);
filtroTipo.addEventListener("change", aplicarFiltros);

// Si venimos recién de crear un usuario en nuevo-usuario.html, mostramos el aviso.
function mostrarAvisoSiCorresponde() {
    const parametros = new URLSearchParams(window.location.search);
    if (parametros.get("creado") === "1") {
        avisoExito.textContent = "Usuario creado correctamente.";
        avisoExito.hidden = false;

        // Limpia el parámetro de la URL sin recargar la página.
        const url = new URL(window.location.href);
        url.searchParams.delete("creado");
        window.history.replaceState({}, "", url);
    }
}

// Primer render al cargar la página.
renderizarTabla(usuarios);
mostrarAvisoSiCorresponde();