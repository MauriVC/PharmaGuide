// ============================================
// GESTIÓN DE AUTENTICACIÓN
// ============================================

function esAdmin() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.rol === 'admin';
}

function esCliente() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.rol === 'cliente';
}

function esTrabajador() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.rol === 'trabajador';
}

function cerrarSesion() {
    cerrarSesionStorage();
    mostrarLogin();
    mostrarToast('Sesión cerrada correctamente', 'info');
}

function inicializarLogin() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');
        
        const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
        const usuario = usuarios.find(u => u.username === username && u.password === password);
        
        if (usuario) {
            establecerUsuarioActual(usuario);
            mostrarAplicacion();
            inicializarAplicacion();
        } else {
            errorDiv.textContent = 'Usuario o contraseña incorrectos';
            errorDiv.classList.remove('d-none');
        }
    });
}

