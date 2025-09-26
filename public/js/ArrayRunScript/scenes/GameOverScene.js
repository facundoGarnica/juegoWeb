export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.puntaje = data.puntaje || 0;
        this.tiempo = data.tiempo || 0;
        this.level = data.level || 'Level1'; // Nivel a reiniciar
    }

    preload() {
        this.createPixelTextures();
    }

    createPixelTextures() {
        const scanlineTexture = this.add.graphics();
        scanlineTexture.fillStyle(0x000000, 0.3);
        for (let i = 0; i < this.scale.height; i += 4) {
            scanlineTexture.fillRect(0, i, this.scale.width, 2);
        }
        scanlineTexture.generateTexture('scanlines', this.scale.width, this.scale.height);
        scanlineTexture.destroy();

        const pixelBg = this.add.graphics();
        const colors = [0x1a1a2e, 0x16213e, 0x0f3460];
        for (let x = 0; x < 32; x++) {
            for (let y = 0; y < 24; y++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                pixelBg.fillStyle(color);
                pixelBg.fillRect(x * 16, y * 16, 16, 16);
            }
        }
        pixelBg.generateTexture('pixelBg', 512, 384);
        pixelBg.destroy();

        this.createPixelButton('btnTexture', 200, 50, 0x4a90e2, 0x2c5282);
        this.createPixelButton('btnTextureHover', 200, 50, 0x5ba0f2, 0x4a90e2);
    }

    createPixelButton(key, width, height, fillColor, borderColor) {
        const btn = this.add.graphics();
        btn.fillStyle(borderColor);
        btn.fillRect(0, 0, width, height);
        btn.fillStyle(fillColor);
        btn.fillRect(4, 4, width - 8, height - 8);
        btn.fillStyle(0xffffff, 0.3);
        btn.fillRect(4, 4, width - 8, 4);
        btn.fillRect(4, 4, 4, height - 8);
        btn.fillStyle(0x000000, 0.3);
        btn.fillRect(4, height - 8, width - 8, 4);
        btn.fillRect(width - 8, 4, 4, height - 8);
        btn.generateTexture(key, width, height);
        btn.destroy();
    }

    create() {
        const bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'pixelBg')
            .setOrigin(0);

        this.tweens.add({
            targets: bg,
            tilePositionX: 50,
            duration: 10000,
            repeat: -1,
            ease: 'Linear'
        });

        const overlay = this.add.rectangle(
            this.scale.width / 2, this.scale.height / 2,
            this.scale.width, this.scale.height,
            0x000000, 0.6
        );

        const modalBox = this.add.container(this.scale.width / 2, this.scale.height / 2);
        const modalFrame = this.createPixelFrame(0, 0, 400, 350);

        const title = this.add.text(0, -120, 'GAME OVER', {
            fontFamily: 'monospace',
            fontSize: '48px',
            color: '#ff3333',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.time.addEvent({
            delay: 100,
            callback: () => {
                if (Math.random() < 0.1) {
                    title.setColor('#ff0000');
                    title.x = Phaser.Math.Between(-2, 2);
                    this.time.delayedCall(50, () => {
                        title.setColor('#ff3333');
                        title.x = 0;
                    });
                }
            },
            loop: true
        });

        const statsContainer = this.add.container(0, -20);
        const statsTitle = this.add.text(0, -30, '═══ FINAL STATS ═══', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#00ff41'
        }).setOrigin(0.5);

        const puntajeText = this.add.text(0, 10, `SCORE: ${this.puntaje.toString().padStart(6, '0')}`, {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const tiempoText = this.add.text(0, 40, `TIME:  ${this.tiempo.toString().padStart(3, '0')} SEC`, {
            fontFamily: 'monospace',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        statsContainer.add([statsTitle, puntajeText, tiempoText]);

        const btnReiniciar = this.createRetroButton(0, 90, '↻ RESTART LEVEL (R)', '#00ff41');
        const btnMenu = this.createRetroButton(0, 150, '⌂ MAIN MENU', '#ffaa00');

        // Tecla R para reiniciar
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyR.on('down', () => this.restartLevel());

        // Botón para reiniciar
        btnReiniciar.on('pointerdown', () => this.restartLevel());

        // Botón para ir al menú
        btnMenu.on('pointerdown', () => {
            this.playSelectSound();
            this.scene.stop();
        window.location.href = MENU_URL;
    });

        modalBox.add([modalFrame, title, statsContainer, btnReiniciar, btnMenu]);

        const scanlines = this.add.image(this.scale.width / 2, this.scale.height / 2, 'scanlines')
            .setAlpha(0.5);

        modalBox.setScale(0);
        modalBox.setAlpha(0);

        this.tweens.add({
            targets: modalBox,
            scale: 1,
            alpha: 1,
            duration: 500,
            ease: 'Bounce.Out'
        });

        this.tweens.add({
            targets: modalFrame,
            alpha: 0.8,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.InOut'
        });

        this.createPixelParticles();
    }

    // Nuevo método para reiniciar nivel
    restartLevel() {
        this.playSelectSound();
        this.scene.stop();
        this.scene.start(this.level);
    }


    createPixelFrame(x, y, width, height) {
        const frame = this.add.graphics();
        frame.fillStyle(0x0a0a0a, 0.9);
        frame.fillRect(x - width/2, y - height/2, width, height);

        const borderWidth = 6;
        frame.fillStyle(0x00ff41);
        frame.fillRect(x - width / 2, y - height / 2, width, borderWidth); // top
        frame.fillRect(x - width / 2, y + height / 2 - borderWidth, width, borderWidth); // bottom
        frame.fillRect(x - width / 2, y - height / 2, borderWidth, height); // left
        frame.fillRect(x + width / 2 - borderWidth, y - height / 2, borderWidth, height); // right

        const cornerSize = 20;
        frame.fillStyle(0xffaa00);
        frame.fillRect(x - width / 2, y - height / 2, cornerSize, cornerSize); // top-left
        frame.fillRect(x + width / 2 - cornerSize, y - height / 2, cornerSize, cornerSize); // top-right
        frame.fillRect(x - width / 2, y + height / 2 - cornerSize, cornerSize, cornerSize); // bottom-left
        frame.fillRect(x + width / 2 - cornerSize, y + height / 2 - cornerSize, cornerSize, cornerSize); // bottom-right

        // Enter key reinicia el nivel actual
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.enterKey.on('down', () => {
            this.playSelectSound();
            this.scene.stop();
            this.scene.start(this.level);
        });

        return frame;
    }

    createRetroButton(x, y, text, color) {
        const button = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, 250, 35, 0x1a1a1a)
            .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color);
        const label = this.add.text(0, 0, text, { fontFamily: 'monospace', fontSize: '18px', color }).setOrigin(0.5);
        button.add([bg, label]);
        button.setSize(250, 35);
        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => { bg.setFillStyle(Phaser.Display.Color.HexStringToColor(color).color, 0.2); label.setColor('#ffffff'); });
        button.on('pointerout', () => { bg.setFillStyle(0x1a1a1a); label.setColor(color); });
        button.on('pointerdown', () => { button.setScale(0.95); this.time.delayedCall(100, () => button.setScale(1)); });

        return button;
    }

    createPixelParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = this.add.rectangle(
                Phaser.Math.Between(0, this.scale.width),
                Phaser.Math.Between(0, this.scale.height),
                4, 4,
                Phaser.Display.Color.GetColor(
                    Phaser.Math.Between(0, 255),
                    Phaser.Math.Between(100, 255),
                    Phaser.Math.Between(0, 100)
                )
            ).setAlpha(0.6);

            this.tweens.add({ targets: particle, y: particle.y - this.scale.height - 50, duration: Phaser.Math.Between(5000, 10000), repeat: -1, delay: Phaser.Math.Between(0, 5000) });
            this.tweens.add({ targets: particle, alpha: 0.2, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.InOut' });
        }
    }

    playSelectSound() {
        // Agregar sonido si se desea
    }
}
