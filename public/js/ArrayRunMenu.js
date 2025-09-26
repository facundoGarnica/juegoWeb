document.addEventListener('DOMContentLoaded', function() {

    // =========================================================
    // ASIGNAR TODOS LOS PLAYERS AL USUARIO AUTOMÁTICAMENTE
    // =========================================================
    if (window.apiConfig?.assignAllPlayersUrl) {
        fetch(window.apiConfig.assignAllPlayersUrl, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log('Respuesta de asignar players:', data);
                if (data.success) {
                    console.log(`Players asignados automáticamente: ${data.totalAssigned}`);
                    // Actualizar playerId global al primero asignado
                    if (data.firstPlayerId) {
                        window.playerId = data.firstPlayerId;
                        console.log('PlayerID global actualizado a:', window.playerId);
                    }
                } else {
                    console.warn('No se pudieron asignar los players:', data.message);
                }
            })
            .catch(err => {
                console.error('Error al asignar players automáticamente:', err);
            });
    } else {
        console.warn('URL para asignar players no configurada');
    }

    // =========================================================
    // ELEMENTOS DEL DOM
    // =========================================================
    const modalNivel = document.getElementById('modalNivel');
    const modalJugador = document.getElementById("modal-jugador");
    const btnJugar = document.getElementById('btnJugar');
    const closeBtn = document.querySelector('.close-btn');
    const cancelBtn = document.querySelector('.btn-secondary');
    const closeJugador = document.querySelector(".close-player-modal");

    let iniciarBtn = document.querySelector('.btn-action:not(.btn-secondary)');
    let nivelSeleccionado = null;
    let personajeSeleccionado = null;

    // =========================================================
    // VERIFICAR QUE LOS ELEMENTOS EXISTEN
    // =========================================================
    console.log('btnJugar encontrado:', btnJugar);
    console.log('modalJugador encontrado:', modalJugador);

    // =========================================================
    // MODAL SELECCIONAR PERSONAJE (CARRUSEL) - MOVER AL INICIO
    // =========================================================
    const track = document.querySelector(".character-track");
    const items = document.querySelectorAll(".character-item");
    const prevBtn = document.querySelector(".character-control.prev");
    const nextBtn = document.querySelector(".character-control.next");
    const indicators = document.querySelectorAll(".character-indicator");

    let currentIndex = 0;

    // ---------------------------
    // BOTÓN JUGAR - ABRIR MODAL PERSONAJE
    // ---------------------------
    btnJugar?.addEventListener("click", () => {
        console.log('Botón jugar clickeado');
        if (modalJugador) {
            modalJugador.style.display = "flex";
            document.body.style.overflow = "hidden";
            updateCarousel();
            console.log('Modal jugador abierto');
        } else {
            console.error('Modal jugador no encontrado');
        }
    });

    // ---------------------------
    // Cerrar modal personaje
    // ---------------------------
    function closeCharacterModal() {
        if (modalJugador) {
            modalJugador.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    closeJugador?.addEventListener("click", closeCharacterModal);

    // Click fuera del modal para cerrarlo
    modalJugador?.addEventListener("click", (e) => {
        if (e.target === modalJugador) {
            closeCharacterModal();
        }
    });

    // ---------------------------
    // Carrusel
    // ---------------------------
    function updateCarousel() {
        if (!track || !items.length) return;

        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        items.forEach((item, i) => {
            item.classList.toggle("active", i === currentIndex);
        });
        indicators.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    nextBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });

    prevBtn?.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    // ---------------------------
    // Aceptar personaje → abrir modal niveles
    // ---------------------------
    window.acceptCharacter = function () {
        personajeSeleccionado = items[currentIndex]?.dataset.characterId;
        console.log("Personaje seleccionado:", personajeSeleccionado);

        // Cerrar modal jugador
        closeCharacterModal();

        // Abrir modal nivel después de elegir personaje
        if (modalNivel) {
            modalNivel.style.display = "flex";
            document.body.style.overflow = "hidden";
            cargarNiveles();
        }
    };

    // Hacer la función global también para el HTML
    window.closeCharacterModal = closeCharacterModal;

    // =========================================================
    // MODAL NIVELES
    // =========================================================

    // ---------------------------
    // Cerrar modal niveles
    // ---------------------------
    [closeBtn, cancelBtn].forEach(btn => {
        btn?.addEventListener('click', () => {
            modalNivel.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    });

    modalNivel?.addEventListener('click', e => {
        if (e.target === modalNivel) {
            modalNivel.style.display = 'none';
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
            const gameId = window.gameId || 'unknown';
            const numeroNivel = nivelSeleccionado.lvlNumber || nivelSeleccionado.id;
            const urlDestino = `/juegoweb/public/index.php/nivelarray/${numeroNivel}/${personajeSeleccionado}/${gameId}`;

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

                            if (iniciarBtn) {
                                iniciarBtn.disabled = false;
                                iniciarBtn.textContent = 'INICIAR NIVEL';
                            }
                        });
                    });

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

    // Inicializar carrusel al cargar
    if (items.length > 0) {
        updateCarousel();
    }
});