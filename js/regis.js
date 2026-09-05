/* =========================================
   Página Registrarse · Validación en tiempo real
   y guardado en el storage compartido de usuarios.

   Depende de:
   - js/regiones.js       (mapa región -> comunas)
   - js/usuarios-datos.js (localStorage compartido con el admin)
========================================= */

const CORREOS_PERMITIDOS_REG = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];

const formularioRegistro = document.getElementById("registrarForm");
const rRun = document.getElementById("run");
const rNombre = document.getElementById("nombre");
const rApellidos = document.getElementById("apellidos");
const rCorreo = document.getElementById("correo");
const rPassword = document.getElementById("password");
const rConfirmPassword = document.getElementById("confirmPassword");
const rTipoUsuario = document.getElementById("tipoUsuario");
const rRegion = document.getElementById("region");
const rComuna = document.getElementById("comuna");
const rDireccion = document.getElementById("direccion");

/* -----------------------------------------
   Región / Comuna dependientes
------------------------------------------ */
function cargarRegionesRegistro() {
    Object.keys(regionesComunas).forEach((region) => {
        const opcion = document.createElement("option");
        opcion.value = region;
        opcion.textContent = region;
        rRegion.appendChild(opcion);
    });
}

function cargarComunasDeRegistro(region) {
    rComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';

    if (!region || !regionesComunas[region]) {
        rComuna.disabled = true;
        return;
    }

    regionesComunas[region].forEach((comuna) => {
        const opcion = document.createElement("option");
        opcion.value = comuna;
        opcion.textContent = comuna;
        rComuna.appendChild(opcion);
    });
    rComuna.disabled = false;
}

rRegion.addEventListener("change", () => {
    cargarComunasDeRegistro(rRegion.value);
    validarCampoRegistro("region");
});

/* -----------------------------------------
   Validación de RUN chileno (módulo 11)
------------------------------------------ */
function calcularDVRegistro(cuerpo) {
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

function esRunValidoRegistro(runOriginal) {
    const run = runOriginal.toUpperCase().trim();
    if (!/^[0-9]+[0-9K]$/.test(run)) return false;
    if (run.length < 7 || run.length > 9) return false;

    const cuerpo = run.slice(0, -1);
    const dv = run.slice(-1);
    return calcularDVRegistro(cuerpo) === dv;
}

/* -----------------------------------------
   Reglas de validación por campo
------------------------------------------ */
function validarCampoRegistro(nombreCampo) {
    let esValido = true;
    let mensaje = "";

    switch (nombreCampo) {
        case "run": {
            const valor = rRun.value.trim();
            if (!valor) {
                mensaje = "El RUN es obligatorio.";
                esValido = false;
            } else if (valor.length < 7 || valor.length > 9) {
                mensaje = "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.";
                esValido = false;
            } else if (!esRunValidoRegistro(valor)) {
                mensaje = "El RUN ingresado no es válido.";
                esValido = false;
            }
            break;
        }

        case "nombre": {
            const valor = rNombre.value.trim();
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
            const valor = rApellidos.value.trim();
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
            const valor = rCorreo.value.trim();
            const dominio = valor.includes("@") ? valor.split("@")[1] : "";
            if (!valor) {
                mensaje = "El correo es obligatorio.";
                esValido = false;
            } else if (valor.length > 100) {
                mensaje = "El correo no puede superar los 100 caracteres.";
                esValido = false;
            } else if (!CORREOS_PERMITIDOS_REG.includes(dominio.toLowerCase())) {
                mensaje = "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.";
                esValido = false;
            }
            break;
        }

        case "password": {
            const valor = rPassword.value;
            if (!valor) {
                mensaje = "La contraseña es obligatoria.";
                esValido = false;
            } else if (valor.length < 4 || valor.length > 10) {
                mensaje = "La contraseña debe tener entre 4 y 10 caracteres.";
                esValido = false;
            }
            break;
        }

        case "confirmPassword": {
            if (rConfirmPassword.value !== rPassword.value || !rConfirmPassword.value) {
                mensaje = "Las contraseñas no coinciden.";
                esValido = false;
            }
            break;
        }

        case "tipoUsuario": {
            if (!rTipoUsuario.value) {
                mensaje = "Selecciona con qué tipo de cuenta quieres registrarte.";
                esValido = false;
            }
            break;
        }

        case "region": {
            if (!rRegion.value) {
                mensaje = "Selecciona una región.";
                esValido = false;
            }
            break;
        }

        case "comuna": {
            if (!rComuna.value) {
                mensaje = "Selecciona una comuna.";
                esValido = false;
            }
            break;
        }

        case "direccion": {
            const valor = rDireccion.value.trim();
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

    mostrarResultadoRegistro(nombreCampo, esValido, mensaje);
    return esValido;
}

function idsCampoRegistro(nombreCampo) {
    const mapa = {
        run: { input: "run", error: "errorRun" },
        nombre: { input: "nombre", error: "errorNombre" },
        apellidos: { input: "apellidos", error: "errorApellidos" },
        correo: { input: "correo", error: "errorCorreo" },
        password: { input: "password", error: "errorPassword" },
        confirmPassword: { input: "confirmPassword", error: "errorConfirmPassword" },
        tipoUsuario: { input: "tipoUsuario", error: "errorTipoUsuario" },
        region: { input: "region", error: "errorRegion" },
        comuna: { input: "comuna", error: "errorComuna" },
        direccion: { input: "direccion", error: "errorDireccion" }
    };
    return mapa[nombreCampo];
}

function mostrarResultadoRegistro(nombreCampo, esValido, mensaje) {
    const ids = idsCampoRegistro(nombreCampo);
    if (!ids) return;

    const input = document.getElementById(ids.input);
    const error = document.getElementById(ids.error);

    error.textContent = esValido ? "" : mensaje;
    input.classList.toggle("campo-invalido", !esValido);
}

/* -----------------------------------------
   Eventos: validar en tiempo real
------------------------------------------ */
const camposRegistro = [
    "run", "nombre", "apellidos", "correo", "password", "confirmPassword",
    "tipoUsuario", "region", "comuna", "direccion"
];

camposRegistro.forEach((nombreCampo) => {
    const ids = idsCampoRegistro(nombreCampo);
    const elemento = document.getElementById(ids.input);
    elemento.addEventListener("input", () => validarCampoRegistro(nombreCampo));
    elemento.addEventListener("blur", () => validarCampoRegistro(nombreCampo));
});

/* -----------------------------------------
   Envío del formulario
------------------------------------------ */
formularioRegistro.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const resultados = camposRegistro.map((nombreCampo) => validarCampoRegistro(nombreCampo));
    const formularioValido = resultados.every((resultado) => resultado === true);

    if (!formularioValido) {
        const primerCampoInvalido = document.querySelector(".campo-invalido");
        if (primerCampoInvalido) primerCampoInvalido.focus();
        return;
    }

    const usuariosActuales = obtenerUsuarios();

    const runYaExiste = usuariosActuales.some(
        (usuario) => usuario.run.toUpperCase() === rRun.value.trim().toUpperCase()
    );
    if (runYaExiste) {
        mostrarResultadoRegistro("run", false, "Ya existe una cuenta registrada con este RUN.");
        rRun.focus();
        return;
    }

    const correoYaExiste = usuariosActuales.some(
        (usuario) => usuario.correo.toLowerCase() === rCorreo.value.trim().toLowerCase()
    );
    if (correoYaExiste) {
        mostrarResultadoRegistro("correo", false, "Ya existe una cuenta registrada con este correo.");
        rCorreo.focus();
        return;
    }

    const nuevoUsuario = {
        run: rRun.value.trim().toUpperCase(),
        nombre: rNombre.value.trim(),
        apellidos: rApellidos.value.trim(),
        correo: rCorreo.value.trim(),
        password: rPassword.value,
        tipo: rTipoUsuario.value,
        region: rRegion.value,
        comuna: rComuna.value,
        direccion: rDireccion.value.trim()
    };

    usuariosActuales.push(nuevoUsuario);
    guardarUsuarios(usuariosActuales);

    window.location.href = "login.html?registrado=1";
});

document.getElementById("volverLogin").addEventListener("click", () => {
    window.location.href = "login.html";
});

/* -----------------------------------------
   Inicialización
------------------------------------------ */
cargarRegionesRegistro();