// Llave.js
export default class Llave extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'llave') {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // No caer
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);

        this.agarrada = false;
    }

    recoger() {
        if (this.agarrada) return;

        this.agarrada = true;
        this.setVisible(false);
        this.setActive(false);
    }
}
