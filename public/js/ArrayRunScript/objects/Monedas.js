export default class Monedas extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'moneda') {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this, true);

        this.setOrigin(0.5, 0.5);
        this.setImmovable(true);
        // Podés poner un tween para rotar
        scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 1000,
            repeat: -1
        });

        this.scene = scene;
    }

    collect(player) {
        player.puntaje += 1;

       /* if (this.scene.sound) {
            this.scene.sound.play('coin_sound', { volume: 0.5 });
        }*/

        this.destroy();
    }

    update(time, delta) {
        // Efecto flotante
        this.y += Math.sin(time * 0.005) * 0.1;
    }
}
