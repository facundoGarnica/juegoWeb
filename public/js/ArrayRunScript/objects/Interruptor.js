export default class Interruptor extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'interruptor_no');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false); 
        this.body.setImmovable(true);

        this.activated = false;
        this.llave = null; // referencia a la llave
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
}
