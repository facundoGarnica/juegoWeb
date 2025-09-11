document.addEventListener('DOMContentLoaded', () => {
    // === VARIABLES GLOBALES ===
    const modalLogin = document.getElementById('modalLogin');
    const btnLogin = document.getElementById('openModal');
    const closeLogin = document.getElementById('closeModal');
    const modalRegister = document.getElementById('modalRegister');
    const btnRegister = document.getElementById('openRegisterModal');
    const closeRegister = document.getElementById('closeRegisterModal');
    const formRegister = document.getElementById('registrationFormModal');

    // === MODALES ===
    if (btnLogin && modalLogin) {
        btnLogin.onclick = () => {
            modalLogin.style.display = 'block';
            if (modalRegister) modalRegister.style.display = 'none';
        };
    }
    
    if (btnRegister && modalRegister) {
        btnRegister.onclick = () => {
            modalRegister.style.display = 'block';
            if (modalLogin) modalLogin.style.display = 'none';
        };
    }
    
    if (closeLogin && modalLogin) {
        closeLogin.onclick = () => modalLogin.style.display = 'none';
    }
    
    if (closeRegister && modalRegister) {
        closeRegister.onclick = () => modalRegister.style.display = 'none';
    }

    // === TOGGLE PASSWORD LOGIN ===
    const togglePasswordLogin = document.getElementById('togglePasswordLogin');
    if (togglePasswordLogin) {
        togglePasswordLogin.addEventListener('click', () => {
            const passwordInput = document.getElementById('inputPassword');
            if (passwordInput) {
                passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                togglePasswordLogin.textContent = passwordInput.type === 'password' ? 'Mostrar Contraseña' : 'Ocultar Contraseña';
            }
        });
    }

    // === TOGGLE PASSWORD REGISTRO ===
    const togglePasswordModal = document.getElementById('togglePasswordModal');
    if (togglePasswordModal) {
        togglePasswordModal.addEventListener('click', () => {
            const passwordFirst = document.getElementById('registration_form_plainPassword_first');
            const passwordSecond = document.getElementById('registration_form_plainPassword_second');
            
            if (passwordFirst && passwordSecond) {
                const newType = passwordFirst.type === 'password' ? 'text' : 'password';
                passwordFirst.type = newType;
                passwordSecond.type = newType;
                togglePasswordModal.textContent = newType === 'password' ? 'Mostrar Contraseña' : 'Ocultar Contraseña';
            }
        });
    }

    // === MANEJO DE ERRORES DE LOGIN ===
    if (typeof loginError !== 'undefined' && loginError && modalLogin) {
        modalLogin.style.display = 'block';
        const errorDiv = modalLogin.querySelector('.alert-danger');
        if (errorDiv) errorDiv.textContent = 'Correo o contraseña incorrecta.';
    }

    // === AJAX REGISTRO ===
    if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Limpiar errores previos Y estilos
            formRegister.querySelectorAll('.error').forEach(div => {
                div.textContent = '';
                div.style.color = '';
            });
            
            // Limpiar estilos de inputs
            formRegister.querySelectorAll('input').forEach(input => {
                input.style.borderColor = '';
                input.style.borderWidth = '';
            });
            
            const formData = new FormData(formRegister);

            fetch(formRegister.action || '/register', {
                method: 'POST',
                body: formData,
                headers: { 
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.text())
            .then(text => {
                try {
                    const data = JSON.parse(text);
                    
                    if (data.success) {
                        // Mostrar mensaje de éxito más elegante
                        const successMessage = document.createElement('div');
                        successMessage.className = 'success-message';
                        successMessage.style.cssText = `
                            background: #d4edda;
                            color: #155724;
                            border: 1px solid #c3e6cb;
                            padding: 10px;
                            border-radius: 5px;
                            margin: 10px 0;
                            text-align: center;
                        `;
                        successMessage.textContent = data.message || 'Registro exitoso';
                        formRegister.appendChild(successMessage);
                        
                        setTimeout(() => {
                            formRegister.reset();
                            if (modalRegister) modalRegister.style.display = 'none';
                            successMessage.remove();
                        }, 2000);
                        
                    } else if (data.errors) {
                        // Mostrar errores específicos por campo
                        for (const field in data.errors) {
                            if (field === 'general') {
                                // Mostrar errores generales en el primer error div disponible
                                const generalErrorDiv = formRegister.querySelector('.error');
                                if (generalErrorDiv) {
                                    generalErrorDiv.textContent = data.errors[field].join(', ');
                                    generalErrorDiv.style.color = '#dc3545';
                                    generalErrorDiv.style.fontSize = '14px';
                                }
                            } else {
                                // Mostrar errores específicos del campo
                                const div = document.getElementById(`error-${field}`);
                                if (div) {
                                    div.textContent = data.errors[field].join(', ');
                                    div.style.color = '#dc3545';
                                    div.style.fontSize = '14px';
                                    div.style.marginTop = '5px';
                                    
                                    // También resaltar el input con borde rojo
                                    const input = formRegister.querySelector(`[name*="${field}"]`);
                                    if (input) {
                                        input.style.borderColor = '#dc3545';
                                        input.style.borderWidth = '2px';
                                    }
                                }
                            }
                        }
                        
                        // Scroll al primer error para que sea visible
                        const firstError = formRegister.querySelector('.error:not(:empty)');
                        if (firstError) {
                            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        
                    } else {
                        alert('Error desconocido al registrar');
                    }
                } catch (jsonError) {
                    if (text.includes('<!DOCTYPE html>')) {
                        alert('Error del servidor: La página fue redirigida. Revisa que la ruta /register esté configurada correctamente.');
                    } else {
                        alert('Error: Respuesta inválida del servidor.');
                    }
                }
            })
            .catch(err => {
                alert('Error de conexión al registrar usuario.');
            });
        });
    }

    // === CARRUSEL ===
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (carousel && items.length > 0) {
        let current = 0;
        let isTransitioning = false;
        const totalItems = items.length;

        const createIndicators = () => {
            const container = document.createElement('div');
            container.className = 'carousel-indicators';
            for (let i = 0; i < totalItems; i++) {
                const ind = document.createElement('div');
                ind.className = `carousel-indicator ${i === 0 ? 'active' : ''}`;
                ind.addEventListener('click', () => goToSlide(i));
                container.appendChild(ind);
            }
            const carruselContainer = document.getElementById('CarruselJuegos');
            if (carruselContainer) carruselContainer.appendChild(container);
        };
        createIndicators();

        const updateCarousel = () => {
            isTransitioning = true;
            items.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next', 'centered');
                if (index === current) {
                    item.classList.add('active');
                    setTimeout(() => {
                        item.classList.add('centered');
                        isTransitioning = false;
                    }, 300);
                } else if (index === (current - 1 + totalItems) % totalItems) {
                    item.classList.add('prev');
                } else if (index === (current + 1) % totalItems) {
                    item.classList.add('next');
                }
            });
            
            document.querySelectorAll('.carousel-indicator').forEach((ind, idx) => {
                ind.classList.toggle('active', idx === current);
            });

            const activeItem = items[current];
            if (activeItem && activeItem.dataset.gameId) {
                updateTopScores(activeItem.dataset.gameId);
            }
        };

        const goToSlide = (idx) => {
            if (!isTransitioning) {
                current = idx;
                updateCarousel();
            }
        };
        
        const nextSlide = () => {
            if (!isTransitioning) {
                current = (current + 1) % totalItems;
                updateCarousel();
            }
        };
        
        const prevSlide = () => {
            if (!isTransitioning) {
                current = (current - 1 + totalItems) % totalItems;
                updateCarousel();
            }
        };

        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        items.forEach((item, index) => {
            item.addEventListener('click', e => {
                if (e.target.closest('.play-overlay')) return;
                if (index !== current && !isTransitioning) goToSlide(index);
            });
            
            const overlay = item.querySelector('.play-overlay');
            if (overlay) {
                overlay.addEventListener('click', e => {
                    e.stopPropagation();
                    if (index === current && item.classList.contains('active') && 
                        item.classList.contains('centered') && !isTransitioning) {
                        const gameId = item.dataset.gameId;
                        if (!userId || userId === 'null') {
                            const modalError = document.getElementById('modalError');
                            modalError.style.display = 'flex';
                            const closeBtn = document.getElementById('closeErrorModal');
                            closeBtn.onclick = () => modalError.style.display = 'none';
                            return;
                        }
                        abrirJuego(gameId, userId);
                    }
                });
            }
        });

        const modalError = document.getElementById('modalError');
        if (modalError) {
            modalError.addEventListener('click', e => {
                if (e.target === modalError) modalError.style.display = 'none';
            });
        }

        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') prevSlide();
            else if (e.key === 'ArrowRight') nextSlide();
        });

        let startX = 0, startY = 0, endX = 0, endY = 0;
        carousel.addEventListener('touchstart', e => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        carousel.addEventListener('touchend', e => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            if (!isTransitioning && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                deltaX > 0 ? prevSlide() : nextSlide();
            }
        });

        updateCarousel();
    }

    // === BOTONES ADICIONALES ===
    ['nosotros', 'detrasEscenas', 'contacto'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', () => {});
        }
    });

    // === FUNCIÓN PARA TOP SCORES ===
    function updateTopScores(gameId) {
        fetch(`game/${gameId}/top-scores`)
            .then(res => res.json())
            .then(data => {
                const container = document.getElementById('topScoresContainer');
                if (container) {
                    let html = '<ol>';
                    data.forEach(ul => {
                        html += `<li>
                            <div><span class='label'>Usuario:</span> <strong>${ul.user}</strong></div>
                            <div><span class='label'>Personaje:</span> <strong>${ul.player}</strong></div>
                            <div><span class='label'>Puntaje:</span> <strong>${ul.puntos}</strong></div>
                            <div><span class='label'>Nivel:</span> <strong>${ul.nivel}</strong></div>
                        </li>`;
                    });
                    html += '</ol>';
                    container.innerHTML = html;
                }
            })
            .catch(err => {});
    }
});

// === FUNCIÓN GLOBAL PARA ABRIR JUEGO ===
function abrirJuego(gameId) {
    if (!userId || userId === 'null') {
        const modalError = document.getElementById('modalError');
        modalError.style.display = 'block';
        const closeBtn = document.getElementById('closeErrorModal');
        closeBtn.onclick = () => modalError.style.display = 'none';
        return;
    }
    window.location.href = `juego/${gameId}/${userId}`;
}