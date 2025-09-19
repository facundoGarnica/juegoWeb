export default class PuntoGuardado {
    /**
     * Constructor de un punto de guardado (checkpoint)
     * @param {Phaser.Scene} scene - Escena donde se agrega
     * @param {number} x - Posición inicial X en píxeles
     * @param {number} y - Posición inicial Y en píxeles
     * @param {number} width - Ancho del checkpoint
     * @param {number} height - Alto del checkpoint
     * @param {Phaser.Physics.Arcade.Sprite} player - Jugador para colisión
     */
    constructor(scene, x, y, width = 180, height = 200, player) {
        this.scene = scene;
        this.player = player;

        // Guardar proporciones para resize
        this.relX = x / scene.scale.width;
        this.relY = y / scene.scale.height;
        this.width = width;
        this.height = height;

        // Crear zona de checkpoint
        this.zone = scene.add.zone(x, y, width, height);
        scene.physics.add.existing(this.zone);
        this.zone.body.setAllowGravity(false);
        this.zone.body.setImmovable(true);



        // Colisión con el jugador
        this.collider = scene.physics.add.overlap(this.player, this.zone, () => {
            if (this.onReach) this.onReach(); // Callback opcional
        });
    }

    /**
     * Callback al llegar al checkpoint
     * @param {function} callback
     */
    setCallback(callback) {
        this.onReach = callback;
    }

    /**
     * Reubicar el checkpoint en caso de redimension
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        const newX = width * this.relX;
        const newY = height * this.relY;

        this.zone.setPosition(newX, newY);

        // Actualizar rectángulo visible
        this.graphics.clear();
        this.graphics.fillStyle(0x00ff00, 0.5);
        this.graphics.fillRect(
            newX - this.width / 2,
            newY - this.height / 2,
            this.width,
            this.height
        );
    }
}
