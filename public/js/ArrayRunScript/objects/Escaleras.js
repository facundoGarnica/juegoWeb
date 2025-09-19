export default class Escaleras {
    /**
     * Constructor de la escalera modular
     * @param {Phaser.Scene} scene - Escena donde se agrega
     * @param {Phaser.Physics.Arcade.Sprite} player - Jugador para colisiones
     * @param {number} startX - posición inicial X en píxeles (se convertirá a proporción)
     * @param {number} startY - posición inicial Y en píxeles (se convertirá a proporción)
     * @param {number} stepsCount - cantidad de escalones
     * @param {number} stepWidth - ancho del escalón
     * @param {number} stepHeight - alto del escalón
     * @param {number} offsetX - separación horizontal entre escalones
     * @param {number} offsetY - separación vertical entre escalones
     */
    constructor(scene, player, startX, startY, stepsCount = 10, stepWidth = 68, stepHeight = 25, offsetX = 39, offsetY = 30) {
        this.scene = scene;
        this.player = player;

        // Proporciones relativas para responsive
        this.relStartX = startX / scene.scale.width;
        this.relStartY = startY / scene.scale.height;
        this.relOffsetX = offsetX / scene.scale.width;
        this.relOffsetY = offsetY / scene.scale.height;

        this.stepWidth = stepWidth;
        this.stepHeight = stepHeight;
        this.stepsCount = stepsCount;

        // Crear grupo de escalones
        this.stairs = scene.physics.add.staticGroup();
        this.steps = [];

        this.createStairs(scene.scale.width, scene.scale.height);

        // Collider con lógica one-way
        const tolerance = 12;
        const getPrevBottom = (body) => {
            if (body.prev && body.prev.y !== undefined) {
                return body.prev.y + body.height;
            }
            return body.y + body.height - body.velocity.y;
        };

        this.collider = scene.physics.add.collider(
            player,
            this.stairs,
            null,
            (player, step) => {
                const playerBottom = player.body.y + player.body.height;
                const platformTop = step.body.y;
                const prevBottom = getPrevBottom(player.body);

                if (player.body.blocked.down || player.body.touching.down) return true;

                if (
                    player.body.velocity.y > 0 &&
                    prevBottom <= platformTop &&
                    playerBottom >= platformTop - tolerance
                )
                    return true;

                if (
                    player.body.velocity.y >= 0 &&
                    playerBottom <= platformTop + tolerance
                )
                    return true;

                return false;
            },
            scene
        );
    }

    /**
     * Crear escalones según las proporciones actuales
     */
    createStairs(width, height) {
        this.steps.forEach(step => step.destroy());
        this.steps = [];

        const startX = width * this.relStartX;
        const startY = height * this.relStartY;

        for (let i = 0; i < this.stepsCount; i++) {
            const stepX = startX + i * width * this.relOffsetX;
            const stepY = startY - i * height * this.relOffsetY;

            let step = this.stairs.create(stepX, stepY, 'platform')
                .setDisplaySize(this.stepWidth, this.stepHeight);
            step.refreshBody();

            // Colisiones solo por arriba
            step.body.checkCollision.down = false;
            step.body.checkCollision.left = false;
            step.body.checkCollision.right = false;
            step.body.checkCollision.up = true;

            this.steps.push(step);
        }
    }

    /**
     * 🔑 Responsive: recalcular posiciones de escalones al redimensionar
     */
    resize(width, height) {
        this.createStairs(width, height);
    }
}
