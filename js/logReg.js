/*
// Manejo del formulario de login
//const loginForm = document.getElementById('loginForm');
//if (loginForm) {
//    loginForm.addEventListener('submit', function (event) {
//       event.preventDefault(); // Evita el envío del formulario

//          const username = document.getElementById('username').value;
//            const password = document.getElementById('password').value;

         // Obtener usuarios registrados desde localStorage
//          const users = JSON.parse(localStorage.getItem('users')) || [];

         // Verificar si las credenciales coinciden
//         const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            alert('Inicio de sesión exitoso');
            window.location.href = "index.html"; // Redirigir a la página principal
        } else {
            document.getElementById('loginError').textContent = "Usuario o contraseña incorrectos";
            document.getElementById('loginError').style.display = 'block';
        }
    });
}

// Manejo del formulario de registro
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            document.getElementById('registerError').textContent = "Las contraseñas no coinciden";
            document.getElementById('registerError').style.display = 'block';
        } else {
            // Guardar el usuario en localStorage
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // Verificar si el usuario ya existe
            if (users.some(u => u.username === username)) {
                document.getElementById('registerError').textContent = "El usuario ya está registrado";
                document.getElementById('registerError').style.display = 'block';
            } else {
                users.push({ username, email, password });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Registro exitoso');
                window.location.href = "login.html"; // Redirigir al login
            }
        }
    });
}

// Redirigir al registro desde el login
const registerButton = document.getElementById('registerButton');
if (registerButton) {
    registerButton.addEventListener('click', () => {
        window.location.href = "registrar.html";
    });
}
*/



/* =========================================
   Login (público)
   Valida contra el mismo storage de usuarios
   que usa el administrador (usuariosAdmin).

   Depende de js/usuarios-datos.js (debe cargarse antes).
========================================= */

// Manejo del formulario de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario

        const correo = document.getElementById('correo').value.trim().toLowerCase();
        const password = document.getElementById('password').value;

        const usuarios = obtenerUsuarios();

        const usuario = usuarios.find(
            (u) => u.correo.toLowerCase() === correo && u.password === password
        );

        if (usuario) {
            // Guarda la sesión activa (solo dura mientras la pestaña está abierta).
            sessionStorage.setItem('sesionActual', JSON.stringify({
                run: usuario.run,
                nombre: usuario.nombre,
                correo: usuario.correo,
                tipo: usuario.tipo
            }));

            if (usuario.tipo === 'Administrador') {
                window.location.href = "usuarios.html";
            } else {
                // Vendedor y Cliente van a la tienda pública.
                // (La vista reducida para Vendedor aún no está implementada).
                window.location.href = "index.html";
            }
        } else {
            document.getElementById('loginError').textContent = "Correo o contraseña incorrectos";
            document.getElementById('loginError').style.display = 'block';
        }
    });
}

// Muestra el aviso si venimos recién de registrarnos.
document.addEventListener('DOMContentLoaded', () => {
    const parametros = new URLSearchParams(window.location.search);
    if (parametros.get('registrado') === '1') {
        const aviso = document.getElementById('avisoRegistro');
        if (aviso) aviso.style.display = 'block';
    }
});

// Manejo del formulario de registro (si esta página lo tuviera embebido).
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();
        // El registro completo ahora vive en registrar.html / js/registrar.js,
        // siguiendo el modelo de Usuario del ERS (Run, Nombre, Correo, Tipo, etc.).
    });
}

// Redirigir al registro desde el login
const registerButton = document.getElementById('registerButton');
if (registerButton) {
    registerButton.addEventListener('click', () => {
        window.location.href = "registrar.html";
    });
}