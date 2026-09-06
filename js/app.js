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


document.addEventListener('click', function(event) {

    const boton = event.target.closest('.product-item .hm-btn.btn-primary');

    if (!boton) {
        return;
    }

    event.preventDefault();

    const tarjeta = boton.closest('.product-item');

    const producto = {
        nombre: tarjeta.querySelector('h3').textContent,
        precio: tarjeta.querySelector('.precio span').textContent,
        imagen: tarjeta.querySelector('img').src
    };

    carrito.push(producto);

    localStorage.setItem('carrito', JSON.stringify(carrito));

    actualizarContadorCarrito();

    console.log(carrito);
});

document.addEventListener('DOMContentLoaded', () => {
    actualizarContadorCarrito();
    cargarProductos(); // <-- ¡Aquí está la magia!
});



function crearProductoHTML(producto) {

    const etiqueta = producto.etiqueta
        ? `<span class="stin ${producto.etiqueta === 'Oferta' ? 'stin-oferta' : 'stin-new'}">
                ${producto.etiqueta}
           </span>`
        : "";

    const precioAnterior = producto.precioAnterior !== undefined
        ? `<span class="thash">S/ ${producto.precioAnterior.toFixed(2)}</span>`
        : "";

    return `
        <div class="product-item">

            <div class="p-portada">
                <a href="#">
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                </a>

                ${etiqueta}
            </div>

            <div class="p-info">

                <a href="#">
                    <h3>${producto.nombre}</h3>
                </a>

                <div class="precio">
                    <span>S/ ${producto.precio.toFixed(2)}</span>
                    ${precioAnterior}
                </div>

                <a href="#" class="hm-btn btn-primary uppercase">
                    AGREGAR AL CARRITO
                </a>

            </div>

        </div>
    `;
}

function cargarProductos() {
    const grids = document.querySelectorAll('.grid-product[data-categoria]');

    grids.forEach(grid => {
        const categoria = grid.dataset.categoria;

        let productosFiltrados = [];

        // Si la categoría es "Todos", pasamos el array completo sin filtrar
        if (categoria === 'Todos') {
            productosFiltrados = productos;
        } else {
            // Si es otra categoría, filtramos como lo hacías antes en el index
            productosFiltrados = productos.filter(
                producto => producto.categoria === categoria
            );
        }

        grid.innerHTML = productosFiltrados
            .map(producto => crearProductoHTML(producto))
            .join('');
    });
}