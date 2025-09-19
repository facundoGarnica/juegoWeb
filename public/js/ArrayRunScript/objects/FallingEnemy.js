export default class FallingEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, config = {}) {
        const startX = Phaser.Math.Between(50, scene.scale.width - 50);
        const startY = -50;
        super(scene, startX, startY, 'enemy_falling');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.player = player;
        this.config = Object.assign({
            minSpeed: 500,
            maxSpeed: 1200,
            scale: 1,
            diagonalIntensity: 'high', // 'low', 'medium', 'high', 'random', 'toward_player'
            rotateSprite: true
        }, config);

        this.setScale(this.config.scale);
        this.body.setAllowGravity(false);

        this.relX = startX / scene.scale.width;
        this.relY = startY / scene.scale.height;

        // Inicializamos velocidad y dirección
        this.initMovement();
        this.setDepth(5);
    }

    initMovement() {
        const speed = Phaser.Math.Between(this.config.minSpeed, this.config.maxSpeed);
        let angle;

        switch (this.config.diagonalIntensity) {
            case 'low':
                angle = Phaser.Math.DegToRad(Phaser.Math.Between(75, 105)); // casi vertical
                break;

            case 'medium':
                angle = Phaser.Math.DegToRad(Phaser.Math.Between(45, 135)); // diagonal moderada
                break;

            case 'high':
                angle = Phaser.Math.DegToRad(Phaser.Math.Between(20, 160)); // diagonal intensa
                break;

            case 'random':
                angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 180));
                break;

            case 'toward_player':
                const angleToPlayer = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
                const offset = Phaser.Math.DegToRad(Phaser.Math.Between(-60, 60));
                angle = angleToPlayer + offset;
                break;

            default:
                angle = Phaser.Math.DegToRad(90); // caida vertical
        }

        // Convertimos ángulo a velocidad X/Y
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        this.setVelocity(vx, vy);

        if (this.config.rotateSprite) this.setRotation(angle);
    }

    update() {
        // Destruir si sale de pantalla
        if (
            this.y > this.scene.scale.height + 200 ||
            this.x < -200 || this.x > this.scene.scale.width + 200
        ) {
            this.destroy();
        }
    }

    resize(width, height) {
        this.setPosition(width * this.relX, height * this.relY);
        // Mantener movimiento original sin recalcular velocidad aleatoria
        // this.initMovement(); // <- no lo llamamos para que no cambie al redimensionar
    }
}
