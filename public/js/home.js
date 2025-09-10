
document.addEventListener('DOMContentLoaded', () => {
    // === CÓDIGO DE MODALES ===
    
    //Constantes para los modales y botones
    const modalLogin = document.getElementById('modalLogin');
    const btnLogin = document.getElementById('openModal');
    const closeLogin = document.getElementById('closeModal');
    const modalRegister = document.getElementById('modalRegister');
    const btnRegister = document.getElementById('openRegisterModal');
    const closeRegister = document.getElementById('closeRegisterModal');
    
    // Verificar que los elementos existan antes de agregar event listeners
    if (btnLogin && modalLogin) {
        // Abrir login y cerrar register
        btnLogin.onclick = () => {
            modalLogin.style.display = 'block';
            if (modalRegister) modalRegister.style.display = 'none';
        };
    }
    
    if (btnRegister && modalRegister) {
        // Abrir register y cerrar login
        btnRegister.onclick = () => {
            modalRegister.style.display = 'block';
            if (modalLogin) modalLogin.style.display = 'none';
        };
    }
    
    if (closeLogin && modalLogin) {
        // Cerrar login
        closeLogin.onclick = () => modalLogin.style.display = 'none';
    }
    
    if (closeRegister && modalRegister) {
        // Cerrar register
        closeRegister.onclick = () => modalRegister.style.display = 'none';
    }
    
    // Script para mostrar/ocultar contraseña en el modal de registro
    const togglePasswordModal = document.getElementById('togglePasswordModal');
    if (togglePasswordModal) {
        togglePasswordModal.addEventListener('click', function () {
            const passwordButton = document.getElementById('togglePasswordModal');
            if (passwordButton.textContent === 'Mostrar Contraseña') {
                passwordButton.textContent = 'Ocultar Contraseña';
            } else {
                passwordButton.textContent = 'Mostrar Contraseña';
            }
           
            // Buscar los campos de contraseña dentro del modal
            const modalForm = document.getElementById('registrationFormModal');
            if (modalForm) {
                const passwordInputs = modalForm.querySelectorAll('input[type="password"], input[type="text"]');
               
                passwordInputs.forEach(input => {
                    if (input.name && input.name.includes('plainPassword')) {
                        if (input.type === 'password') {
                            input.type = 'text';
                        } else {
                            input.type = 'password';
                        }
                    }
                });
            }
        });
    }

    // === CÓDIGO DEL CARRUSEL ===
    
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
   
    if (carousel && items.length > 0) {
        let current = 0;
        const totalItems = items.length;
        let isTransitioning = false; // ✅ Control de transiciones
       
        // Crear indicadores
        createIndicators();
       
        // Función para crear indicadores
        function createIndicators() {
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'carousel-indicators';
       
            for (let i = 0; i < totalItems; i++) {
                const indicator = document.createElement('div');
                indicator.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
                indicator.addEventListener('click', () => goToSlide(i));
                indicatorsContainer.appendChild(indicator);
            }
       
            const carruselContainer = document.getElementById('CarruselJuegos');
            if (carruselContainer) {
                carruselContainer.appendChild(indicatorsContainer);
            }
        }
        
        // ✅ Función para actualizar el carrusel
        function updateCarousel() {
            isTransitioning = true; // ✅ Marcar que estamos en transición
            
            items.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next', 'centered');

                if (index === current) {
                    item.classList.add('active');
                    // ✅ Después de la transición CSS, marcar como centrado
                    setTimeout(() => {
                        item.classList.add('centered');
                        isTransitioning = false; // ✅ Transición terminada
                    }, 300); // Debe coincidir con la duración de transición CSS
                } else if (index === (current - 1 + totalItems) % totalItems) {
                    item.classList.add('prev');
                } else if (index === (current + 1) % totalItems) {
                    item.classList.add('next');
                }
            });

            // Actualizar indicadores
            const indicators = document.querySelectorAll('.carousel-indicator');
            indicators.forEach((indicator, index) => {
                indicator.classList.toggle('active', index === current);
            });

            // ✅ Actualizar top scores del juego activo
            const activeItem = items[current];
            if (activeItem) {
                const gameId = activeItem.dataset.gameId;
                if (gameId) {
                    updateTopScores(gameId);
                }
            }
        }

        // Función para ir a un slide específico
        function goToSlide(index) {
            if (isTransitioning) return; // ✅ Evitar cambios durante transiciones
            current = index;
            updateCarousel();
        }
       
        // Función para ir al siguiente slide
        function nextSlide() {
            if (isTransitioning) return; // ✅ Evitar cambios durante transiciones
            current = (current + 1) % totalItems;
            updateCarousel();
        }
       
        // Función para ir al slide anterior
        function prevSlide() {
            if (isTransitioning) return; // ✅ Evitar cambios durante transiciones
            current = (current - 1 + totalItems) % totalItems;
            updateCarousel();
        }
       
        // Event listeners para los botones de control
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
       
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        // ✅ Event listeners para las imágenes del carrusel
        items.forEach((item, index) => {
            // Listener para la imagen completa (navegación)
            item.addEventListener('click', (e) => {
                // Si se hizo clic en el overlay JUGAR, no navegar
                if (e.target.closest('.play-overlay')) {
                    return;
                }
                
                // Solo navegar si no es la imagen actual y no hay transición
                if (index !== current && !isTransitioning) {
                    goToSlide(index);
                }
            });
            
            // ✅ Listener específico para el overlay JUGAR
            const playOverlay = item.querySelector('.play-overlay');
            if (playOverlay) {
                playOverlay.addEventListener('click', (e) => {
                    e.stopPropagation(); // Evita que se propague al item padre
                    
                    // Solo permitir jugar si es el item activo y centrado
                    if (index === current && 
                        item.classList.contains('active') && 
                        item.classList.contains('centered') && 
                        !isTransitioning) {
                        
                        const gameId = item.dataset.gameId;
                        if (gameId) {
                            if (!userId || userId === 'null') {
                                // 🔹 Mostrar modal personalizado en lugar de alert
                                const modalError = document.getElementById('modalError');
                                modalError.style.display = 'flex'; // (usa flex para centrar contenido)

                                const closeBtn = document.getElementById('closeErrorModal');
                                closeBtn.onclick = function() {
                                    modalError.style.display = 'none';
                                };

                                return; // 🚫 No continúa a abrirJuego
                            }
                            abrirJuego(gameId, userId); // 🔹 Pasamos también el userId
                        }
                    }
                });
            }

        });

       // Cerrar modal si se hace clic fuera de la caja
        const modalError = document.getElementById('modalError');

        modalError.addEventListener('click', (e) => {
            // Si el click NO fue dentro de .modal-box => cerrar
            if (e.target === modalError) {
                modalError.style.display = 'none';
            }
        });

        // Soporte para navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        });
       
        // Soporte para touch/swipe en móviles
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
       
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
       
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });
       
        function handleSwipe() {
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const minSwipeDistance = 50;
           
            // Solo procesar swipes horizontales si no hay transición
            if (!isTransitioning && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    prevSlide(); // Swipe derecha = slide anterior
                } else {
                    nextSlide(); // Swipe izquierda = slide siguiente
                }
            }
        }
       
        // Inicializar el carrusel
        updateCarousel();
        
        console.log('Carrusel inicializado con', totalItems, 'elementos');
    } else {
        console.log('No se encontró el carrusel o no hay elementos');
    }

    // === CÓDIGO ADICIONAL ===
    
    // Botones de navegación adicionales
    const nosotrosBtn = document.getElementById('nosotros');
    const detrasEscenasBtn = document.getElementById('detrasEscenas');
    const contactoBtn = document.getElementById('contacto');
    
    if (nosotrosBtn) {
        nosotrosBtn.addEventListener('click', () => {
            console.log('Botón "Sobre nosotros" clickeado');
        });
    }
    
    if (detrasEscenasBtn) {
        detrasEscenasBtn.addEventListener('click', () => {
            console.log('Botón "Detrás de escenas" clickeado');
        });
    }
    
    if (contactoBtn) {
        contactoBtn.addEventListener('click', () => {
            console.log('Botón "Contacto" clickeado');
        });
    }

    function updateTopScores(gameId) {
        fetch(`game/${gameId}/top-scores`)
            .then(response => response.json())
            .then(data => {
                window.topScores = data;
                const container = document.getElementById('topScoresContainer');
                if (container) {
                    let html = '<ol>';
                    data.forEach(ul => {
                        html += `<li>
                            <span class='label'>Nombre:</span> <strong>${ul.user}</strong> - 
                            <span class='label'>Puntaje:</span> <strong>${ul.puntos}</strong> - 
                            <span class='label'>Nivel:</span> <strong>${ul.nivel}</strong>
                        </li>`;
                    });
                    html += '</ol>';
                    container.innerHTML = html;
                }
            })
            .catch(err => console.error('Error cargando top scores:', err));
    }
});

function abrirJuego(gameId) {
    if (!userId || userId === 'null') {
        // Mostrar el modal de error
        const modalError = document.getElementById('modalError');
        modalError.style.display = 'block';

        // Agregar evento para cerrar el modal
        const closeBtn = document.getElementById('closeErrorModal');
        closeBtn.onclick = function() {
            modalError.style.display = 'none';
        };

        return; // Salir de la función para que no redirija
    }

    const url = `juego/${gameId}/${userId}`;
    window.location.href = url;
}


