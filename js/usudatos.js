/* =========================================
   Datos compartidos · Usuarios
   Usado por usuarios.html y nuevo-usuario.html
========================================= */
 
const CLAVE_STORAGE_USUARIOS = "usuariosAdmin";

// Usuarios de ejemplo. Cumplen los campos definidos en el ERS:
// run, nombre, apellidos, correo, region, comuna, direccion, tipo.
const usuariosPorDefecto = [    
    { run: "191122334", nombre: "Fernanda", apellidos: "Rojas Muñoz", correo: "frojas@gmail.com", region: "Región Metropolitana de Santiago", comuna: "Santiago", direccion: "Av. Libertador 1234", tipo: "Administrador" },
    { run: "182233445", nombre: "Ignacio", apellidos: "Pérez Soto", correo: "ipere@duoc.cl", region: "Región de la Araucanía", comuna: "Temuco", direccion: "Calle Los Aromos 456", tipo: "Vendedor" },
    { run: "203344556", nombre: "Camila", apellidos: "Fuentes León", correo: "cfuentes@profesor.duoc.cl", region: "Región de Ñuble", comuna: "Chillán", direccion: "Pasaje Las Rosas 78", tipo: "Vendedor" },
    { run: "175566778", nombre: "Matías", apellidos: "González Díaz", correo: "mgonzalez@gmail.com", region: "Región Metropolitana de Santiago", comuna: "Providencia", direccion: "Av. Pedro de Valdivia 890", tipo: "Cliente" },
    { run: "196677889", nombre: "Valentina", apellidos: "Silva Torres", correo: "vsilva@gmail.com", region: "Región de la Araucanía", comuna: "Villarrica", direccion: "Camino Internacional 12", tipo: "Cliente" },
    { run: "168899001", nombre: "Diego", apellidos: "Muñoz Castro", correo: "dmunoz@duoc.cl", region: "Región de Ñuble", comuna: "San Carlos", direccion: "Calle O'Higgins 345", tipo: "Cliente" },
    { run: "210011223", nombre: "Antonia", apellidos: "Herrera Vidal", correo: "aherrera@gmail.com", region: "Región Metropolitana de Santiago", comuna: "Maipú", direccion: "Av. Pajaritos 567", tipo: "Cliente" }
];

// Carga los usuarios desde localStorage; si es la primera vez, usa los de ejemplo.
function obtenerUsuarios() {
    const guardados = localStorage.getItem(CLAVE_STORAGE_USUARIOS);
    if (guardados) {
        return JSON.parse(guardados);
    }
    localStorage.setItem(CLAVE_STORAGE_USUARIOS, JSON.stringify(usuariosPorDefecto));
    return usuariosPorDefecto;
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(CLAVE_STORAGE_USUARIOS, JSON.stringify(usuarios));
}