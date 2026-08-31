// Seleccionar el menú de encabezado para efectos de desplazamiento
const headerMenu = document.querySelector('.hm-header');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 80) {
        headerMenu.classList.add('header-fixed');
    } else {
        headerMenu.classList.remove('header-fixed');
    }
});

/*=========================================
    Tabs
==========================================*/
if (document.querySelector('.hm-tabs')) {
    const tabLinks = document.querySelectorAll('.hm-tab-link');
    const tabsContent = document.querySelectorAll('.tabs-content');

    tabLinks[0].classList.add('active');
    if (tabsContent.length > 0) {
        tabsContent[0].classList.add('tab-active');
    }

    tabLinks.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            tabLinks.forEach(link => link.classList.remove('active'));
            tab.classList.add('active');
            tabsContent.forEach(content => content.classList.remove('tab-active'));
            tabsContent[index].classList.add('tab-active');
        });
    });
}

/*=========================================
    MENU Móvil
==========================================*/
const menu = document.querySelector('.icon-menu');
const menuClose = document.querySelector('.cerrar-menu');

menu.addEventListener('click', () => {
    document.querySelector('.header-menu-movil').classList.add('active');
});

menuClose.addEventListener('click', () => {
    document.querySelector('.header-menu-movil').classList.remove('active');
});

/*=========================================
    Carrito de Compras
==========================================*/

// Array para almacenar los productos en el carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Seleccionar todos los botones "AGREGAR AL CARRITO"
const botonesAgregar = document.querySelectorAll('.hm-btn.btn-primary');

// Seleccionar el ícono del carrito y el contador
const contadorCarrito = document.getElementById('contadorCarrito') || document.querySelector('.hm-icon-cart span');

// Función para actualizar el contador de productos en el carrito y almacenarlo en localStorage
function actualizarContadorCarrito() {
    contadorCarrito.textContent = carrito.length;
    localStorage.setItem('contadorCarrito', carrito.length);
}

// Función para agregar un producto al carrito
function agregarAlCarrito(event) {
    event.preventDefault(); 
    const producto = {
        nombre: event.target.parentElement.querySelector('h3').textContent,
        precio: event.target.parentElement.querySelector('.precio span').textContent,
        imagen: event.target.parentElement.parentElement.querySelector('img').src  // Obtiene la URL de la imagen
    };
    carrito.push(producto); 
    localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar en localStorage
    actualizarContadorCarrito(); 
    console.log(carrito);
}


// Agregar el evento a cada botón "AGREGAR AL CARRITO"
botonesAgregar.forEach(boton => {
    boton.addEventListener('click', agregarAlCarrito);
});

// Inicializar el contador de productos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
});
