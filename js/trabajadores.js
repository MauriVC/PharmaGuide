// ============================================
// GESTIÓN DE TRABAJADORES (Solo Admin)
// ============================================

function mostrarTrabajadores() {
    // Verificar permisos: solo admin puede gestionar trabajadores
    if (!esAdmin()) {
        mostrarToast('No tiene permisos para gestionar trabajadores', 'error');
        return;
    }
    
    const tbody = document.getElementById('tabla-trabajadores');
    if (!tbody) return;
    
    const usuarios = obtenerUsuarios();
    // Filtrar solo trabajadores y clientes (no mostrar admin)
    const trabajadores = usuarios.filter(u => u.rol !== 'admin');
    tbody.innerHTML = '';

    if (trabajadores.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-users me-2"></i>No hay trabajadores registrados
                </td>
            </tr>
        `;
        return;
    }

    trabajadores.forEach(usuario => {
        const tr = document.createElement('tr');
        
        let rolBadge = '';
        if (usuario.rol === 'trabajador') {
            rolBadge = '<span class="badge bg-info">Trabajador</span>';
        } else if (usuario.rol === 'cliente') {
            rolBadge = '<span class="badge bg-success">Cliente</span>';
        } else {
            rolBadge = '<span class="badge bg-secondary">' + usuario.rol + '</span>';
        }

        tr.innerHTML = `
            <td>${usuario.id || '-'}</td>
            <td><strong>${usuario.username}</strong></td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email || '-'}</td>
            <td>${rolBadge}</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarTrabajador(${usuario.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmarEliminarTrabajador(${usuario.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalCrearTrabajador() {
    // Verificar permisos: solo admin puede crear trabajadores
    if (!esAdmin()) {
        mostrarToast('No tiene permisos para crear trabajadores', 'error');
        return;
    }
    
    document.getElementById('trabajador-id').value = '';
    document.getElementById('modalTrabajadorLabel').innerHTML = '<i class="fas fa-user-plus me-2"></i>Nuevo Trabajador';
    document.getElementById('form-trabajador').reset();
    document.getElementById('form-errors-trabajador').classList.add('d-none');
    
    const modal = new bootstrap.Modal(document.getElementById('modalTrabajador'));
    modal.show();
}

function editarTrabajador(id) {
    // Verificar permisos: solo admin puede editar trabajadores
    if (!esAdmin()) {
        mostrarToast('No tiene permisos para editar trabajadores', 'error');
        return;
    }
    
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario || usuario.rol === 'admin') return;
    
    document.getElementById('trabajador-id').value = usuario.id;
    document.getElementById('trabajador-username').value = usuario.username;
    document.getElementById('trabajador-email').value = usuario.email || '';
    document.getElementById('trabajador-nombre').value = usuario.nombre;
    document.getElementById('trabajador-password').value = ''; // No mostrar contraseña
    document.getElementById('trabajador-rol').value = usuario.rol;
    document.getElementById('modalTrabajadorLabel').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Trabajador';
    document.getElementById('form-errors-trabajador').classList.add('d-none');
    
    const modal = new bootstrap.Modal(document.getElementById('modalTrabajador'));
    modal.show();
}

function confirmarEliminarTrabajador(id) {
    // Verificar permisos: solo admin puede eliminar trabajadores
    if (!esAdmin()) {
        mostrarToast('No tiene permisos para eliminar trabajadores', 'error');
        return;
    }
    
    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(u => u.id === id);
    
    if (!usuario || usuario.rol === 'admin') return;
    
    document.getElementById('trabajador-eliminar-nombre').textContent = usuario.nombre;
    
    const btnConfirmar = document.getElementById('btn-confirmar-eliminar-trabajador');
    btnConfirmar.onclick = () => eliminarTrabajador(id);
    
    const modal = new bootstrap.Modal(document.getElementById('modalConfirmarEliminarTrabajador'));
    modal.show();
}

function eliminarTrabajador(id) {
    const usuarios = obtenerUsuarios();
    const usuariosFiltrados = usuarios.filter(u => u.id !== id);
    guardarUsuarios(usuariosFiltrados);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalConfirmarEliminarTrabajador'));
    if (modal) modal.hide();
    
    mostrarTrabajadores();
    mostrarToast('Trabajador eliminado correctamente', 'success');
}

function inicializarFormularioTrabajador() {
    const form = document.getElementById('form-trabajador');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('trabajador-id').value;
        const usuarios = obtenerUsuarios();
        
        const username = document.getElementById('trabajador-username').value.trim();
        const email = document.getElementById('trabajador-email').value.trim();
        const nombre = document.getElementById('trabajador-nombre').value.trim();
        const password = document.getElementById('trabajador-password').value;
        const rol = document.getElementById('trabajador-rol').value;
        
        // Validaciones
        const errors = [];
        if (!username) errors.push('El usuario es requerido');
        if (!email) errors.push('El email es requerido');
        if (!email.includes('@gmail.com') && !email.includes('@')) {
            errors.push('El email debe ser válido (preferiblemente Gmail)');
        }
        if (!nombre) errors.push('El nombre es requerido');
        if (!password || password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }
        if (!rol) errors.push('El rol es requerido');
        if (rol === 'admin') {
            errors.push('No se pueden crear administradores desde aquí');
        }
        
        // Verificar que el username no esté duplicado
        const usuarioExistente = usuarios.find(u => u.username === username && u.id !== parseInt(id || 0));
        if (usuarioExistente) {
            errors.push('El nombre de usuario ya existe');
        }
        
        // Verificar que el email no esté duplicado
        const emailExistente = usuarios.find(u => u.email === email && u.id !== parseInt(id || 0));
        if (emailExistente) {
            errors.push('El email ya está registrado');
        }
        
        if (errors.length > 0) {
            const errorDiv = document.getElementById('form-errors-trabajador');
            errorDiv.innerHTML = '<ul class="mb-0"><li>' + errors.join('</li><li>') + '</li></ul>';
            errorDiv.classList.remove('d-none');
            return;
        }
        
        // Guardar
        if (id) {
            // Editar
            const index = usuarios.findIndex(u => u.id === parseInt(id));
            if (index !== -1) {
                usuarios[index] = {
                    ...usuarios[index],
                    username: username,
                    email: email,
                    nombre: nombre,
                    password: password || usuarios[index].password, // Mantener contraseña si no se cambia
                    rol: rol
                };
                guardarUsuarios(usuarios);
                mostrarToast('Trabajador actualizado correctamente', 'success');
            }
        } else {
            // Crear
            const nuevoUsuario = {
                id: obtenerSiguienteIdUsuario(),
                username: username,
                email: email,
                nombre: nombre,
                password: password,
                rol: rol
            };
            usuarios.push(nuevoUsuario);
            guardarUsuarios(usuarios);
            mostrarToast('Trabajador creado correctamente', 'success');
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalTrabajador'));
        if (modal) modal.hide();
        
        mostrarTrabajadores();
    });
}

