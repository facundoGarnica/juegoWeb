import AgarrarObjeto from "./AgarrarObjeto.js";

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player_idle');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.body.setGravityY(2800);

        // CONFIGURAR EL COLLIDER DEL JUGADOR
        // Hacer el collider más pequeño y centrado en los pies del jugador
        const playerWidth = 24;
        const playerHeight = 32;

        this.body.setSize(playerWidth, playerHeight);
        // Centrar el collider horizontalmente y colocarlo en la parte inferior
        this.body.setOffset(
            (this.width - playerWidth) / 2, // centrar horizontalmente
            this.height - playerHeight // colocar en la parte inferior (pies)
        );

        this.speed = window.CURRENT_PLAYER.speed;
        this.jumpSpeed = window.CURRENT_PLAYER.jumpSpeed;
        this.facingRight = true;
        this.vidaTotal = 50//window.CURRENT_PLAYER.vida_maxima;
        this.vidaActual = this.vidaTotal;
        this.invulnerable = false;
        this.invulnerableTime = 600;
        this.puntaje = 0;
        this.scene = scene;
        this.isFalling = false; // Asegurarse de que existe esta propiedad

        this.interactKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.throwKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.throwForce = 400;
        this.agarrarSystem = new AgarrarObjeto(this, scene, this.interactKey, this.throwKey, this.throwForce);
    }

    move(cursors) {
        // Si el jugador se está hundiendo, no puede moverse
        if (this.isFalling) {
            this.setVelocityX(0);
            return;
        }

        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.anims.play('walk_right', true);
            this.setFlipX(true);
            this.facingRight = false;
        } else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.anims.play('walk_right', true);
            this.setFlipX(false);
            this.facingRight = true;
        } else {
            this.setVelocityX(0);
            this.anims.play('idle', true);
            this.setFlipX(!this.facingRight);
        }

        if (cursors.up.isDown && this.body.blocked.down) {
            this.setVelocityY(-this.jumpSpeed);
        }
    }

    update(delta) {
        if (this.scene.cursors) this.move(this.scene.cursors);
        this.agarrarSystem.update(delta);
    }

    takeDamage(amount = 1) {
        if (this.invulnerable) return;
        this.vidaActual -= amount;
        this.vidaActual = Phaser.Math.Clamp(this.vidaActual, 0, this.vidaTotal);
        this.invulnerable = true;
        this.setTint(0xff0000);
        this.scene.time.delayedCall(this.invulnerableTime, () => {
            this.invulnerable = false;
            this.clearTint();
        });

        if (this.vidaActual <= 0) {
            this.scene.scene.start('GameOverScene', {
                puntaje: this.puntaje,
                tiempo: Math.floor(this.scene.time.now / 1000)
            });
        }
    }

    resize(width, height) {
        this.setPosition(width * 0.9, height * 0.2);
    }
}