// ============================================
// DASHBOARD
// ============================================

function inicializarDashboard() {
    actualizarEstadisticas();
    mostrarCategorias();
    mostrarMedicamentosBajoStock();
    mostrarMedicamentosCaros();
}

function actualizarEstadisticas() {
    const medicamentos = obtenerMedicamentos();
    const total = medicamentos.length;
    
    // Calcular estadísticas
    const stockTotal = medicamentos.reduce((sum, m) => sum + (m.stock || 0), 0);
    const bajoStock = medicamentos.filter(m => m.stock <= 50 && m.stock > 0).length;
    const agotados = medicamentos.filter(m => m.stock === 0).length;
    const valorInventario = medicamentos.reduce((sum, m) => sum + ((m.stock || 0) * (m.precio || 0)), 0);
    
    // Contar categorías únicas
    const categoriasUnicas = new Set(medicamentos.map(m => m.categoria));
    const totalCategorias = categoriasUnicas.size;

    // Actualizar elementos
    const totalEl = document.getElementById('total-medicamentos');
    const stockTotalEl = document.getElementById('stock-total');
    const bajoStockEl = document.getElementById('bajo-stock');
    const agotadosEl = document.getElementById('agotados');
    const valorEl = document.getElementById('valor-inventario');
    const totalCategoriasEl = document.getElementById('total-categorias');
    
    if (totalEl) totalEl.textContent = total;
    if (stockTotalEl) stockTotalEl.textContent = stockTotal.toLocaleString();
    if (bajoStockEl) bajoStockEl.textContent = bajoStock;
    if (agotadosEl) agotadosEl.textContent = `${agotados} agotados`;
    if (valorEl) valorEl.textContent = `Bs. ${valorInventario.toFixed(2)}`;
    if (totalCategoriasEl) totalCategoriasEl.textContent = `${totalCategorias} categorías`;
    
    actualizarContadorMedicamentos();
}

function mostrarMedicamentosBajoStock() {
    const container = document.getElementById('medicamentos-bajo-stock');
    if (!container) return;
    
    const medicamentos = obtenerMedicamentos();
    // Filtrar medicamentos con stock bajo (<= 50 unidades)
    const bajoStock = medicamentos
        .filter(m => m.stock <= 50)
        .sort((a, b) => a.stock - b.stock) // Ordenar por stock ascendente
        .slice(0, 10); // Mostrar solo los 10 primeros
    
    container.innerHTML = '';
    
    if (bajoStock.length === 0) {
        container.innerHTML = '<p class="text-muted text-center mb-0">No hay medicamentos con bajo stock</p>';
        return;
    }
    
    bajoStock.forEach(med => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between align-items-center p-2 border-bottom';
        
        let badgeClass = 'bg-danger';
        if (med.stock === 0) {
            badgeClass = 'bg-danger';
        } else if (med.stock <= 20) {
            badgeClass = 'bg-warning';
        } else {
            badgeClass = 'bg-info';
        }
        
        div.innerHTML = `
            <div class="flex-grow-1">
                <strong>${med.nombre}</strong>
                <br>
                <small class="text-muted">${med.categoria}</small>
            </div>
            <div class="text-end">
                <span class="badge ${badgeClass}">${med.stock} unidades</span>
                <br>
                <small class="text-muted">Bs. ${med.precio.toFixed(2)}</small>
            </div>
        `;
        container.appendChild(div);
    });
}

function mostrarMedicamentosCaros() {
    const container = document.getElementById('medicamentos-caros');
    if (!container) return;
    
    const medicamentos = obtenerMedicamentos();
    // Ordenar por precio descendente y tomar los 10 más caros
    const masCaros = [...medicamentos]
        .sort((a, b) => (b.precio || 0) - (a.precio || 0))
        .slice(0, 10);
    
    container.innerHTML = '';
    
    if (masCaros.length === 0) {
        container.innerHTML = '<p class="text-muted text-center mb-0">No hay medicamentos registrados</p>';
        return;
    }
    
    masCaros.forEach(med => {
        const div = document.createElement('div');
        div.className = 'd-flex justify-content-between align-items-center p-2 border-bottom';
        
        div.innerHTML = `
            <div class="flex-grow-1">
                <strong>${med.nombre}</strong>
                <br>
                <small class="text-muted">${med.categoria}</small>
            </div>
            <div class="text-end">
                <span class="badge bg-primary">Bs. ${med.precio.toFixed(2)}</span>
                <br>
                <small class="text-muted">Stock: ${med.stock}</small>
            </div>
        `;
        container.appendChild(div);
    });
}

function mostrarCategorias() {
    const medicamentos = obtenerMedicamentos();
    const categoriasResumen = document.getElementById('categorias-resumen');
    if (!categoriasResumen) return;
    
    const categorias = {};

    medicamentos.forEach(med => {
        if (categorias[med.categoria]) {
            categorias[med.categoria].count++;
            categorias[med.categoria].stock += med.stock || 0;
            categorias[med.categoria].valor += (med.stock || 0) * (med.precio || 0);
        } else {
            categorias[med.categoria] = {
                count: 1,
                stock: med.stock || 0,
                valor: (med.stock || 0) * (med.precio || 0)
            };
        }
    });

    categoriasResumen.innerHTML = '';

    const colores = ['primary', 'success', 'info', 'warning', 'danger', 'secondary', 'dark'];
    let colorIndex = 0;

    Object.keys(categorias).sort().forEach(categoria => {
        const data = categorias[categoria];
        const color = colores[colorIndex % colores.length];
        colorIndex++;

        const div = document.createElement('div');
        div.className = 'col-md-3 col-sm-6 mb-3';
        div.innerHTML = `
            <div class="card h-100 border-start border-${color} border-3">
                <div class="card-body">
                    <h6 class="card-title mb-2">
                        <i class="fas fa-folder me-2 text-${color}"></i>${categoria}
                    </h6>
                    <div class="mb-2">
                        <span class="badge bg-${color} categoria-badge">${data.count} medicamentos</span>
                    </div>
                    <div class="small text-muted">
                        <div><i class="fas fa-boxes me-1"></i>Stock: ${data.stock.toLocaleString()}</div>
                        <div><i class="fas fa-money-bill me-1"></i>Valor: Bs. ${data.valor.toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `;
        categoriasResumen.appendChild(div);
    });
}

