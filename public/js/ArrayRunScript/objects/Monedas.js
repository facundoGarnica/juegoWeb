export default class Monedas extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'moneda', baseScale = 3) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this, true); // cuerpo estático

        this.setOrigin(0.5, 0.5);
        this.setImmovable(true);

        // Tween para rotar
        scene.tweens.add({
            targets: this,
            angle: 360,
            duration: 1000,
            repeat: -1
        });

        this.scene = scene;

        // Posición relativa
        this.relX = x / scene.scale.width;
        this.relY = y / scene.scale.height;

        // Escala relativa - CORREGIDA
        this.baseScale = baseScale;
        // Guardar el tamaño original del sprite ANTES de escalar
        const originalWidth = this.width;
        const originalHeight = this.height;

        // Calcular cuánto del ancho/alto de pantalla debe ocupar
        this.relWidth = (originalWidth * baseScale) / scene.scale.width;
        this.relHeight = (originalHeight * baseScale) / scene.scale.height;

        // Aplicar escala inicial
        this.setScale(this.baseScale);
    }

    collect(player) {
        player.puntaje += 1;
        this.destroy();
    }

    update(time, delta) {
        // Efecto flotante
        this.y += Math.sin(time * 0.005) * 0.1;
    }

    resize(width, height) {
        // Reposicionar
        this.setPosition(width * this.relX, height * this.relY);

        // Calcular nueva escala basada en la proporción de la pantalla
        const scaleX = width * this.relWidth / this.width;
        const scaleY = height * this.relHeight / this.height;

        // Usar la escala promedio para mantener proporciones
        const newScale = (scaleX + scaleY) / 2;
        this.setScale(newScale);

        // Actualizar cuerpo de física
        if (this.body) {
            this.body.setSize(this.width * newScale, this.height * newScale);
        }
    }
}