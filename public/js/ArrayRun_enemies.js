document.addEventListener('DOMContentLoaded', () => {
    const ogroContainer = document.getElementById('ogro');
    const profesorContainer = document.getElementById('profesor');

    async function getEnemyByName(enemyName) {
        try {
            const response = await fetch(enemiesJsonPath);
            if (!response.ok) throw new Error('Error cargando enemigos');

            const enemies = await response.json();
            return enemies.find(e => e.nombre.toLowerCase() === enemyName.toLowerCase()) || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // Renderiza un enemigo en un div específico y retorna referencias
   function renderEnemy(container, enemy, spriteName = 'derecha_estar', verticalFactor = 0.1) {
        if (!enemy || !container) return null;

        container.innerHTML = ''; // limpiar
        container.style.position = 'absolute'; // importante para mover todo junto

        // 🔹 info arriba del enemigo
        const info = document.createElement('p');
        info.textContent = `${enemy.nombre} (Vida: ${enemy.vida}, Damage: ${enemy.damage})`;
        info.style.position = 'absolute';
        info.style.top = '-100px'; // 20px arriba del sprite
        info.style.left = '0';
        info.style.width = '100%';
        info.style.textAlign = 'center';
        container.appendChild(info);

        const sprite = enemy.sprites.find(s => s.imagenPath.includes(spriteName));
        if (!sprite) return null;

        const img = document.createElement('img');
        img.src = spritesBasePath + sprite.imagenPath;
        img.alt = sprite.action;
        img.width = 64;
        img.height = 64;
        img.style.display = 'block';
        container.appendChild(img);

        // Posicionar verticalmente el contenedor
        const containerHeight = container.parentElement.clientHeight;
        const maxY = containerHeight - img.height;
        container.style.top = `${maxY * verticalFactor}px`;

        return { enemy, img, info, container };
    }

    // Función de patrulla (igual que antes)
    function patrolEnemy(enemyObj, gameContainerWidth, duration = 3000) {
    if (!enemyObj) return;

    const { enemy, img, container } = enemyObj;
    const enemyWidth = img.width; 
    const startX = 0; // posición inicial
    const endX = gameContainerWidth - enemyWidth;

    function moveEnemy(direction) {
        const startTime = performance.now();
        let spriteIndex = 0;

        const walkingSprites = [
            `${direction}_paso1`,
            `${direction}_paso2`,
            `${direction}_paso3`,
            `${direction}_paso4`,
            `${direction}_estar`
        ];

        const spriteInterval = setInterval(() => {
            const sprite = enemy.sprites.find(s =>
                s.imagenPath.includes(walkingSprites[spriteIndex])
            );
            if (sprite) img.src = spritesBasePath + sprite.imagenPath;
            spriteIndex = (spriteIndex + 1) % walkingSprites.length;
        }, 250);

        function move(timestamp) {
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Mover entre startX y endX según dirección
            let posX;
            if (direction === 'derecha') {
                posX = startX + (endX - startX) * progress;
            } else {
                posX = endX - (endX - startX) * progress;
            }

            container.style.transform = `translateX(${posX}px)`;

            if (progress < 1) {
                requestAnimationFrame(move);
            } else {
                clearInterval(spriteInterval);
                const standSprite = enemy.sprites.find(s =>
                    s.imagenPath.includes(`${direction}_estar`)
                );
                if (standSprite) img.src = spritesBasePath + standSprite.imagenPath;

                setTimeout(() => moveEnemy(direction === 'derecha' ? 'izquierda' : 'derecha'), 300);
            }
        }

            requestAnimationFrame(move);
        }

        moveEnemy('derecha');
    }



    // Ejemplo: profesor
    getEnemyByName('profesor').then(enemy => {
        const profesorObj = renderEnemy(profesorContainer, enemy, 'derecha_estar', 0.3); //modificar 1 para bajo, 0.5 medio en Y

        // 🔹 usar el contenedor del enemigo para calcular el ancho
        const gameContainerWidth = profesorObj.container.parentElement.clientWidth;
        patrolEnemy(profesorObj, gameContainerWidth, 4000);
    });


});
