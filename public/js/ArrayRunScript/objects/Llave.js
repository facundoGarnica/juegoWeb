// Llave.js
export default class Llave extends Phaser.Physics.Arcade.Sprite {
    /**
     * Constructor de la llave
     * @param {Phaser.Scene} scene - Escena donde se agrega la llave
     * @param {number} x - Posición horizontal inicial
     * @param {number} y - Posición vertical inicial
     * @param {string} texture - Nombre de la textura del sprite
     */
    constructor(scene, x, y, texture = 'llave') {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.agarrada = false;

        // Posición relativa
        this.relX = x / scene.scale.width;
        this.relY = y / scene.scale.height;

        // Escala relativa
        this.baseScale = 0.05; // la que le pones en Level1
        this.relScaleX = this.baseScale; // puedes usar solo un valor para mantener proporción
        this.setScale(this.baseScale);
    }

    /**
     * Recoger la llave
     */
    recoger() {
        if (this.agarrada) return;
        this.agarrada = true;
        this.setVisible(false);
        this.setActive(false);
    }

    /**
     * 🔑 Método responsive: reajusta posición y tamaño según pantalla
     * @param {number} width - Nuevo ancho de la pantalla
     * @param {number} height - Nuevo alto de la pantalla
     */
    resize(width, height) {
        this.setPosition(width * this.relX, height * this.relY);
        this.setScale(this.relScaleX); // Mantiene la proporción original
}
}