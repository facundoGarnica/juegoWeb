export default class Charco extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'charco');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.setOrigin(0.5, 0.5);
        
        this.scene = scene;
        this.fallSpeed = 5500; // velocidad a la que cae el jugador
    }

    setupCollision(player) {
        this.scene.physics.add.overlap(player, this, () => {
            this.onPlayerTouch(player);
        });
    }

    onPlayerTouch(player) {
        if (player.isFalling) return; // evitar múltiples triggers
        player.isFalling = true;
        
        // Detener al jugador y deshabilitar control
        player.body.setVelocity(0, 0);
        player.body.allowGravity = false;
        
        // Tween rápido para caer instantáneamente fuera de la pantalla
        this.scene.tweens.add({
            targets: player,
            y: this.scene.scale.height + 200, // cae fuera de la pantalla
            duration: 800,                     // caída rápida
            ease: 'Cubic.easeIn',
            onComplete: () => {
                // Desactivar jugador y reiniciar escena
                player.setActive(false);
                player.setVisible(false);
                player.body.enable = false;
                this.scene.time.delayedCall(500, () => {
                    this.scene.scene.restart();
                });
            }
        });
    }
}
