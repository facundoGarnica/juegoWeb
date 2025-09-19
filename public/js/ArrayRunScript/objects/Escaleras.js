export default class Escaleras {
    /**
     * Constructor de la escalera modular responsive
     * @param {Phaser.Scene} scene - Escena donde se agrega
     * @param {Phaser.Physics.Arcade.Sprite} player - Jugador para colisiones
     * @param {number} startX - posición inicial X en píxeles
     * @param {number} startY - posición inicial Y en píxeles
     * @param {number} stepsCount - cantidad de escalones
     * @param {number} stepWidthRatio - ancho del escalón como proporción del ancho de pantalla (default: 0.05)
     * @param {number} stepHeightRatio - alto del escalón como proporción de la altura de pantalla (default: 0.03)
     * @param {number} offsetX - separación horizontal entre escalones en píxeles
     * @param {number} offsetY - separación vertical entre escalones en píxeles
     */
    constructor(scene, player, startX, startY, stepsCount = 10, stepWidthRatio = 0.05, stepHeightRatio = 0.03, offsetX = 39, offsetY = 30) {
        this.scene = scene;
        this.player = player;

        // Proporciones relativas para responsive
        this.relStartX = startX / scene.scale.width;
        this.relStartY = startY / scene.scale.height;
        this.relOffsetX = offsetX / scene.scale.width;
        this.relOffsetY = offsetY / scene.scale.height;

        // Proporciones para el tamaño de escalones
        this.stepWidthRatio = stepWidthRatio;
        this.stepHeightRatio = stepHeightRatio;

        this.stepsCount = stepsCount;

        // Crear grupo de escalones
        this.stairs = scene.physics.add.staticGroup();
        this.steps = [];

        this.createStairs(scene.scale.width, scene.scale.height);

        // Collider con lógica one-way mejorada
        this.setupCollider();
    }

    /**
     * Configurar el collider con lógica one-way
     */
    setupCollider() {
        const tolerance = 12;

        const getPrevBottom = (body) => {
            if (body.prev && body.prev.y !== undefined) {
                return body.prev.y + body.height;
            }
            return body.y + body.height - body.velocity.y;
        };

        this.collider = this.scene.physics.add.collider(
            this.player,
            this.stairs,
            null,
            (player, step) => {
                const playerBottom = player.body.y + player.body.height;
                const platformTop = step.body.y;
                const prevBottom = getPrevBottom(player.body);

                // Si el jugador ya está tocando el suelo, permitir colisión
                if (player.body.blocked.down || player.body.touching.down) return true;

                // Solo colisionar si el jugador viene desde arriba
                if (
                    player.body.velocity.y > 0 &&
                    prevBottom <= platformTop &&
                    playerBottom >= platformTop - tolerance
                ) {
                    return true;
                }

                // Permitir colisión si el jugador está muy cerca de la plataforma desde arriba
                if (
                    player.body.velocity.y >= 0 &&
                    playerBottom <= platformTop + tolerance
                ) {
                    return true;
                }

                return false;
            },
            this.scene
        );
    }

    /**
     * Crear escalones según las proporciones actuales
     * @param {number} width - Ancho actual de la pantalla
     * @param {number} height - Alto actual de la pantalla
     */
    createStairs(width, height) {
        // Destruir escalones existentes
        this.steps.forEach(step => step.destroy());
        this.steps = [];

        // Calcular posición inicial basada en proporciones
        const startX = width * this.relStartX;
        const startY = height * this.relStartY;

        // Calcular tamaños de escalón basados en proporciones
        const stepWidth = width * this.stepWidthRatio;
        const stepHeight = height * this.stepHeightRatio;

        // Crear escalones
        for (let i = 0; i < this.stepsCount; i++) {
            const stepX = startX + i * width * this.relOffsetX;
            const stepY = startY - i * height * this.relOffsetY;

            let step = this.stairs.create(stepX, stepY, 'platform')
                .setDisplaySize(stepWidth, stepHeight)
                .setTint(0x00ff00); // Verde para ver la hitbox

            step.refreshBody();

            // Configurar colisiones solo por arriba (one-way platform)
            step.body.checkCollision.down = false;
            step.body.checkCollision.left = false;
            step.body.checkCollision.right = false;
            step.body.checkCollision.up = true;

            this.steps.push(step);
        }
    }

    /**
     * Método responsive: recalcular posiciones y tamaños al redimensionar
     * @param {number} width - Nuevo ancho de pantalla
     * @param {number} height - Nuevo alto de pantalla
     */
    resize(width, height) {
        this.createStairs(width, height);
    }

    /**
     * Actualizar las proporciones de los escalones (útil para diferentes niveles)
     * @param {number} widthRatio - Nueva proporción de ancho
     * @param {number} heightRatio - Nueva proporción de alto
     */
    updateStepSize(widthRatio, heightRatio) {
        this.stepWidthRatio = widthRatio;
        this.stepHeightRatio = heightRatio;
        this.createStairs(this.scene.scale.width, this.scene.scale.height);
    }

    /**
     * Cambiar la cantidad de escalones dinámicamente
     * @param {number} newCount - Nueva cantidad de escalones
     */
    updateStepsCount(newCount) {
        this.stepsCount = newCount;
        this.createStairs(this.scene.scale.width, this.scene.scale.height);
    }

    /**
     * Destruir las escaleras completamente
     */
    destroy() {
        if (this.collider) {
            this.collider.destroy();
        }
        this.steps.forEach(step => step.destroy());
        this.stairs.destroy();
    }

    /**
     * Obtener información de debug
     */
    getDebugInfo() {
        return {
            stepsCount: this.stepsCount,
            stepWidthRatio: this.stepWidthRatio,
            stepHeightRatio: this.stepHeightRatio,
            relStartX: this.relStartX,
            relStartY: this.relStartY,
            relOffsetX: this.relOffsetX,
            relOffsetY: this.relOffsetY
        };
    }
}