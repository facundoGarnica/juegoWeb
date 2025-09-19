export default class Interruptor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'interruptor_no', baseScale = 0.05) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false); 
        this.body.setImmovable(true);

        this.activated = false;
        this.llave = null; // referencia a la llave

        // Guardamos proporción para responsive
        this.relX = x / scene.scale.width;
        this.relY = y / scene.scale.height;

        // Escala base
        this.baseScale = baseScale;
        this.setScale(this.baseScale);
    }

    setLlave(llave) {
        this.llave = llave;
    }

    activate() {
        if (this.activated) return;

        this.setTexture('interruptor_si');
        this.activated = true;

        // lógica extra si querés
        // this.scene.abrirPuerta();
    }

    /**
     * 🔑 Método responsive: reposiciona y mantiene escala
     * @param {number} width - ancho de pantalla
     * @param {number} height - alto de pantalla
     */
    resize(width, height) {
        this.setPosition(width * this.relX, height * this.relY);
        this.setScale(this.baseScale); // mantiene proporción original
    }
}
