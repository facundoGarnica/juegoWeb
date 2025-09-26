// Paloma.js
export default class Paloma extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, config = {}) {
        // Posición inicial: fuera de la pantalla a la derecha
        const startX = scene.scale.width + 50;
        const startY = Phaser.Math.Between(50, scene.scale.height - 50);
        super(scene, startX, startY, 'paloma');

        this.scene = scene;
        this.player = player;

        // Configuración
        this.speed = config.speed || 150;         // velocidad horizontal
        this.damage = config.damage || 1;
        this.amplitude = config.amplitude || 50;  // altura del zigzag
        this.frequency = config.frequency || 0.002; // velocidad del zigzag

        this.startY = startY; // posición vertical inicial

        // Para el movimiento zigzagueante
        this.startTime = scene.time.now;
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Mover horizontalmente (hacia la izquierda)
        this.setVelocityX(-this.speed);

        // Movimiento zigzagueante vertical
        this.y = this.startY + this.amplitude * Math.sin(
            this.frequency * (time - this.startTime) * 2 * Math.PI
        );

        // Si sale por la izquierda, reiniciar
        if (this.x < -50) {
            this.resetPosition(time);
        }
    }

    resetPosition(time = 0) {
        this.x = this.scene.scale.width + 50;
        this.startY = Phaser.Math.Between(50, this.scene.scale.height - 50);
        this.startTime = time || this.scene.time.now;
    }
}
