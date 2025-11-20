// ============================================
// BUSCADOR
// ============================================

let medicamentosFiltrados = [];

function inicializarBuscador() {
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('keyup', function() {
            const termino = this.value.toLowerCase().trim();
            filtrarMedicamentos(termino);
        });
    }
}

function filtrarMedicamentos(termino) {
    const medicamentos = obtenerMedicamentos();
    if (termino === '') {
        medicamentosFiltrados = [...medicamentos];
    } else {
        medicamentosFiltrados = medicamentos.filter(med => 
            med.nombre.toLowerCase().includes(termino)
        );
    }
    mostrarBuscador();
}

function mostrarBuscador() {
    const tbody = document.getElementById('tabla-resultados');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    if (medicamentosFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted py-4">
                    <i class="fas fa-search me-2"></i>No se encontraron medicamentos
                </td>
            </tr>
        `;
        actualizarCarritoBuscador();
        return;
    }

    medicamentosFiltrados.forEach(med => {
        const tr = document.createElement('tr');
        
        let stockBadge = '';
        if (med.stock > 100) {
            stockBadge = '<span class="badge bg-success badge-stock">Alto</span>';
        } else if (med.stock > 50) {
            stockBadge = '<span class="badge bg-info badge-stock">Medio</span>';
        } else {
            stockBadge = '<span class="badge bg-warning badge-stock">Bajo</span>';
        }

        const itemEnCarrito = carritoVenta.find(item => item.id === med.id);
        const cantidadEnCarrito = itemEnCarrito ? itemEnCarrito.cantidad : 0;
        const puedeVender = med.stock > 0;

        tr.innerHTML = `
            <td>${med.id}</td>
            <td><strong>${med.nombre}</strong></td>
            <td><span class="badge bg-secondary">${med.categoria}</span></td>
            <td>${stockBadge} <small class="text-muted">(${med.stock} unidades)</small></td>
            <td><strong>Bs. ${med.precio.toFixed(2)}</strong></td>
            <td>
                <div class="d-flex gap-2 align-items-center">
                    <button class="btn btn-sm btn-primary" onclick="mostrarDetalles(${med.id})">
                        <i class="fas fa-eye me-1"></i>Ver
                    </button>
                    ${puedeVender ? `
                        <button class="btn btn-sm btn-outline-secondary" onclick="decrementarCantidadVenta(${med.id})" ${cantidadEnCarrito === 0 ? 'disabled' : ''}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" 
                               class="form-control form-control-sm text-center" 
                               id="cantidad-buscador-${med.id}" 
                               value="${cantidadEnCarrito}" 
                               min="0" 
                               max="${med.stock}" 
                               style="width: 60px;"
                               onchange="actualizarCantidadVenta(${med.id}, this.value)">
                        <button class="btn btn-sm btn-success" onclick="incrementarCantidadVenta(${med.id})">
                            <i class="fas fa-plus"></i>
                        </button>
                    ` : '<span class="text-muted small">Sin stock</span>'}
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    actualizarCarritoBuscador();
}

function actualizarCarritoBuscador() {
    const tbodyCarrito = document.getElementById('carrito-buscador');
    const totalElement = document.getElementById('total-buscador');
    const contadorElement = document.getElementById('contador-carrito-buscador');
    
    if (!tbodyCarrito) return;
    
    tbodyCarrito.innerHTML = '';
    let total = 0;
    let totalItems = 0;
    
    if (carritoVenta.length === 0) {
        tbodyCarrito.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-3">
                    <i class="fas fa-shopping-cart me-2"></i>El carrito está vacío
                </td>
            </tr>
        `;
        if (totalElement) totalElement.textContent = 'Bs. 0.00';
        if (contadorElement) contadorElement.textContent = '0';
        return;
    }
    
    carritoVenta.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        totalItems += item.cantidad;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><small>${item.nombre}</small></td>
            <td class="text-center">${item.cantidad}</td>
            <td class="text-end"><small>Bs. ${subtotal.toFixed(2)}</small></td>
            <td class="text-center">
                <button class="btn btn-sm btn-danger p-1" onclick="eliminarDelCarrito(${item.id}); mostrarBuscador();">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        tbodyCarrito.appendChild(tr);
    });
    
    if (totalElement) totalElement.textContent = `Bs. ${total.toFixed(2)}`;
    if (contadorElement) contadorElement.textContent = totalItems.toString();
}

function irAVentas() {
    // Cambiar a la sección de ventas
    const navLink = document.querySelector('.nav-link[data-section="ventas"]');
    if (navLink) {
        navLink.click();
    }
}

