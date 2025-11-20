// ============================================
// MÓDULO DE COMPRAS
// ============================================

let comprasPendientes = [];
let medicamentosComprados = [];

function inicializarCompras() {
    cargarComprasPendientes();
    mostrarCompras();
}

function mostrarCompras() {
    // Mostrar la interfaz de compras
    mostrarFormularioCompra();
}

function mostrarFormularioCompra() {
    const seccionCompra = document.getElementById('seccion-compra');
    const seccionRegistro = document.getElementById('seccion-registro-medicamentos');
    
    if (seccionCompra) seccionCompra.style.display = 'block';
    if (seccionRegistro) seccionRegistro.style.display = 'none';
    
    actualizarComprasPendientes();
}

function agregarCompraPendiente() {
    const nombre = document.getElementById('compra-nombre').value.trim();
    const cantidad = parseInt(document.getElementById('compra-cantidad').value) || 0;
    const precioCompra = parseFloat(document.getElementById('compra-precio-compra').value) || 0;
    const precioVenta = parseFloat(document.getElementById('compra-precio-venta').value) || 0;
    const categoria = document.getElementById('compra-categoria').value;
    
    // Validaciones
    if (!nombre) {
        mostrarToast('El nombre del medicamento es requerido', 'error');
        return;
    }
    
    if (cantidad <= 0) {
        mostrarToast('La cantidad debe ser mayor a 0', 'error');
        return;
    }
    
    if (precioCompra <= 0) {
        mostrarToast('El precio de compra debe ser mayor a 0', 'error');
        return;
    }
    
    if (precioVenta <= 0) {
        mostrarToast('El precio de venta debe ser mayor a 0', 'error');
        return;
    }
    
    if (!categoria) {
        mostrarToast('La categoría es requerida', 'error');
        return;
    }
    
    // Agregar a compras pendientes
    const compra = {
        id: obtenerSiguienteIdCompraPendiente(),
        nombre: nombre,
        cantidad: cantidad,
        precioCompra: precioCompra,
        precioVenta: precioVenta,
        categoria: categoria,
        fecha: new Date().toISOString(),
        registrado: false
    };
    
    comprasPendientes.push(compra);
    guardarComprasPendientes();
    
    // Limpiar formulario
    document.getElementById('form-compra').reset();
    
    mostrarToast('Medicamento agregado a la lista de compras', 'success');
    actualizarComprasPendientes();
}

function actualizarComprasPendientes() {
    const tbody = document.getElementById('tabla-compras-pendientes');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const comprasNoRegistradas = comprasPendientes.filter(c => !c.registrado);
    
    if (comprasNoRegistradas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-shopping-cart me-2"></i>No hay compras pendientes de registro
                </td>
            </tr>
        `;
        return;
    }
    
    comprasNoRegistradas.forEach(compra => {
        const tr = document.createElement('tr');
        const total = compra.cantidad * compra.precioCompra;
        
        tr.innerHTML = `
            <td>${compra.nombre}</td>
            <td><span class="badge bg-secondary">${compra.categoria}</span></td>
            <td class="text-center">${compra.cantidad}</td>
            <td class="text-end">Bs. ${compra.precioCompra.toFixed(2)}</td>
            <td class="text-end">Bs. ${compra.precioVenta.toFixed(2)}</td>
            <td class="text-end"><strong>Bs. ${total.toFixed(2)}</strong></td>
            <td class="text-center">
                <button class="btn btn-sm btn-success" onclick="registrarMedicamentoComprado(${compra.id})">
                    <i class="fas fa-check me-1"></i>Registrar
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarCompraPendiente(${compra.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function eliminarCompraPendiente(id) {
    comprasPendientes = comprasPendientes.filter(c => c.id !== id);
    guardarComprasPendientes();
    actualizarComprasPendientes();
    mostrarToast('Compra eliminada', 'info');
}

function registrarMedicamentoComprado(id) {
    const compra = comprasPendientes.find(c => c.id === id);
    if (!compra) return;
    
    // Verificar si el medicamento ya existe
    const medicamentos = obtenerMedicamentos();
    const medicamentoExistente = medicamentos.find(m => 
        m.nombre.toLowerCase() === compra.nombre.toLowerCase()
    );
    
    if (medicamentoExistente) {
        // Si existe, solo aumentar el stock
        medicamentoExistente.stock += compra.cantidad;
        // Actualizar precio si es diferente
        if (compra.precioVenta !== medicamentoExistente.precio) {
            medicamentoExistente.precio = compra.precioVenta;
        }
        guardarMedicamentos(medicamentos);
        mostrarToast(`Stock actualizado para ${compra.nombre}. Se agregaron ${compra.cantidad} unidades`, 'success');
    } else {
        // Si no existe, abrir modal para completar información
        abrirModalRegistroCompra(compra);
        return;
    }
    
    // Marcar como registrado
    compra.registrado = true;
    guardarComprasPendientes();
    actualizarComprasPendientes();
    inicializarDashboard();
}

function abrirModalRegistroCompra(compra) {
    // Llenar el formulario con los datos de la compra
    document.getElementById('medicamento-id').value = '';
    document.getElementById('medicamento-id-input').value = obtenerSiguienteId();
    document.getElementById('medicamento-nombre').value = compra.nombre;
    document.getElementById('medicamento-categoria').value = compra.categoria;
    document.getElementById('medicamento-stock').value = compra.cantidad;
    document.getElementById('medicamento-precio').value = compra.precioVenta;
    document.getElementById('medicamento-descripcion').value = '';
    document.getElementById('medicamento-guia').value = '';
    
    document.getElementById('modalMedicamentoLabel').innerHTML = '<i class="fas fa-plus me-2"></i>Registrar Medicamento Comprado';
    document.getElementById('form-errors').classList.add('d-none');
    
    // Guardar el ID de la compra en un campo oculto temporal
    document.getElementById('medicamento-id').setAttribute('data-compra-id', compra.id);
    
    const modal = new bootstrap.Modal(document.getElementById('modalMedicamento'));
    modal.show();
    
    // Modificar el submit del formulario para marcar la compra como registrada
    const form = document.getElementById('form-medicamento');
    const originalSubmit = form.onsubmit;
    
    form.onsubmit = function(e) {
        e.preventDefault();
        
        const compraId = parseInt(document.getElementById('medicamento-id').getAttribute('data-compra-id'));
        const compraPendiente = comprasPendientes.find(c => c.id === compraId);
        
        if (compraPendiente) {
            // El formulario ya guarda el medicamento, solo marcamos la compra como registrada
            compraPendiente.registrado = true;
            guardarComprasPendientes();
            actualizarComprasPendientes();
            
            // Restaurar el submit original
            form.onsubmit = originalSubmit;
        }
        
        // Llamar al submit original del formulario
        if (originalSubmit) {
            originalSubmit.call(this, e);
        } else {
            // Si no hay submit original, usar el comportamiento por defecto
            const formEvent = new Event('submit', { bubbles: true, cancelable: true });
            this.dispatchEvent(formEvent);
        }
    };
}

// Funciones para gestionar compras pendientes en LocalStorage
function obtenerSiguienteIdCompraPendiente() {
    if (comprasPendientes.length === 0) return 1;
    return Math.max(...comprasPendientes.map(c => c.id || 0)) + 1;
}

function guardarComprasPendientes() {
    localStorage.setItem('comprasPendientes', JSON.stringify(comprasPendientes));
}

function cargarComprasPendientes() {
    const datos = localStorage.getItem('comprasPendientes');
    comprasPendientes = datos ? JSON.parse(datos) : [];
}

function obtenerCompras() {
    const datos = localStorage.getItem('compras');
    return datos ? JSON.parse(datos) : [];
}

function guardarCompra(compra) {
    const compras = obtenerCompras();
    compras.push(compra);
    localStorage.setItem('compras', JSON.stringify(compras));
}
