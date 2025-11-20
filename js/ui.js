// ============================================
// GESTIÓN DE INTERFAZ DE USUARIO
// ============================================

function mostrarLogin() {
    document.getElementById('login-screen').classList.remove('d-none');
    document.getElementById('main-app').classList.add('d-none');
    document.getElementById('login-form').reset();
    document.getElementById('login-error').classList.add('d-none');
}

function mostrarAplicacion() {
    document.getElementById('login-screen').classList.add('d-none');
    document.getElementById('main-app').classList.remove('d-none');
    
    const usuario = obtenerUsuarioActual();
    if (usuario) {
        actualizarInterfazUsuario(usuario);
        aplicarPermisos();
    }
}

function actualizarInterfazUsuario(usuario) {
    let rolTexto = '';
    let rolBadge = '';
    
    switch(usuario.rol) {
        case 'admin':
            rolTexto = 'Administrador';
            rolBadge = 'bg-danger';
            break;
        case 'trabajador':
            rolTexto = 'Trabajador';
            rolBadge = 'bg-info';
            break;
        case 'cliente':
            rolTexto = 'Cliente';
            rolBadge = 'bg-success';
            break;
        default:
            rolTexto = 'Usuario';
            rolBadge = 'bg-secondary';
    }
    
    document.getElementById('user-welcome').textContent = `Bienvenido, ${usuario.nombre}`;
    document.getElementById('user-role-badge').innerHTML = `<span class="badge ${rolBadge}">${rolTexto}</span>`;
    document.getElementById('user-info-sidebar').textContent = `${usuario.nombre} (${rolTexto})`;
    document.getElementById('config-usuario').textContent = usuario.nombre;
    document.getElementById('config-rol').innerHTML = `<span class="badge ${rolBadge}">${rolTexto}</span>`;
    
    actualizarContadorMedicamentos();
}

function aplicarPermisos() {
    const esAdminUser = esAdmin();
    const body = document.body;
    
    if (esAdminUser) {
        body.classList.add('user-admin');
    } else {
        body.classList.remove('user-admin');
    }
}

function actualizarContadorMedicamentos() {
    const medicamentos = obtenerMedicamentos();
    document.getElementById('medicamentos-count').textContent = `${medicamentos.length} medicamentos`;
}

function mostrarToast(mensaje, tipo = 'info') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
    
    const bgColor = tipo === 'success' ? 'bg-success' : tipo === 'error' ? 'bg-danger' : 'bg-info';
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white ${bgColor} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
    });
}

