document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalNivel');
    const btnJugar = document.getElementById('btnJugar');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.btn-secondary');

    let iniciarBtn = document.querySelector('.btn-action:not(.btn-secondary)');
    let nivelSeleccionado = null;

    // ---------------------------
    // Mostrar modal
    // ---------------------------
    btnJugar?.addEventListener('click', () => {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        cargarNiveles();
    });

    // ---------------------------
    // Cerrar modal
    // ---------------------------
    [closeBtn, cancelBtn].forEach(btn => {
        btn?.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    modal?.addEventListener('click', e => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // ---------------------------
    // Botón "INICIAR NIVEL"
    // ---------------------------
    if (iniciarBtn) {
        iniciarBtn.textContent = 'SELECCIONAR UN NIVEL';
        iniciarBtn.disabled = true;

        iniciarBtn.addEventListener('click', () => {
            if (!nivelSeleccionado) {
                alert('Por favor selecciona un nivel');
                return;
            }

            // Obtener número del nivel
            const numeroNivel = nivelSeleccionado.lvlNumber || nivelSeleccionado.id;

            // Redirigir a la ruta correcta de Symfony
            const urlDestino = `/juegoweb/public/index.php/nivelarray/${numeroNivel}`;

            console.log('Nivel seleccionado:', numeroNivel);
            console.log('Redirigiendo a:', urlDestino);

            window.location.href = urlDestino;
        });
    }

    // ---------------------------
    // Cargar niveles desde API
    // ---------------------------
    function cargarNiveles() {
        const nivelesGrid = document.getElementById('nivelesGrid');
        if (!nivelesGrid) return console.error('Elemento nivelesGrid no encontrado');

        if (!window.apiConfig || !window.apiConfig.levelsByGameUrl) {
            nivelesGrid.innerHTML = '<p>Error de configuración</p>';
            return console.error('Configuración de API no encontrada');
        }

        const url = window.apiConfig.levelsByGameUrl;
        console.log('URL para niveles:', url);

        nivelesGrid.innerHTML = '<p>Cargando niveles...</p>';

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                console.log('Datos recibidos de niveles:', data);
                nivelesGrid.innerHTML = '';

                if (data.success && data.levels?.length) {
                    data.levels.forEach(level => {
                        const button = document.createElement('button');
                        button.classList.add('nivel-square', 'nivel-completado');
                        button.textContent = level.lvlNumber || level.id;

                        nivelesGrid.appendChild(button);

                        button.addEventListener('click', () => {
                            document.querySelectorAll('.nivel-square').forEach(b => b.classList.remove('selected'));
                            button.classList.add('selected');
                            nivelSeleccionado = level;
                            actualizarInfoNivel(level);

                            // Habilitar botón iniciar
                            if (iniciarBtn) {
                                iniciarBtn.disabled = false;
                                iniciarBtn.textContent = 'INICIAR NIVEL';
                            }
                        });
                    });

                    // Seleccionar primer nivel automáticamente
                    const primer = nivelesGrid.querySelector('.nivel-square');
                    if (primer) primer.click();

                } else {
                    nivelesGrid.innerHTML = '<p>No hay niveles disponibles</p>';
                }
            })
            .catch(err => {
                console.error('Error al cargar niveles:', err);
                nivelesGrid.innerHTML = '<p>Error al cargar niveles</p>';
            });
    }

    // ---------------------------
    // Actualizar info del nivel
    // ---------------------------
    function actualizarInfoNivel(level) {
        const nivelInfo = document.querySelector('.nivel-info');
        if (nivelInfo) {
            nivelInfo.innerHTML = `
                <h3>${level.nombre}</h3>
                <p>${level.descripcion}</p>
                <p><strong>Dificultad:</strong> ${level.dificultad}</p>
                <div class="info-player">Cargando datos del jugador...</div>
            `;
        }

        const infoPlayer = document.querySelector('.info-player');
        if (!infoPlayer || !window.playerId || !window.apiConfig?.userLevelUrl) return;

        const url = window.apiConfig.userLevelUrl
            .replace('__PLAYER__', window.playerId)
            .replace('__LEVEL__', level.id);

        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    const u = data.data;
                    infoPlayer.innerHTML = `
                        <p><strong>---------------------</strong></p>
                        <p><strong>Finalizado:</strong> ${u.completado ? 'Sí' : 'No'}</p>
                        <p><strong>Tiempo tardado:</strong> ${u.tiempo_usado ?? '-'} seg</p>
                        <p><strong>Puntos obtenidos:</strong> ${u.puntos_obtenidos ?? '-'}</p>
                    `;
                } else infoPlayer.innerHTML = '';
            })
            .catch(err => {
                console.error('Error al cargar progreso del jugador:', err);
                infoPlayer.innerHTML = `
                    <p><strong>---------------------</strong></p>
                    <p><strong>Finalizado:</strong> -</p>
                    <p><strong>Tiempo tardado:</strong> - seg</p>
                    <p><strong>Puntos obtenidos:</strong> -</p>
                `;
            });
    }
});
