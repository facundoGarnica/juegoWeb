export default class GameCompleteScene extends Phaser.Scene {
    constructor() {
        super('GameCompleteScene');
    }

    init(data) {
        this.puntaje = data.puntaje || 0;
        this.tiempo = data.tiempo || 0;
    }

    preload() {
        this.createPixelTextures();
    }

    createPixelTextures() {
        // Patrón de scanlines
        const scanlineTexture = this.add.graphics();
        scanlineTexture.fillStyle(0x000000, 0.3);
        for (let i = 0; i < this.scale.height; i += 4) {
            scanlineTexture.fillRect(0, i, this.scale.width, 2);
        }
        scanlineTexture.generateTexture('scanlines', this.scale.width, this.scale.height);
        scanlineTexture.destroy();

        // Fondo pixelado
        const pixelBg = this.add.graphics();
        const colors = [0x0a1a0a, 0x0d2a0d, 0x0f3a0f]; // tonos verdes
        for (let x = 0; x < 32; x++) {
            for (let y = 0; y < 24; y++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                pixelBg.fillStyle(color);
                pixelBg.fillRect(x * 16, y * 16, 16, 16);
            }
        }
        pixelBg.generateTexture('pixelBg', 512, 384);
        pixelBg.destroy();

        // Botones pixel art
        this.createPixelButton('btnTexture', 200, 50, 0x00ff41, 0x005f20);
        this.createPixelButton('btnTextureHover', 200, 50, 0x33ff66, 0x00ff41);
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
        const bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'pixelBg').setOrigin(0);
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
            0x000000, 0.5
        );

        const modalBox = this.add.container(this.scale.width / 2, this.scale.height / 2);
        const modalFrame = this.createPixelFrame(0, 0, 400, 350);

        // Título "COMPLETE!" en verde neon
        const title = this.add.text(0, -120, 'LEVEL COMPLETE!', {
            fontFamily: 'monospace',
            fontSize: '48px',
            color: '#00ff41',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Efecto flicker
        this.time.addEvent({
            delay: 100,
            callback: () => {
                if (Math.random() < 0.1) {
                    title.setColor('#33ff66');
                    title.x = Phaser.Math.Between(-2, 2);
                    this.time.delayedCall(50, () => {
                        title.setColor('#00ff41');
                        title.x = 0;
                    });
                }
            },
            loop: true
        });

        // Estadísticas
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

        // Botones
        const btnReiniciar = this.createRetroButton(0, 90, '↻ RESTART LEVEL', '#00ff41');
        const btnMenu = this.createRetroButton(0, 150, '⌂ MAIN MENU', '#33ff66');

        btnReiniciar.on('pointerdown', () => {
            this.playSelectSound();
            this.scene.stop();
            this.scene.stop('Level1');
            this.scene.start('Level1');
        });

        btnMenu.on('pointerdown', () => {
            this.playSelectSound();
            this.scene.stop();
            this.scene.stop('Level1');
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

    createPixelFrame(x, y, width, height) {
        const frame = this.add.graphics();
        frame.fillStyle(0x0a0a0a, 0.9);
        frame.fillRect(x - width/2, y - height/2, width, height);

        const borderWidth = 6;
        frame.fillStyle(0x00ff41);
        frame.fillRect(x - width/2, y - height/2, width, borderWidth);
        frame.fillRect(x - width/2, y + height/2 - borderWidth, width, borderWidth);
        frame.fillRect(x - width/2, y - height/2, borderWidth, height);
        frame.fillRect(x + width/2 - borderWidth, y - height/2, borderWidth, height);

        const cornerSize = 20;
        frame.fillStyle(0x33ff66);
        frame.fillRect(x - width/2, y - height/2, cornerSize, cornerSize);
        frame.fillRect(x + width/2 - cornerSize, y - height/2, cornerSize, cornerSize);
        frame.fillRect(x - width/2, y + height/2 - cornerSize, cornerSize, cornerSize);
        frame.fillRect(x + width/2 - cornerSize, y + height/2 - cornerSize, cornerSize, cornerSize);

        return frame;
    }

    createRetroButton(x, y, text, color) {
        const button = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, 250, 35, 0x1a1a1a)
            .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color);
        const label = this.add.text(0, 0, text, {
            fontFamily: 'monospace',
            fontSize: '18px',
            color: color
        }).setOrigin(0.5);

        button.add([bg, label]);
        button.setSize(250, 35);
        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => {
            bg.setFillStyle(Phaser.Display.Color.HexStringToColor(color).color, 0.2);
            label.setColor('#ffffff');
        });

        button.on('pointerout', () => {
            bg.setFillStyle(0x1a1a1a);
            label.setColor(color);
        });

        button.on('pointerdown', () => {
            button.setScale(0.95);
            this.time.delayedCall(100, () => button.setScale(1));
        });

        return button;
    }

    createPixelParticles() {
        for (let i = 0; i < 20; i++) {
            const particle = this.add.rectangle(
                Phaser.Math.Between(0, this.scale.width),
                Phaser.Math.Between(0, this.scale.height),
                4, 4,
                Phaser.Display.Color.GetColor(
                    Phaser.Math.Between(0, 100),
                    Phaser.Math.Between(200, 255),
                    Phaser.Math.Between(0, 100)
                )
            ).setAlpha(0.6);

            this.tweens.add({
                targets: particle,
                y: particle.y - this.scale.height - 50,
                duration: Phaser.Math.Between(5000, 10000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 5000)
            });

            this.tweens.add({
                targets: particle,
                alpha: 0.2,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.InOut'
            });
        }
    }

    playSelectSound() {
        // Agregar sonido de selección si quieres
    }
}
