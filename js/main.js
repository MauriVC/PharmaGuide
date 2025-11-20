// ============================================
// INICIALIZACIÓN PRINCIPAL
// ============================================

function inicializarAplicacion() {
    inicializarNavegacion();
    inicializarBuscador();
    inicializarDashboard();
    inicializarFormularioMedicamento();
    inicializarFormularioTrabajador();
    inicializarVentas();
    inicializarCompras();
    mostrarBuscador();
    
    if (esAdmin()) {
        mostrarGestion();
        mostrarTrabajadores();
    }
}

// Inicializar cuando el DOM está listo
document.addEventListener('DOMContentLoaded', async function() {
    await inicializarDatos();
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

