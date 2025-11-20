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
                <td colspan="7" class="text-center text-muted py-4">
                    <i class="fas fa-search me-2"></i>No se encontraron medicamentos
                </td>
            </tr>
        `;
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

        const imagen = med.imagen || 'https://via.placeholder.com/50x50/CCCCCC/666666?text=?';

        tr.innerHTML = `
            <td>${med.id}</td>
            <td>
                <img src="${imagen}" alt="${med.nombre}" class="medicamento-thumb" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" onerror="this.src='https://via.placeholder.com/50x50/CCCCCC/666666?text=?'">
            </td>
            <td><strong>${med.nombre}</strong></td>
            <td><span class="badge bg-secondary">${med.categoria}</span></td>
            <td>${stockBadge} <small class="text-muted">(${med.stock} unidades)</small></td>
            <td><strong>Bs. ${med.precio.toFixed(2)}</strong></td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="mostrarDetalles(${med.id})">
                    <i class="fas fa-eye me-1"></i>Ver
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

