// ============================================
// INICIALIZACIÓN PRINCIPAL
// ============================================

function inicializarAplicacion() {
    inicializarNavegacion();
    inicializarBuscador();
    inicializarDashboard();
    inicializarFormularioMedicamento();
    inicializarFormularioTrabajador();
    mostrarBuscador();
    
    if (esAdmin()) {
        mostrarGestion();
        mostrarTrabajadores();
    }
}

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    inicializarDatos();
    inicializarLogin();
    
    // Verificar si hay sesión activa (mantener sesión al recargar)
    const usuarioActual = obtenerUsuarioActual();
    if (usuarioActual) {
        mostrarAplicacion();
        inicializarAplicacion();
    } else {
        mostrarLogin();
    }
});

