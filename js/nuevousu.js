/* =========================================
   Vista Administrador · Nuevo Usuario
   Validación en tiempo real según reglas del ERS

   Depende de:
   - js/regiones.js       (mapa región -> comunas)
   - js/usuarios-datos.js (localStorage de usuarios)
========================================= */

const CORREOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

const formulario = document.getElementById("formNuevoUsuario");
const campoRun = document.getElementById("run");
const campoNombre = document.getElementById("nombre");
const campoApellidos = document.getElementById("apellidos");
const campoCorreo = document.getElementById("correo");
const campoFechaNacimiento = document.getElementById("fechaNacimiento");
const campoTipoUsuario = document.getElementById("tipoUsuario");
const campoRegion = document.getElementById("region");
const campoComuna = document.getElementById("comuna");
const campoDireccion = document.getElementById("direccion");

/* -----------------------------------------
   Región / Comuna dependientes
------------------------------------------ */
function cargarRegiones() {
    Object.keys(regionesComunas).forEach((region) => {
        const opcion = document.createElement("option");
        opcion.value = region;
        opcion.textContent = region;
        campoRegion.appendChild(opcion);
    });
}

function cargarComunasDe(region) {
    campoComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

    if (!region || !regionesComunas[region]) {
        campoComuna.disabled = true;
        return;
    }

    regionesComunas[region].forEach((comuna) => {
        const opcion = document.createElement("option");
        opcion.value = comuna;
        opcion.textContent = comuna;
        campoComuna.appendChild(opcion);
    });
    campoComuna.disabled = false;
}

campoRegion.addEventListener("change", () => {
    cargarComunasDe(campoRegion.value);
    validarCampo("region");
});

/* -----------------------------------------
   Validación de RUN chileno (módulo 11)
   Formato esperado: sin puntos ni guion, ej. 191122334
------------------------------------------ */
function calcularDigitoVerificador(cuerpo) {
    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * multiplo;
        multiplo = multiplo < 7 ? multiplo + 1 : 2;
    }

    const resto = 11 - (suma % 11);
    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return String(resto);
}

function esRunValido(runOriginal) {
    const run = runOriginal.toUpperCase().trim();

    if (!/^[0-9]+[0-9K]$/.test(run)) return false;
    if (run.length < 7 || run.length > 9) return false;

    const cuerpo = run.slice(0, -1);
    const dv = run.slice(-1);

    return calcularDigitoVerificador(cuerpo) === dv;
}

/* -----------------------------------------
   Reglas de validación por campo
   (según sección "Usuario" del ERS)
------------------------------------------ */
function validarCampo(nombreCampo) {
    let esValido = true;
    let mensaje = "";

    switch (nombreCampo) {
        case "run": {
            const valor = campoRun.value.trim();
            if (!valor) {
                mensaje = "El RUN es obligatorio.";
                esValido = false;
            } else if (valor.length < 7 || valor.length > 9) {
                mensaje = "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.";
                esValido = false;
            } else if (!esRunValido(valor)) {
                mensaje = "El RUN ingresado no es válido.";
                esValido = false;
            }
            break;
        }

        case "nombre": {
            const valor = campoNombre.value.trim();
            if (!valor) {
                mensaje = "El nombre es obligatorio.";
                esValido = false;
            } else if (valor.length > 50) {
                mensaje = "El nombre no puede superar los 50 caracteres.";
                esValido = false;
            }
            break;
        }

        case "apellidos": {
            const valor = campoApellidos.value.trim();
            if (!valor) {
                mensaje = "Los apellidos son obligatorios.";
                esValido = false;
            } else if (valor.length > 100) {
                mensaje = "Los apellidos no pueden superar los 100 caracteres.";
                esValido = false;
            }
            break;
        }

        case "correo": {
            const valor = campoCorreo.value.trim();
            const dominio = valor.includes("@") ? valor.split("@")[1] : "";
            if (!valor) {
                mensaje = "El correo es obligatorio.";
                esValido = false;
            } else if (valor.length > 100) {
                mensaje = "El correo no puede superar los 100 caracteres.";
                esValido = false;
            } else if (!CORREOS_PERMITIDOS.includes(dominio.toLowerCase())) {
                mensaje = "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
                esValido = false;
            }
            break;
        }

        case "fechaNacimiento": {
            const valor = campoFechaNacimiento.value;
            if (valor) {
                const fechaIngresada = new Date(valor);
                const hoy = new Date();
                if (fechaIngresada > hoy) {
                    mensaje = "La fecha de nacimiento no puede ser futura.";
                    esValido = false;
                }
            }
            break;
        }

        case "tipoUsuario": {
            if (!campoTipoUsuario.value) {
                mensaje = "Selecciona el tipo de usuario.";
                esValido = false;
            }
            break;
        }

        case "region": {
            if (!campoRegion.value) {
                mensaje = "Selecciona una región.";
                esValido = false;
            }
            break;
        }

        case "comuna": {
            if (!campoComuna.value) {
                mensaje = "Selecciona una comuna.";
                esValido = false;
            }
            break;
        }

        case "direccion": {
            const valor = campoDireccion.value.trim();
            if (!valor) {
                mensaje = "La dirección es obligatoria.";
                esValido = false;
            } else if (valor.length > 300) {
                mensaje = "La dirección no puede superar los 300 caracteres.";
                esValido = false;
            }
            break;
        }

        default:
            break;
    }

    mostrarResultadoValidacion(nombreCampo, esValido, mensaje);
    return esValido;
}

function idsPorCampo(nombreCampo) {
    const mapa = {
        run: { input: "run", error: "errorRun" },
        nombre: { input: "nombre", error: "errorNombre" },
        apellidos: { input: "apellidos", error: "errorApellidos" },
        correo: { input: "correo", error: "errorCorreo" },
        fechaNacimiento: { input: "fechaNacimiento", error: "errorFechaNacimiento" },
        tipoUsuario: { input: "tipoUsuario", error: "errorTipoUsuario" },
        region: { input: "region", error: "errorRegion" },
        comuna: { input: "comuna", error: "errorComuna" },
        direccion: { input: "direccion", error: "errorDireccion" }
    };
    return mapa[nombreCampo];
}

function mostrarResultadoValidacion(nombreCampo, esValido, mensaje) {
    const ids = idsPorCampo(nombreCampo);
    if (!ids) return;

    const input = document.getElementById(ids.input);
    const error = document.getElementById(ids.error);

    error.textContent = esValido ? "" : mensaje;
    input.classList.toggle("campo-invalido", !esValido);
}

/* -----------------------------------------
   Eventos: validar en tiempo real (input/blur)
------------------------------------------ */
const camposConValidacion = [
    "run", "nombre", "apellidos", "correo",
    "fechaNacimiento", "tipoUsuario", "region", "comuna", "direccion"
];

camposConValidacion.forEach((nombreCampo) => {
    const ids = idsPorCampo(nombreCampo);
    const elemento = document.getElementById(ids.input);
    elemento.addEventListener("input", () => validarCampo(nombreCampo));
    elemento.addEventListener("blur", () => validarCampo(nombreCampo));
});

/* -----------------------------------------
   Envío del formulario
------------------------------------------ */
formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultados = camposConValidacion.map((nombreCampo) => validarCampo(nombreCampo));
    const formularioValido = resultados.every((resultado) => resultado === true);

    if (!formularioValido) {
        const primerCampoInvalido = document.querySelector(".campo-invalido");
        if (primerCampoInvalido) primerCampoInvalido.focus();
        return;
    }

    const usuariosActuales = obtenerUsuarios();

    const runYaExiste = usuariosActuales.some(
        (usuario) => usuario.run.toUpperCase() === campoRun.value.trim().toUpperCase()
    );
    if (runYaExiste) {
        mostrarResultadoValidacion("run", false, "Ya existe un usuario registrado con este RUN.");
        campoRun.focus();
        return;
    }

    const nuevoUsuario = {
        run: campoRun.value.trim().toUpperCase(),
        nombre: campoNombre.value.trim(),
        apellidos: campoApellidos.value.trim(),
        correo: campoCorreo.value.trim(),
        fechaNacimiento: campoFechaNacimiento.value || null,
        tipo: campoTipoUsuario.value,
        region: campoRegion.value,
        comuna: campoComuna.value,
        direccion: campoDireccion.value.trim()
    };

    usuariosActuales.push(nuevoUsuario);
    guardarUsuarios(usuariosActuales);

    window.location.href = "usuarios.html?creado=1";
});

/* -----------------------------------------
   Inicialización
------------------------------------------ */
cargarRegiones();