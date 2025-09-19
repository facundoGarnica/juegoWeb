export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    /**
     * Constructor del enemigo
     * @param {Phaser.Scene} scene - Escena donde se agrega el enemigo
     * @param {number} x - Posición horizontal inicial (en coordenadas absolutas o proporcionales)
     * @param {number} y - Posición vertical inicial
     * @param {string} texture - Nombre de la textura del sprite
     * @param {number} minX - Límite izquierdo del patrullaje
     * @param {number} maxX - Límite derecho del patrullaje
     * @param {number} speed - Velocidad de movimiento
     */
    constructor(scene, x, y, texture = 'enemy', minX = 0, maxX = scene.scale.width, speed = 100) {
        super(scene, x, y, texture);

        // Agregar a la escena y habilitar físicas
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Guardar rango de patrulla y velocidad
        this.minX = minX;
        this.maxX = maxX;
        this.speed = speed;

        // Guardamos la proporción inicial para hacer responsive
        this.relX = x / scene.scale.width;   // porcentaje horizontal
        this.relY = y / scene.scale.height;  // porcentaje vertical

        // Movimiento inicial
        this.setVelocityX(this.speed);
        this.setCollideWorldBounds(false); // no limitar al borde de la pantalla
    }

    // Método para patrullar entre minX y maxX
    patrol() {
        if (this.x <= this.minX) {
            this.setVelocityX(this.speed);   // ir a la derecha
            this.setFlipX(false);            // mirar a la derecha
        } 
        else if (this.x >= this.maxX) {
            this.setVelocityX(-this.speed);  // ir a la izquierda
            this.setFlipX(true);             // mirar a la izquierda
        }
    }

    // Actualizar rango de patrullaje
    updateRange(minX, maxX) {
        this.minX = minX;
        this.maxX = maxX;
    }

    /**
     * 🔑 Método responsive: reajusta posición y rango de patrulla
     */
    resize(width, height) {
        // Reposicionar según proporciones guardadas
        this.setPosition(width * this.relX, height * this.relY);

        // Reajustar patrulla proporcionalmente
        this.updateRange(0, width * 0.8);
    }
}
