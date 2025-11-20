// ============================================
// GESTIÓN DE MEDICAMENTOS (CRUD)
// ============================================

function mostrarGestion() {
    // Verificar permisos: solo admin puede gestionar medicamentos
    if (!esAdmin()) {
        mostrarToast('No tiene permisos para gestionar medicamentos', 'error');
        return;
    }
    
    const tbody = document.getElementById('tabla-gestion');
    if (!tbody) return;
    
    const medicamentos = obtenerMedicamentos();
    tbody.innerHTML = '';

    if (medicamentos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-database me-2"></i>No hay medicamentos registrados
                </td>
            </tr>
        `;
        return;
    }

    medicamentos.forEach(med => {
        const tr = document.createElement('tr');
        
        let stockBadge = '';
        if (med.stock > 100) {
            stockBadge = '<span class="badge bg-success badge-stock">Alto</span>';
        } else if (med.stock > 50) {
            stockBadge = '<span class="badge bg-info badge-stock">Medio</span>';
        } else {
            stockBadge = '<span class="badge bg-warning badge-stock">Bajo</span>';
        }

        tr.innerHTML = `
            <td>${med.id}</td>
            <td><strong>${med.nombre}</strong></td>
            <td><span class="badge bg-secondary">${med.categoria}</span></td>
            <td>${stockBadge} <small class="text-muted">(${med.stock} unidades)</small></td>
            <td><strong>Bs. ${med.precio.toFixed(2)}</strong></td>
            <td>
                <button class="btn btn-sm btn-info me-1" onclick="mostrarDetalles(${med.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning me-1" onclick="editarMedicamento(${med.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmarEliminar(${med.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function abrirModalCrear() {
    // Verificar permisos: solo admin puede crear medicamentos
    if (!esAdmin()) {
        mostrarToast('No tiene permisos para crear medicamentos', 'error');
        return;
    }
    
    document.getElementById('medicamento-id').value = '';
    document.getElementById('medicamento-id-input').value = obtenerSiguienteId();
    document.getElementById('modalMedicamentoLabel').innerHTML = '<i class="fas fa-plus me-2"></i>Nuevo Medicamento';
    document.getElementById('form-medicamento').reset();
    document.getElementById('form-errors').classList.add('d-none');
    
    const modal = new bootstrap.Modal(document.getElementById('modalMedicamento'));
    modal.show();
}

function editarMedicamento(id) {
    const medicamentos = obtenerMedicamentos();
    const medicamento = medicamentos.find(m => m.id === id);
    
    if (!medicamento) return;
    
    document.getElementById('medicamento-id').value = medicamento.id;
    document.getElementById('medicamento-id-input').value = medicamento.id;
    document.getElementById('medicamento-nombre').value = medicamento.nombre;
    document.getElementById('medicamento-categoria').value = medicamento.categoria;
    document.getElementById('medicamento-stock').value = medicamento.stock;
    document.getElementById('medicamento-precio').value = medicamento.precio;
    document.getElementById('medicamento-descripcion').value = medicamento.descripcion_tecnica;
    document.getElementById('medicamento-guia').value = medicamento.guia_paciente;
    document.getElementById('modalMedicamentoLabel').innerHTML = '<i class="fas fa-edit me-2"></i>Editar Medicamento';
    document.getElementById('form-errors').classList.add('d-none');
    
    const modal = new bootstrap.Modal(document.getElementById('modalMedicamento'));
    modal.show();
}

function editarDesdeDetalles() {
    const modalDetalles = bootstrap.Modal.getInstance(document.getElementById('modalDetalles'));
    if (modalDetalles) modalDetalles.hide();
    
    const btnEditar = document.getElementById('btn-editar-desde-detalles');
    const id = btnEditar.getAttribute('data-medicamento-id') || 
               document.getElementById('modalDetalles').getAttribute('data-medicamento-id');
    
    if (id) {
        editarMedicamento(parseInt(id));
    }
}

function confirmarEliminar(id) {
    const medicamentos = obtenerMedicamentos();
    const medicamento = medicamentos.find(m => m.id === id);
    
    if (!medicamento) return;
    
    document.getElementById('medicamento-eliminar-nombre').textContent = medicamento.nombre;
    
    const btnConfirmar = document.getElementById('btn-confirmar-eliminar');
    btnConfirmar.onclick = () => eliminarMedicamento(id);
    
    const modal = new bootstrap.Modal(document.getElementById('modalConfirmarEliminar'));
    modal.show();
}

function eliminarMedicamento(id) {
    const medicamentos = obtenerMedicamentos();
    const medicamentosFiltrados = medicamentos.filter(m => m.id !== id);
    guardarMedicamentos(medicamentosFiltrados);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalConfirmarEliminar'));
    if (modal) modal.hide();
    
    mostrarGestion();
    mostrarBuscador();
    inicializarDashboard(); // Actualizar dashboard después de eliminar
    mostrarToast('Medicamento eliminado correctamente', 'success');
}

function inicializarFormularioMedicamento() {
    const form = document.getElementById('form-medicamento');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const id = document.getElementById('medicamento-id').value;
        const medicamentos = obtenerMedicamentos();
        
        const medicamento = {
            id: id ? parseInt(id) : obtenerSiguienteId(),
            nombre: document.getElementById('medicamento-nombre').value.trim(),
            categoria: document.getElementById('medicamento-categoria').value,
            stock: parseInt(document.getElementById('medicamento-stock').value),
            precio: parseFloat(document.getElementById('medicamento-precio').value),
            descripcion_tecnica: document.getElementById('medicamento-descripcion').value.trim(),
            guia_paciente: document.getElementById('medicamento-guia').value.trim()
        };
        
        // Validaciones
        const errors = [];
        if (!medicamento.nombre) errors.push('El nombre es requerido');
        if (!medicamento.categoria) errors.push('La categoría es requerida');
        if (medicamento.stock < 0) errors.push('El stock no puede ser negativo');
        if (medicamento.precio < 0) errors.push('El precio no puede ser negativo');
        if (!medicamento.descripcion_tecnica) errors.push('La descripción técnica es requerida');
        if (!medicamento.guia_paciente) errors.push('La guía para el paciente es requerida');
        
        if (errors.length > 0) {
            const errorDiv = document.getElementById('form-errors');
            errorDiv.innerHTML = '<ul class="mb-0"><li>' + errors.join('</li><li>') + '</li></ul>';
            errorDiv.classList.remove('d-none');
            return;
        }
        
        // Verificar si hay una compra pendiente asociada
        const compraId = document.getElementById('medicamento-id').getAttribute('data-compra-id');
        
        // Guardar
        if (id) {
            const index = medicamentos.findIndex(m => m.id === parseInt(id));
            if (index !== -1) {
                medicamentos[index] = medicamento;
                guardarMedicamentos(medicamentos);
                mostrarToast('Medicamento actualizado correctamente', 'success');
            }
        } else {
            medicamentos.push(medicamento);
            guardarMedicamentos(medicamentos);
            mostrarToast('Medicamento creado correctamente', 'success');
        }
        
        // Si había una compra pendiente, marcarla como registrada
        if (compraId) {
            const comprasPendientes = JSON.parse(localStorage.getItem('comprasPendientes') || '[]');
            const compra = comprasPendientes.find(c => c.id === parseInt(compraId));
            if (compra) {
                compra.registrado = true;
                localStorage.setItem('comprasPendientes', JSON.stringify(comprasPendientes));
                if (typeof actualizarComprasPendientes === 'function') {
                    actualizarComprasPendientes();
                }
            }
        }
        
        // Limpiar el atributo temporal
        document.getElementById('medicamento-id').removeAttribute('data-compra-id');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalMedicamento'));
        if (modal) modal.hide();
        
        mostrarGestion();
        mostrarBuscador();
        inicializarDashboard(); // Actualizar dashboard después de crear/editar
    });
}

function mostrarDetalles(id) {
    const medicamentos = obtenerMedicamentos();
    const medicamento = medicamentos.find(m => m.id === id);
    if (!medicamento) return;

    const datosTecnicos = document.getElementById('datos-tecnicos');
    datosTecnicos.innerHTML = `
        <p><strong>ID:</strong> ${medicamento.id}</p>
        <p><strong>Nombre:</strong> ${medicamento.nombre}</p>
        <p><strong>Categoría:</strong> <span class="badge bg-secondary">${medicamento.categoria}</span></p>
        <p><strong>Stock:</strong> ${medicamento.stock} unidades</p>
        <p><strong>Precio:</strong> Bs. ${medicamento.precio.toFixed(2)}</p>
        <hr>
        <p><strong>Descripción Técnica:</strong></p>
        <p class="text-muted small">${medicamento.descripcion_tecnica}</p>
    `;

    const guiaPaciente = document.getElementById('guia-paciente');
    guiaPaciente.innerHTML = `
        <div class="alert alert-success mb-3">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Información para explicar al paciente:</strong>
        </div>
        <p class="mb-3">${medicamento.guia_paciente}</p>
        <div class="mt-3">
            <small class="text-muted">
                <i class="fas fa-lightbulb me-1"></i>
                <strong>Consejo:</strong> Explique claramente cómo y cuándo tomar el medicamento, y qué efectos secundarios puede esperar.
            </small>
        </div>
    `;

    document.getElementById('modalDetallesLabel').innerHTML = `
        <i class="fas fa-pills me-2"></i>${medicamento.nombre}
    `;
    
    const modalElement = document.getElementById('modalDetalles');
    modalElement.setAttribute('data-medicamento-id', medicamento.id);
    
    const btnEditar = document.getElementById('btn-editar-desde-detalles');
    if (esAdmin()) {
        btnEditar.style.display = 'inline-block';
        btnEditar.setAttribute('data-medicamento-id', medicamento.id);
    } else {
        btnEditar.style.display = 'none';
    }

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

