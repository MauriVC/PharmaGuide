// ============================================
// GESTIÓN DE ALMACENAMIENTO (LocalStorage)
// ============================================

let medicamentosIniciales = [];

// Cargar medicamentos desde JSON
async function cargarMedicamentosDesdeJSON() {
    try {
        const response = await fetch('data/medicamentos.json');
        if (response.ok) {
            const datos = await response.json();
            return datos;
        } else {
            console.error('Error al cargar medicamentos.json:', response.status);
            return [];
        }
    } catch (error) {
        console.error('Error al cargar medicamentos.json:', error);
        return [];
    }
}

async function inicializarDatos() {
    // Inicializar usuarios
    if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
    
    // Cargar medicamentos desde JSON solo si no hay datos en localStorage
    if (!localStorage.getItem('medicamentos')) {
        medicamentosIniciales = await cargarMedicamentosDesdeJSON();
        if (medicamentosIniciales.length > 0) {
            localStorage.setItem('medicamentos', JSON.stringify(medicamentosIniciales));
        }
    }
}

function obtenerMedicamentos() {
    const datos = localStorage.getItem('medicamentos');
    return datos ? JSON.parse(datos) : [];
}

function guardarMedicamentos(medicamentos) {
    localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
}

function obtenerSiguienteId() {
    const medicamentos = obtenerMedicamentos();
    if (medicamentos.length === 0) return 1;
    return Math.max(...medicamentos.map(m => m.id)) + 1;
}

function obtenerUsuarios() {
    const datos = localStorage.getItem('usuarios');
    return datos ? JSON.parse(datos) : [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
}

function obtenerSiguienteIdUsuario() {
    const usuarios = obtenerUsuarios();
    if (usuarios.length === 0) return 1;
    return Math.max(...usuarios.map(u => u.id || 0)) + 1;
}

function obtenerUsuarioActual() {
    const usuario = localStorage.getItem('usuarioActual');
    return usuario ? JSON.parse(usuario) : null;
}

function establecerUsuarioActual(usuario) {
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
}

function cerrarSesionStorage() {
    localStorage.removeItem('usuarioActual');
}

