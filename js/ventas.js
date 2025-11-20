// ============================================
// MÓDULO DE VENTAS
// ============================================

let carritoVenta = [];
let totalVenta = 0;

function inicializarVentas() {
    cargarVentas();
    actualizarTablaVentas();
    actualizarCarrito();
}

function mostrarVentas() {
    const medicamentos = obtenerMedicamentos();
    const tbody = document.getElementById('tabla-ventas');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (medicamentos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-database me-2"></i>No hay medicamentos disponibles
                </td>
            </tr>
        `;
        return;
    }

    // Filtrar solo medicamentos con stock disponible
    const medicamentosDisponibles = medicamentos.filter(m => m.stock > 0);

    if (medicamentosDisponibles.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-exclamation-triangle me-2"></i>No hay medicamentos con stock disponible
                </td>
            </tr>
        `;
        return;
    }

    medicamentosDisponibles.forEach(med => {
        const tr = document.createElement('tr');
        
        let stockBadge = '';
        if (med.stock > 100) {
            stockBadge = '<span class="badge bg-success">Alto</span>';
        } else if (med.stock > 50) {
            stockBadge = '<span class="badge bg-info">Medio</span>';
        } else if (med.stock > 20) {
            stockBadge = '<span class="badge bg-warning">Bajo</span>';
        } else {
            stockBadge = '<span class="badge bg-danger">Muy Bajo</span>';
        }

        const itemEnCarrito = carritoVenta.find(item => item.id === med.id);
        const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;

        tr.innerHTML = `
            <td>${med.id}</td>
            <td><strong>${med.nombre}</strong></td>
            <td><span class="badge bg-secondary">${med.categoria}</span></td>
            <td>${stockBadge} <small class="text-muted">(${med.stock} unidades)</small></td>
            <td><strong>Bs. ${med.precio.toFixed(2)}</strong></td>
            <td>
                <div class="d-flex align-items-center gap-2">
                    <button class="btn btn-sm btn-outline-secondary" onclick="decrementarCantidadVenta(${med.id})" ${cantidadEnCarrito === 0 ? 'disabled' : ''}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <input type="number" 
                           class="form-control form-control-sm text-center" 
                           id="cantidad-${med.id}" 
                           value="${cantidadEnCarrito}" 
                           min="0" 
                           max="${med.stock}" 
                           style="width: 70px;"
                           onchange="actualizarCantidadVenta(${med.id}, this.value)">
                    <button class="btn btn-sm btn-outline-primary" onclick="incrementarCantidadVenta(${med.id})" ${med.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function incrementarCantidadVenta(id) {
    const medicamentos = obtenerMedicamentos();
    const medicamento = medicamentos.find(m => m.id === id);
    
    if (!medicamento || medicamento.stock === 0) return;
    
    const itemEnCarrito = carritoVenta.find(item => item.id === id);
    
    if (itemEnCarrito) {
        if (itemEnCarrito.cantidad < medicamento.stock) {
            itemEnCarrito.cantidad++;
        } else {
            mostrarToast('No hay suficiente stock disponible', 'error');
            return;
        }
    } else {
        carritoVenta.push({
            id: medicamento.id,
            nombre: medicamento.nombre,
            precio: medicamento.precio,
            cantidad: 1,
            stockDisponible: medicamento.stock
        });
    }
    
    actualizarCarrito();
    actualizarInputCantidad(id);
    
    // Si estamos en el buscador, actualizar también
    if (typeof actualizarCarritoBuscador === 'function') {
        actualizarCarritoBuscador();
    }
    if (typeof mostrarBuscador === 'function') {
        mostrarBuscador();
    }
}

function decrementarCantidadVenta(id) {
    const itemEnCarrito = carritoVenta.find(item => item.id === id);
    
    if (itemEnCarrito) {
        itemEnCarrito.cantidad--;
        if (itemEnCarrito.cantidad <= 0) {
            carritoVenta = carritoVenta.filter(item => item.id !== id);
        }
    }
    
    actualizarCarrito();
    actualizarInputCantidad(id);
    
    // Si estamos en el buscador, actualizar también
    if (typeof actualizarCarritoBuscador === 'function') {
        actualizarCarritoBuscador();
    }
    if (typeof mostrarBuscador === 'function') {
        mostrarBuscador();
    }
}

function actualizarCantidadVenta(id, cantidad) {
    const cantidadNum = parseInt(cantidad) || 0;
    const medicamentos = obtenerMedicamentos();
    const medicamento = medicamentos.find(m => m.id === id);
    
    if (!medicamento) return;
    
    if (cantidadNum < 0) {
        mostrarToast('La cantidad no puede ser negativa', 'error');
        actualizarInputCantidad(id);
        return;
    }
    
    if (cantidadNum > medicamento.stock) {
        mostrarToast('No hay suficiente stock disponible', 'error');
        actualizarInputCantidad(id);
        return;
    }
    
    const itemEnCarrito = carritoVenta.find(item => item.id === id);
    
    if (cantidadNum === 0) {
        if (itemEnCarrito) {
            carritoVenta = carritoVenta.filter(item => item.id !== id);
        }
    } else {
        if (itemEnCarrito) {
            itemEnCarrito.cantidad = cantidadNum;
        } else {
            carritoVenta.push({
                id: medicamento.id,
                nombre: medicamento.nombre,
                precio: medicamento.precio,
                cantidad: cantidadNum,
                stockDisponible: medicamento.stock
            });
        }
    }
    
    actualizarCarrito();
    
    // Si estamos en el buscador, actualizar también
    if (typeof actualizarCarritoBuscador === 'function') {
        actualizarCarritoBuscador();
    }
    if (typeof mostrarBuscador === 'function') {
        mostrarBuscador();
    }
}

function actualizarInputCantidad(id) {
    const input = document.getElementById(`cantidad-${id}`);
    const inputBuscador = document.getElementById(`cantidad-buscador-${id}`);
    
    if (input) {
        const itemEnCarrito = carritoVenta.find(item => item.id === id);
        input.value = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    }
    
    if (inputBuscador) {
        const itemEnCarrito = carritoVenta.find(item => item.id === id);
        inputBuscador.value = itemEnCarrito ? itemEnCarrito.cantidad : 0;
    }
}

function actualizarCarrito() {
    const tbodyCarrito = document.getElementById('carrito-venta');
    const totalElement = document.getElementById('total-venta');
    
    if (!tbodyCarrito) return;
    
    tbodyCarrito.innerHTML = '';
    totalVenta = 0;
    
    if (carritoVenta.length === 0) {
        tbodyCarrito.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-3">
                    <i class="fas fa-shopping-cart me-2"></i>El carrito está vacío
                </td>
            </tr>
        `;
        if (totalElement) totalElement.textContent = 'Bs. 0.00';
        // Actualizar también el carrito del buscador
        if (typeof actualizarCarritoBuscador === 'function') {
            actualizarCarritoBuscador();
        }
        return;
    }
    
    carritoVenta.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        totalVenta += subtotal;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nombre}</td>
            <td class="text-center">${item.cantidad}</td>
            <td class="text-end">Bs. ${item.precio.toFixed(2)}</td>
            <td class="text-end"><strong>Bs. ${subtotal.toFixed(2)}</strong></td>
            <td class="text-center">
                <button class="btn btn-sm btn-danger" onclick="eliminarDelCarrito(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbodyCarrito.appendChild(tr);
    });
    
    if (totalElement) totalElement.textContent = `Bs. ${totalVenta.toFixed(2)}`;
    
    // Actualizar también el carrito del buscador
    if (typeof actualizarCarritoBuscador === 'function') {
        actualizarCarritoBuscador();
    }
}

function eliminarDelCarrito(id) {
    carritoVenta = carritoVenta.filter(item => item.id !== id);
    actualizarCarrito();
    actualizarInputCantidad(id);
    mostrarVentas();
    
    // Si estamos en el buscador, actualizar también
    if (typeof actualizarCarritoBuscador === 'function') {
        actualizarCarritoBuscador();
    }
    if (typeof mostrarBuscador === 'function') {
        mostrarBuscador();
    }
}

function procesarVenta() {
    if (carritoVenta.length === 0) {
        mostrarToast('El carrito está vacío', 'error');
        return;
    }
    
    const medicamentos = obtenerMedicamentos();
    let hayError = false;
    
    // Verificar stock antes de procesar
    carritoVenta.forEach(item => {
        const medicamento = medicamentos.find(m => m.id === item.id);
        if (!medicamento) {
            mostrarToast(`El medicamento ${item.nombre} ya no existe`, 'error');
            hayError = true;
            return;
        }
        if (medicamento.stock < item.cantidad) {
            mostrarToast(`No hay suficiente stock de ${item.nombre}. Stock disponible: ${medicamento.stock}`, 'error');
            hayError = true;
            return;
        }
    });
    
    if (hayError) {
        actualizarCarrito();
        mostrarVentas();
        return;
    }
    
    // Procesar la venta
    carritoVenta.forEach(item => {
        const medicamento = medicamentos.find(m => m.id === item.id);
        if (medicamento) {
            medicamento.stock -= item.cantidad;
        }
    });
    
    guardarMedicamentos(medicamentos);
    
    // Registrar la venta
    const venta = {
        id: obtenerSiguienteIdVenta(),
        fecha: new Date().toISOString(),
        items: [...carritoVenta],
        total: totalVenta,
        usuario: obtenerUsuarioActual()?.nombre || 'Desconocido'
    };
    
    guardarVenta(venta);
    
    mostrarToast(`Venta procesada correctamente. Total: Bs. ${totalVenta.toFixed(2)}`, 'success');
    
    // Limpiar carrito
    carritoVenta = [];
    actualizarCarrito();
    mostrarVentas();
    inicializarDashboard();
    
    // Actualizar buscador si está visible
    if (typeof actualizarCarritoBuscador === 'function') {
        actualizarCarritoBuscador();
    }
    if (typeof mostrarBuscador === 'function') {
        mostrarBuscador();
    }
}

function limpiarCarrito() {
    if (carritoVenta.length === 0) {
        mostrarToast('El carrito ya está vacío', 'info');
        return;
    }
    
    carritoVenta = [];
    actualizarCarrito();
    mostrarVentas();
    mostrarToast('Carrito limpiado', 'info');
    
    // Actualizar buscador si está visible
    if (typeof actualizarCarritoBuscador === 'function') {
        actualizarCarritoBuscador();
    }
    if (typeof mostrarBuscador === 'function') {
        mostrarBuscador();
    }
}

// Funciones para gestionar historial de ventas
function obtenerSiguienteIdVenta() {
    const ventas = obtenerVentas();
    if (ventas.length === 0) return 1;
    return Math.max(...ventas.map(v => v.id || 0)) + 1;
}

function obtenerVentas() {
    const datos = localStorage.getItem('ventas');
    return datos ? JSON.parse(datos) : [];
}

function guardarVenta(venta) {
    const ventas = obtenerVentas();
    ventas.push(venta);
    localStorage.setItem('ventas', JSON.stringify(ventas));
}

function cargarVentas() {
    // Esta función puede usarse para cargar el historial si se necesita
    const ventas = obtenerVentas();
    return ventas;
}

