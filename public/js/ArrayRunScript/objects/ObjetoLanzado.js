// ObjetoLanzado.js
export default class ObjetoLanzado extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, '200_ok');
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setActive(false);
        this.setVisible(false);
    }

    lanzar(x, y, velocidadY) {
        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);
        this.body.setVelocity(0, velocidadY);
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

        if (this.y > this.scene.scale.height + 50) {
            this.setActive(false);
            this.setVisible(false);
            this.body.stop();
        }
    }
}
