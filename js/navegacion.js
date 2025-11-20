// ============================================
// NAVEGACIÓN
// ============================================

function inicializarNavegacion() {
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link[data-section]');
    const sections = document.querySelectorAll('.content-section');
    const logoutBtn = document.getElementById('logout-btn');

    // Manejar logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cerrarSesion();
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const sectionId = this.getAttribute('data-section');
            
            // Verificar permisos antes de cambiar de sección
            if ((sectionId === 'gestion' || sectionId === 'trabajadores') && !esAdmin()) {
                mostrarToast('No tiene permisos para acceder a esta sección', 'error');
                return;
            }
            
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.add('active');
                
                if (sectionId === 'buscador') {
                    mostrarBuscador();
                } else if (sectionId === 'gestion') {
                    mostrarGestion();
                } else if (sectionId === 'trabajadores') {
                    mostrarTrabajadores();
                } else if (sectionId === 'dashboard') {
                    inicializarDashboard();
                }
            }
        });
    });
}

