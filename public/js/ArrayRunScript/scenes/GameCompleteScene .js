export default class GameCompleteScene extends Phaser.Scene {
    constructor() {
        super('GameCompleteScene');
    }

    init(data) {
        this.puntaje = data.puntaje || 0;
        this.tiempo = data.tiempo || 0;
        this.monedas = data.monedas || 0;
        this.totalMonedas = data.totalMonedas || 0;
        this.vidaActual = data.vidaActual || 0;
        this.vidaTotal = data.vidaTotal || 0;
        this.level = data.level || 'Level1';
    }

    preload() {
        this.createPixelTextures();
    }

    createPixelTextures() {
        const pixelBg = this.add.graphics();
        const colors = [0x0a1a0a, 0x0d2a0d, 0x0f3a0f];
        for (let x = 0; x < 32; x++) {
            for (let y = 0; y < 24; y++) {
                const color = colors[Math.floor(Math.random() * colors.length)];
                pixelBg.fillStyle(color);
                pixelBg.fillRect(x * 16, y * 16, 16, 16);
            }
        }
        pixelBg.generateTexture('pixelBg', 512, 384);
        pixelBg.destroy();

        const scanlineTexture = this.add.graphics();
        scanlineTexture.fillStyle(0x000000, 0.3);
        for (let i = 0; i < this.scale.height; i += 4) {
            scanlineTexture.fillRect(0, i, this.scale.width, 2);
        }
        scanlineTexture.generateTexture('scanlines', this.scale.width, this.scale.height);
        scanlineTexture.destroy();
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

        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x000000, 0.5);

        // Contenedor principal
        const modalBox = this.add.container(this.scale.width / 2, this.scale.height / 2);

        // Título principal
        const title = this.add.text(0, -150, 'LEVEL COMPLETE!', {
            fontFamily: 'monospace',
            fontSize: '40px',
            color: '#00ff41',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Stats
        const statsContainer = this.add.container(0, -50);
        const statsTitle = this.add.text(0, -40, '═══ FINAL STATS ═══', {
            fontFamily: 'monospace',
            fontSize: '20px',
            color: '#00ff41'
        }).setOrigin(0.5);

        const puntajeText = this.add.text(0, -10, `SCORE: ${this.puntaje.toString().padStart(6, '0')}`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const tiempoText = this.add.text(0, 20, `TIME: ${this.tiempo.toString().padStart(3, '0')} SEC`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const monedasText = this.add.text(0, 50, `COINS: ${this.monedas}/${this.totalMonedas}`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#ffdd00'
        }).setOrigin(0.5);

        const vidaText = this.add.text(0, 80, `LIFE: ${this.vidaActual}/${this.vidaTotal}`, {
            fontFamily: 'monospace',
            fontSize: '22px',
            color: '#ff4444'
        }).setOrigin(0.5);

        statsContainer.add([statsTitle, puntajeText, tiempoText, monedasText, vidaText]);

        // Botones
        const spacing = 40;
        const baseY = 120; // desde el final de stats

        const btnNextLevel = this.createRetroButton(0, baseY, '→ NEXT LEVEL', '#00aaff');
        const btnReiniciar = this.createRetroButton(0, baseY + spacing, '↻ RESTART LEVEL (R)', '#00ff41');
        const btnMenu = this.createRetroButton(0, baseY + spacing * 2, '⌂ MAIN MENU', '#ffaa00');

        // Frame dinámico según contenido
        const totalHeight = baseY + spacing * 3 + 230;
        const modalFrame = this.createPixelFrame(0, 0, 400, totalHeight);

        modalBox.add([modalFrame, title, statsContainer, btnNextLevel, btnReiniciar, btnMenu]);

        this.add.image(this.scale.width / 2, this.scale.height / 2, 'scanlines').setAlpha(0.5);

        modalBox.setScale(0);
        modalBox.setAlpha(0);
        this.tweens.add({
            targets: modalBox,
            scale: 1,
            alpha: 1,
            duration: 500,
            ease: 'Bounce.Out'
        });

        // Botón NEXT LEVEL oculto hasta comprobar existencia
        btnNextLevel.setVisible(false);
        (async () => {
            try {
                const response = await fetch(levelsByGameUrl);
                if (!response.ok) throw new Error('Error al traer niveles');
                const data = await response.json();
                const numeroNivel = window.CURRENT_LEVEL_ID;
                const siguienteNivel = data.levels.find(l => l.lvlNumber === numeroNivel + 1);
                if (siguienteNivel) {
                    btnNextLevel.setVisible(true);
                    btnNextLevel.on('pointerdown', async () => {
                        await this.saveScoreToServer();
                        if (this.sound.getAll().length > 0) this.sound.stopAll();
                        const playerId = window.CURRENT_PLAYER.id;
                        const CURRENT_GAME_ID = window.CURRENT_GAME_ID;
                        const personajeSeleccionado = window.CURRENT_PLAYER_SPRITE;
                        const urlDestino = `/juegoweb/public/index.php/nivelarray/${siguienteNivel.lvlNumber}/${playerId}/${CURRENT_GAME_ID}`;
                        window.location.href = urlDestino;
                    });
                }
            } catch (err) {
                console.error('Error comprobando siguiente nivel:', err);
            }
        })();

        btnReiniciar.on('pointerdown', () => this.restartLevel());
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.keyR.on('down', () => this.restartLevel());

        btnMenu.on('pointerdown', async () => {
            await this.saveScoreToServer();
            if (this.sound.getAll().length > 0) this.sound.stopAll();
            window.location.href = MENU_URL;
        });
    }

    async restartLevel() {
        await this.saveScoreToServer();
        if (this.sound.getAll().length > 0) this.sound.stopAll();
        this.scene.stop();
        this.scene.start(this.level);
    }

    createPixelFrame(x, y, width, height) {
        const frame = this.add.graphics();
        frame.fillStyle(0x0a0a0a, 0.9);
        frame.fillRect(x - width / 2, y - height / 2, width, height);
        frame.fillStyle(0x00ff41);
        frame.fillRect(x - width / 2, y - height / 2, width, 6);
        frame.fillRect(x - width / 2, y + height / 2 - 6, width, 6);
        frame.fillRect(x - width / 2, y - height / 2, 6, height);
        frame.fillRect(x + width / 2 - 6, y - height / 2, 6, height);
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
        return button;
    }

    async saveScoreToServer() {
        if (typeof SAVE_LEVEL_PATH === 'undefined' || typeof CURRENT_PLAYER_ID === 'undefined' || typeof CURRENT_LEVEL_ID === 'undefined') {
            console.error('Variables de guardado no definidas correctamente');
            return null;
        }

        const data = {
            playerId: CURRENT_PLAYER_ID,
            levelId: CURRENT_LEVEL_ID,
            puntosObtenidos: this.puntaje,
            tiempoUsado: this.tiempo,
            completado: true
        };

        try {
            const response = await fetch(SAVE_LEVEL_PATH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }
            return await response.json();
        } catch (err) {
            console.error('Error guardando score:', err);
            return null;
        }
    }
}
