export default class Pause extends Phaser.Scene {
    constructor() {
        super('Pause');
    }

    create() {
        // Overlay semitransparente
        const overlay = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.5
        ).setOrigin(0.5)
         .setScrollFactor(0)
         .setDepth(1000);

        // Contenedor del modal
        const modalBox = this.add.container(this.scale.width / 2, this.scale.height / 2);
        modalBox.setDepth(1001);

        // Marco pixel art simple
        const frame = this.add.graphics();
        frame.fillStyle(0x0a0a0a, 0.9);
        frame.fillRect(-150, -100, 300, 200);
        frame.lineStyle(2, 0x00ff41);
        frame.strokeRect(-150, -100, 300, 200);

        // Texto
        const title = this.add.text(0, -50, 'PAUSE', {
            fontFamily: 'monospace',
            fontSize: '32px',
            color: '#00ff41',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Botones
        const resumeBtn = this.createButton(0, 0, 'RESUME', '#00ff41');
        const menuBtn = this.createButton(0, 60, 'MAIN MENU', '#ffaa00');

        // Eventos de click
        resumeBtn.on('pointerdown', () => this.resumeGame());
        menuBtn.on('pointerdown', () => this.gotoMenu());

        modalBox.add([frame, title, resumeBtn, menuBtn]);

        // Tecla ESC para reanudar
        this.input.keyboard.on('keydown-ESC', () => {
            this.resumeGame();
        });
    }

    resumeGame() {
        this.scene.stop();           // cerrar pausa
        this.scene.resume('Level1'); // reanudar Level1
    }

    gotoMenu() {
        this.scene.stop('Level1');  // detener nivel
        this.scene.stop();           // cerrar pausa
        window.location.href = MENU_URL;
    }

    createButton(x, y, text, color) {
        const button = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, 200, 40, 0x1a1a1a)
            .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color);
        const label = this.add.text(0, 0, text, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: color
        }).setOrigin(0.5);
        button.add([bg, label]);
        button.setSize(200, 40);
        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => {
            bg.setFillStyle(Phaser.Display.Color.HexStringToColor(color).color, 0.2);
            label.setColor('#ffffff');
        });
        button.on('pointerout', () => {
            bg.setFillStyle(0x1a1a1a);
            label.setColor(color);
        });

        return button;
    }
}
