// ============================================
// BÚSQUEDA INTELIGENTE POR SÍNTOMAS
// ============================================

// Mapeo de síntomas y palabras clave a categorías y medicamentos
const mapeoSintomas = {
    // Dolor
    'dolor de cabeza': {
        categorias: ['Analgésico'],
        palabrasClave: ['dolor', 'cabeza', 'migraña', 'cefalea'],
        medicamentosSugeridos: ['Paracetamol', 'Ibuprofeno', 'Aspirina', 'Acetaminofén']
    },
    'dolor': {
        categorias: ['Analgésico'],
        palabrasClave: ['dolor', 'molestia', 'malestar'],
        medicamentosSugeridos: ['Paracetamol', 'Ibuprofeno', 'Naproxeno']
    },
    'dolor muscular': {
        categorias: ['Analgésico', 'Antiinflamatorio'],
        palabrasClave: ['dolor', 'muscular', 'músculo', 'contractura'],
        medicamentosSugeridos: ['Ibuprofeno', 'Naproxeno', 'Diclofenaco']
    },
    'dolor de estómago': {
        categorias: ['Gastroprotector', 'Analgésico'],
        palabrasClave: ['dolor', 'estómago', 'estomacal', 'gástrico', 'digestivo'],
        medicamentosSugeridos: ['Omeprazol', 'Ranitidina', 'Almagato']
    },
    
    // Inflamación
    'inflamación': {
        categorias: ['Antiinflamatorio'],
        palabrasClave: ['inflamación', 'hinchazón', 'hinchado'],
        medicamentosSugeridos: ['Ibuprofeno', 'Naproxeno', 'Diclofenaco']
    },
    'artritis': {
        categorias: ['Antiinflamatorio'],
        palabrasClave: ['artritis', 'articulación', 'reumático'],
        medicamentosSugeridos: ['Ibuprofeno', 'Naproxeno', 'Diclofenaco']
    },
    
    // Infecciones
    'infección': {
        categorias: ['Antibiótico'],
        palabrasClave: ['infección', 'bacteria', 'bacteriana'],
        medicamentosSugeridos: ['Amoxicilina', 'Azitromicina', 'Ciprofloxacino']
    },
    'gripe': {
        categorias: ['Antibiótico', 'Analgésico'],
        palabrasClave: ['gripe', 'resfriado', 'resfrío', 'congestión'],
        medicamentosSugeridos: ['Paracetamol', 'Ibuprofeno', 'Amoxicilina']
    },
    'tos': {
        categorias: ['Broncodilatador', 'Antibiótico'],
        palabrasClave: ['tos', 'catarro', 'bronquitis'],
        medicamentosSugeridos: ['Amoxicilina', 'Azitromicina']
    },
    
    // Problemas digestivos
    'acidez': {
        categorias: ['Gastroprotector'],
        palabrasClave: ['acidez', 'ardor', 'reflujo', 'gastritis'],
        medicamentosSugeridos: ['Omeprazol', 'Ranitidina', 'Pantoprazol']
    },
    'diarrea': {
        categorias: ['Gastroprotector'],
        palabrasClave: ['diarrea', 'estómago', 'digestivo'],
        medicamentosSugeridos: ['Loperamida', 'Omeprazol']
    },
    'náusea': {
        categorias: ['Gastroprotector'],
        palabrasClave: ['náusea', 'nauseas', 'vómito', 'vomitar'],
        medicamentosSugeridos: ['Metoclopramida', 'Omeprazol']
    },
    
    // Alergias
    'alergia': {
        categorias: ['Antihistamínico'],
        palabrasClave: ['alergia', 'alérgico', 'picazón', 'ronchas'],
        medicamentosSugeridos: ['Loratadina', 'Cetirizina', 'Desloratadina']
    },
    'rinitis': {
        categorias: ['Antihistamínico'],
        palabrasClave: ['rinitis', 'estornudo', 'congestión nasal'],
        medicamentosSugeridos: ['Loratadina', 'Cetirizina']
    },
    
    // Diabetes
    'diabetes': {
        categorias: ['Antidiabético'],
        palabrasClave: ['diabetes', 'diabético', 'glucosa', 'azúcar'],
        medicamentosSugeridos: ['Metformina', 'Glibenclamida', 'Insulina']
    },
    
    // Presión arterial
    'presión alta': {
        categorias: ['Antihipertensivo'],
        palabrasClave: ['presión', 'hipertensión', 'hipertenso', 'tensión'],
        medicamentosSugeridos: ['Losartán', 'Enalapril', 'Amlodipino']
    },
    'hipertensión': {
        categorias: ['Antihipertensivo'],
        palabrasClave: ['hipertensión', 'presión alta'],
        medicamentosSugeridos: ['Losartán', 'Enalapril']
    },
    
    // Colesterol
    'colesterol': {
        categorias: ['Hipolipemiante'],
        palabrasClave: ['colesterol', 'triglicéridos', 'grasa'],
        medicamentosSugeridos: ['Atorvastatina', 'Simvastatina', 'Rosuvastatina']
    },
    
    // Problemas respiratorios
    'asma': {
        categorias: ['Broncodilatador'],
        palabrasClave: ['asma', 'respiratorio', 'bronquial', 'falta de aire'],
        medicamentosSugeridos: ['Salbutamol', 'Budesonida']
    },
    'bronquitis': {
        categorias: ['Broncodilatador', 'Antibiótico'],
        palabrasClave: ['bronquitis', 'tos', 'respiratorio'],
        medicamentosSugeridos: ['Amoxicilina', 'Azitromicina', 'Salbutamol']
    },
    
    // Tiroides
    'tiroides': {
        categorias: ['Hormona Tiroidea'],
        palabrasClave: ['tiroides', 'tiroideo', 'hipotiroidismo'],
        medicamentosSugeridos: ['Levotiroxina']
    },
    
    // Depresión/Ansiedad
    'depresión': {
        categorias: ['Antidepresivo'],
        palabrasClave: ['depresión', 'depresivo', 'tristeza'],
        medicamentosSugeridos: ['Sertralina', 'Fluoxetina', 'Paroxetina']
    },
    'ansiedad': {
        categorias: ['Ansiolítico'],
        palabrasClave: ['ansiedad', 'ansioso', 'nervios', 'estrés'],
        medicamentosSugeridos: ['Alprazolam', 'Diazepam', 'Clonazepam']
    },
    
    // Coagulación
    'coagulación': {
        categorias: ['Anticoagulante'],
        palabrasClave: ['coagulación', 'sangre', 'trombo'],
        medicamentosSugeridos: ['Warfarina', 'Aspirina']
    },
    
    // Diuréticos
    'retenci': {
        categorias: ['Diurético'],
        palabrasClave: ['retención', 'líquido', 'hinchazón'],
        medicamentosSugeridos: ['Furosemida', 'Hidroclorotiazida']
    }
};

function buscarPorSintoma(texto) {
    if (!texto || texto.trim() === '') return [];
    
    const textoLower = texto.toLowerCase().trim();
    const resultados = [];
    const medicamentos = obtenerMedicamentos();
    
    // Buscar coincidencias exactas primero
    for (const [sintoma, datos] of Object.entries(mapeoSintomas)) {
        if (textoLower.includes(sintoma)) {
            // Buscar medicamentos por categoría
            const medicamentosPorCategoria = medicamentos.filter(med => 
                datos.categorias.includes(med.categoria)
            );
            
            // Buscar medicamentos por nombre sugerido
            const medicamentosPorNombre = medicamentos.filter(med => 
                datos.medicamentosSugeridos.some(nombre => 
                    med.nombre.toLowerCase().includes(nombre.toLowerCase())
                )
            );
            
            // Combinar resultados
            const todosMedicamentos = [...new Set([...medicamentosPorCategoria, ...medicamentosPorNombre])];
            
            resultados.push({
                sintoma: sintoma,
                coincidencia: 'exacta',
                medicamentos: todosMedicamentos,
                categoria: datos.categorias[0]
            });
        }
    }
    
    // Si no hay coincidencias exactas, buscar por palabras clave
    if (resultados.length === 0) {
        for (const [sintoma, datos] of Object.entries(mapeoSintomas)) {
            const tienePalabraClave = datos.palabrasClave.some(palabra => 
                textoLower.includes(palabra)
            );
            
            if (tienePalabraClave) {
                const medicamentosPorCategoria = medicamentos.filter(med => 
                    datos.categorias.includes(med.categoria)
                );
                
                resultados.push({
                    sintoma: sintoma,
                    coincidencia: 'parcial',
                    medicamentos: medicamentosPorCategoria,
                    categoria: datos.categorias[0]
                });
            }
        }
    }
    
    // Si aún no hay resultados, buscar por nombre de medicamento directamente
    if (resultados.length === 0) {
        const medicamentosEncontrados = medicamentos.filter(med => 
            med.nombre.toLowerCase().includes(textoLower) ||
            med.categoria.toLowerCase().includes(textoLower)
        );
        
        if (medicamentosEncontrados.length > 0) {
            resultados.push({
                sintoma: 'búsqueda directa',
                coincidencia: 'directa',
                medicamentos: medicamentosEncontrados,
                categoria: null
            });
        }
    }
    
    return resultados;
}

function mostrarResultadosInteligentes(resultados) {
    const container = document.getElementById('resultados-inteligentes');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (resultados.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                <strong>No se encontraron medicamentos para esa descripción.</strong><br>
                <small>Intente con otras palabras como: "dolor de cabeza", "acidez", "gripe", "alergia", "dolor muscular", etc.</small>
            </div>
        `;
        // Mostrar tabla de búsqueda normal si no hay resultados
        mostrarTablaBusquedaNormal(true);
        return;
    }
    
    // Ocultar la tabla de búsqueda normal cuando hay resultados inteligentes
    mostrarTablaBusquedaNormal(false);
    
    resultados.forEach(resultado => {
        if (resultado.medicamentos.length === 0) return;
        
        const card = document.createElement('div');
        card.className = 'card shadow-sm mb-3';
        
        let badgeClass = 'bg-success';
        if (resultado.coincidencia === 'parcial') badgeClass = 'bg-warning';
        if (resultado.coincidencia === 'directa') badgeClass = 'bg-info';
        
        card.innerHTML = `
            <div class="card-header bg-white">
                <h6 class="mb-0">
                    <span class="badge ${badgeClass} me-2">${resultado.coincidencia}</span>
                    ${resultado.sintoma.charAt(0).toUpperCase() + resultado.sintoma.slice(1)}
                    ${resultado.categoria ? `<span class="badge bg-secondary ms-2">${resultado.categoria}</span>` : ''}
                </h6>
            </div>
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-sm table-hover">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>Stock</th>
                                <th>Precio</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${resultado.medicamentos.map(med => {
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
                                
                                return `
                                    <tr>
                                        <td><strong>${med.nombre}</strong></td>
                                        <td><span class="badge bg-secondary">${med.categoria}</span></td>
                                        <td>${stockBadge} <small>(${med.stock})</small></td>
                                        <td><strong>Bs. ${med.precio.toFixed(2)}</strong></td>
                                        <td>
                                            <button class="btn btn-sm btn-primary" onclick="mostrarDetalles(${med.id})">
                                                <i class="fas fa-eye"></i>
                                            </button>
                                            ${med.stock > 0 ? `
                                                <button class="btn btn-sm btn-success" onclick="incrementarCantidadVenta(${med.id})">
                                                    <i class="fas fa-cart-plus"></i>
                                                </button>
                                            ` : ''}
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Agregar botón para limpiar resultados
    const btnLimpiar = document.createElement('button');
    btnLimpiar.className = 'btn btn-outline-secondary btn-sm mt-2';
    btnLimpiar.innerHTML = '<i class="fas fa-times me-1"></i>Limpiar Búsqueda';
    btnLimpiar.onclick = function() {
        container.innerHTML = '';
        document.getElementById('search-inteligente').value = '';
        // Mostrar tabla de búsqueda normal
        mostrarTablaBusquedaNormal(true);
        mostrarBuscador();
    };
    container.appendChild(btnLimpiar);
}

function mostrarTablaBusquedaNormal(mostrar) {
    const tablaContainer = document.querySelector('#buscador .card.shadow-sm.mb-4');
    if (tablaContainer) {
        tablaContainer.style.display = mostrar ? 'block' : 'none';
    }
}

function inicializarBusquedaInteligente() {
    const inputInteligente = document.getElementById('search-inteligente');
    const btnBuscar = document.getElementById('btn-buscar-inteligente');
    
    if (inputInteligente) {
        // Buscar al presionar Enter
        inputInteligente.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                realizarBusquedaInteligente();
            }
        });
    }
    
    if (btnBuscar) {
        btnBuscar.addEventListener('click', realizarBusquedaInteligente);
    }
}

function realizarBusquedaInteligente() {
    const input = document.getElementById('search-inteligente');
    if (!input) return;
    
    const texto = input.value.trim();
    if (texto === '') {
        mostrarToast('Por favor ingrese una descripción', 'info');
        return;
    }
    
    const resultados = buscarPorSintoma(texto);
    mostrarResultadosInteligentes(resultados);
    
    if (resultados.length > 0) {
        const totalMedicamentos = resultados.reduce((sum, r) => sum + r.medicamentos.length, 0);
        mostrarToast(`Se encontraron ${totalMedicamentos} medicamento(s) relacionado(s)`, 'success');
    } else {
        // Mostrar tabla de búsqueda normal si no hay resultados
        mostrarTablaBusquedaNormal(true);
    }
}

