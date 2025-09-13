document.addEventListener("DOMContentLoaded", () => {
    let keyObtenida = false;
    const jugadores = document.querySelectorAll(".objeto-jugador");
    const enemigos = document.querySelectorAll(".objeto-enemigo");
    const fondo = document.getElementById("fondoJuego");

    let ultimaVezSalto = 0;
    const cooldownSalto = 800; // 1 segundo

    const objetos = document.querySelectorAll("[class^='objeto-']:not(.objeto-jugador):not(.objeto-enemigo):not(.objeto-llave)");

    
    const anchoFondo = fondo.clientWidth;
    const altoFondo = fondo.clientHeight;

    // --- Variables del jugador ---
    let jugador = jugadores[0];
    let posX = parseFloat(jugador.style.left) || 0;
    let posY = parseFloat(jugador.style.top) || 0;
    let velocidadX = parseFloat(jugador.dataset.velocidad) || 5;
    let velocidadY = 0;
    let suelo = 380;
    let saltando = false;
    let enSuelo = false; // 👈 NUEVO: bandera de contacto
    const gravedad = parseFloat(jugador.dataset.gravedadSalto) || 1;
    const fuerzaSalto = parseFloat(jugador.dataset.fuerzaSalto) || 20;

    // --- Sistema de animación ---
    let spritesJugador = [];
    let estadoActual = 'idle_right';
    let ultimaDireccion = 'right';
    let frameActual = 0;
    let contadorFrame = 0;
    const velocidadAnimacion = 20;
    
    const teclas = { izquierda: false, derecha: false, arriba: false };
    
    document.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") teclas.izquierda = true;
        if (e.key === "ArrowRight") teclas.derecha = true;
        if (e.key === "ArrowUp") teclas.arriba = true;
    });
    document.addEventListener("keyup", e => {
        if (e.key === "ArrowLeft") teclas.izquierda = false;
        if (e.key === "ArrowRight") teclas.derecha = false;
        if (e.key === "ArrowUp") teclas.arriba = false;
    });

    // --- Variables de enemigos ---
    const estadoEnemigos = Array.from(enemigos).map((enem, index) => ({
        elem: enem,
        posX: 100 + index * 200,
        posY: 380,
        velocidad: parseFloat(enem.dataset.velocidad) || 3,
        direccion: 1
    }));

    // --- Clasificar sprites ---
    function clasificarSprites(sprites) {
        const clasificados = {
            idle_right: [],
            idle_left: [],
            walking_right: [],
            walking_left: [],
            jumping: []
        };

        sprites.forEach(sprite => {
            const action = sprite.action ? sprite.action.toLowerCase() : sprite.imagenPath.toLowerCase();
            
            if (action.includes('derecha_estar')) clasificados.idle_right.push(sprite);
            else if (action.includes('izquierda_estar')) clasificados.idle_left.push(sprite);
            else if (action.includes('derecha_paso') || action.includes('derecha_transicion')) clasificados.walking_right.push(sprite);
            else if (action.includes('izquierda_paso') || action.includes('izquierda_transicion')) clasificados.walking_left.push(sprite);
            else if (action.includes('salto') || action.includes('jump')) clasificados.jumping.push(sprite);
        });

        const ordenar = (action) => {
            if (action.includes('paso1')) return 1;
            if (action.includes('transicion')) return 2;
            if (action.includes('paso2')) return 3;
            return 0;
        };

        clasificados.walking_right.sort((a, b) => ordenar(a.action || a.imagenPath) - ordenar(b.action || b.imagenPath));
        clasificados.walking_left.sort((a, b) => ordenar(a.action || a.imagenPath) - ordenar(b.action || b.imagenPath));

        return clasificados;
    }

    // --- Estado del jugador ---
    function determinarEstado() {
        if (saltando) return 'jumping';
        else if (teclas.izquierda && !teclas.derecha) {
            ultimaDireccion = 'left';
            return 'walking_left';
        } else if (teclas.derecha && !teclas.izquierda) {
            ultimaDireccion = 'right';
            return 'walking_right';
        } else {
            return ultimaDireccion === 'left' ? 'idle_left' : 'idle_right';
        }
    }

    // --- Actualizar sprite ---
    function actualizarSprite() {
        if (!spritesJugador || Object.keys(spritesJugador).length === 0) return;

        const nuevoEstado = determinarEstado();
        if (nuevoEstado !== estadoActual) {
            estadoActual = nuevoEstado;
            frameActual = 0;
            contadorFrame = 0;
            if (estadoActual === 'idle_right' || estadoActual === 'idle_left') {
                const spritesDelEstado = spritesJugador[estadoActual];
                if (spritesDelEstado?.length > 0) {
                    document.getElementById("imgPlayer").src = window.spriteBasePath + spritesDelEstado[0].imagenPath;
                }
                return;
            }
        }

        if (estadoActual !== 'idle_right' && estadoActual !== 'idle_left') {
            contadorFrame++;
            if (contadorFrame >= velocidadAnimacion) {
                contadorFrame = 0;
                const spritesDelEstado = spritesJugador[estadoActual];
                if (spritesDelEstado?.length > 0) {
                    frameActual = (frameActual + 1) % spritesDelEstado.length;
                    const spriteActual = spritesDelEstado[frameActual];
                    document.getElementById("imgPlayer").src = window.spriteBasePath + spriteActual.imagenPath;
                }
            }
        }
    }

    // --- Colisión ---
    function colisionando(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    // --- Bucle principal ---
    function mover() {
        // Movimiento lateral
        if (teclas.izquierda) posX -= velocidadX;
        if (teclas.derecha) posX += velocidadX;

        if (posX < 0) posX = 0;
        if (posX > anchoFondo - jugador.clientWidth) posX = anchoFondo - jugador.clientWidth;

        // Salto
        const ahora = Date.now();
        if (teclas.arriba && !saltando && enSuelo && (ahora - ultimaVezSalto >= cooldownSalto)) {
            velocidadY = -fuerzaSalto;
            saltando = true;
            ultimaVezSalto = ahora;
        }

        posY += velocidadY;
        if (!enSuelo) velocidadY += gravedad;

        enSuelo = false; // 👈 se recalcula cada frame

        // Rect jugador
        const rectJugador = { x: posX, y: posY, width: jugador.clientWidth, height: jugador.clientHeight };

        // Colisiones con objetos
        objetos.forEach(obj => {
            let rectObj;
            if (obj.classList.contains("objeto-silla")) rectObj = { x: obj.offsetLeft + 20, y: obj.offsetTop + 50, width: obj.clientWidth - 40, height: obj.clientHeight - 50 };
            else if (obj.classList.contains("objeto-pilaLibros")) rectObj = { x: obj.offsetLeft + 10, y: obj.offsetTop + 20, width: obj.clientWidth - 20, height: obj.clientHeight - 20 };
            else rectObj = { x: obj.offsetLeft, y: obj.offsetTop, width: obj.clientWidth, height: obj.clientHeight };

            if (colisionando(rectJugador, rectObj)) {
                const overlapX = (rectJugador.x + rectJugador.width / 2) - (rectObj.x + rectObj.width / 2);
                const overlapY = (rectJugador.y + rectJugador.height / 2) - (rectObj.y + rectObj.height / 2);
                const halfWidth = (rectJugador.width + rectObj.width) / 2;
                const halfHeight = (rectJugador.height + rectObj.height) / 2;

                if (Math.abs(overlapX) < halfWidth && Math.abs(overlapY) < halfHeight) {
                    const offsetX = halfWidth - Math.abs(overlapX);
                    const offsetY = halfHeight - Math.abs(overlapY);

                    if (offsetX < offsetY) {
                        overlapX > 0 ? posX += offsetX : posX -= offsetX;
                    } else {
                        if (overlapY > 0) {
                            posY += offsetY;
                            velocidadY = 0;
                        } else {
                            posY -= offsetY;
                            velocidadY = 0;
                            saltando = false;
                            enSuelo = true; // 👈 ahora cuenta como piso
                        }
                    }
                }
            }
        });

        // Piso base
        if (posY >= suelo) {
            posY = suelo;
            velocidadY = 0;
            saltando = false;
            enSuelo = true;
        }

        if (posY < 0) posY = 0;
        if (posY > altoFondo - jugador.clientHeight) posY = altoFondo - jugador.clientHeight;

        jugador.style.left = posX + "px";
        jugador.style.top = posY + "px";

        // Actualizar sprite
        actualizarSprite();

        // Movimiento enemigos
        estadoEnemigos.forEach(enem => {
            enem.posX += enem.velocidad * enem.direccion;
            if (enem.posX <= 0) enem.direccion = 1;
            if (enem.posX >= anchoFondo - enem.elem.clientWidth) enem.direccion = -1;
            enem.elem.style.left = enem.posX + "px";
            enem.elem.style.top = enem.posY + "px";
        });

        requestAnimationFrame(mover);
    }

    mover();

    // --- Fetch sprites ---
    const gameId = 1;
    const url = window.gameRoutes.enemiesJson.replace('__ID__', gameId);

    let spritesEnemigos = [];
    let spritesJugadores = [];

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar enemigos y jugadores');
            return response.json();
        })
        .then(data => {
            spritesEnemigos = data.enemies.map(enemy => ({
                id: enemy.id,
                nombre: enemy.nombre,
                sprites: enemy.sprites
            }));

            spritesJugadores = data.players.map(player => ({
                id: player.id,
                nombre: player.nombre,
                sprites: player.sprites
            }));
           
            if (spritesJugadores.length > 0 && spritesJugadores[0].sprites.length > 0) {
                spritesJugador = clasificarSprites(spritesJugadores[0].sprites);
                const imgPlayer = document.getElementById("imgPlayer");
                if (spritesJugador.idle_right?.length > 0) {
                    imgPlayer.src = window.spriteBasePath + spritesJugador.idle_right[0].imagenPath;
                } else if (spritesJugadores[0].sprites.length > 0) {
                    imgPlayer.src = window.spriteBasePath + spritesJugadores[0].sprites[0].imagenPath;
                }
            }
        })
        .catch(error => {
            console.error('Error al cargar sprites:', error);
        });
});
