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
    }

    preload() {
        this.createPixelTextures();
    }

    createPixelTextures() {
        // Fondo oscuro con "estrellas" aleatorias
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

        // Scanlines
        const scanlineTexture = this.add.graphics();
        scanlineTexture.fillStyle(0x000000, 0.3);
        for (let i = 0; i < this.scale.height; i += 4) {
            scanlineTexture.fillRect(0, i, this.scale.width, 2);
        }
        scanlineTexture.generateTexture('scanlines', this.scale.width, this.scale.height);
        scanlineTexture.destroy();
    }

    create() {
        // Fondo con efecto estrellas
        const bg = this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'pixelBg').setOrigin(0);
        this.tweens.add({
            targets: bg,
            tilePositionX: 50,
            duration: 10000,
            repeat: -1,
            ease: 'Linear'
        });

        // Overlay oscuro
        const overlay = this.add.rectangle(
            this.scale.width / 2, this.scale.height / 2,
            this.scale.width, this.scale.height,
            0x000000, 0.5
        );

        // Modal container
        const modalBox = this.add.container(this.scale.width / 2, this.scale.height / 2);

        // Frame
        const modalFrame = this.createPixelFrame(0, 0, 400, 350);

        // Title
        const title = this.add.text(0, -120, 'LEVEL COMPLETE!', {
            fontFamily: 'monospace',
            fontSize: '40px',
            color: '#00ff41',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Stats
        const statsContainer = this.add.container(0, -20);
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

        // Buttons
        const btnReiniciar = this.createRetroButton(0, 130, '↻ RESTART LEVEL', '#00ff41');
        const btnMenu = this.createRetroButton(0, 190, '⌂ MAIN MENU', '#ffaa00');

        btnReiniciar.on('pointerdown', async () => {
            await this.saveScoreToServer();
            this.scene.stop();
            this.scene.stop('Level1');
            this.scene.start('Level1');
        });

        btnMenu.on('pointerdown', async () => {
            await this.saveScoreToServer();
            this.scene.stop();
            this.scene.stop('Level1');
            window.location.href = MENU_URL;
        });

        modalBox.add([modalFrame, title, statsContainer, btnReiniciar, btnMenu]);

        // Entry animation
        modalBox.setScale(0);
        modalBox.setAlpha(0);
        this.tweens.add({
            targets: modalBox,
            scale: 1,
            alpha: 1,
            duration: 500,
            ease: 'Bounce.Out'
        });

        // Scanlines
        this.add.image(this.scale.width / 2, this.scale.height / 2, 'scanlines').setAlpha(0.5);
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
        return button;
    }

    async saveScoreToServer() {
        // ✅ DEBUGGING: Verificar variables
        console.log('=== DEBUG SAVE SCORE ===');
        console.log('SAVE_LEVEL_PATH:', typeof SAVE_LEVEL_PATH !== 'undefined' ? SAVE_LEVEL_PATH : 'NO DEFINIDO');
        console.log('CURRENT_PLAYER_ID:', typeof CURRENT_PLAYER_ID !== 'undefined' ? CURRENT_PLAYER_ID : 'NO DEFINIDO');
        console.log('CURRENT_LEVEL_ID:', typeof CURRENT_LEVEL_ID !== 'undefined' ? CURRENT_LEVEL_ID : 'NO DEFINIDO');

        // ✅ Verificar que las variables estén definidas
        if (typeof SAVE_LEVEL_PATH === 'undefined') {
            console.error('ERROR: SAVE_LEVEL_PATH no está definido');
            return null;
        }
        if (typeof CURRENT_PLAYER_ID === 'undefined') {
            console.error('ERROR: CURRENT_PLAYER_ID no está definido');
            return null;
        }
        if (typeof CURRENT_LEVEL_ID === 'undefined') {
            console.error('ERROR: CURRENT_LEVEL_ID no está definido');
            return null;
        }

        const data = {
            playerId: CURRENT_PLAYER_ID,
            levelId: CURRENT_LEVEL_ID,
            puntosObtenidos: this.puntaje,
            tiempoUsado: this.tiempo,
            completado: true
        };

        console.log('Datos a enviar:', data);
        console.log('URL completa:', SAVE_LEVEL_PATH);

        try {
            console.log('Enviando petición...');

            const response = await fetch(SAVE_LEVEL_PATH, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Error ${response.status}:`, errorText);
                throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
            }

            const result = await response.json();
            console.log('✅ Respuesta exitosa:', result);
            return result;

        } catch (err) {
            console.error('❌ Error completo:', err);
            console.error('URL que falló:', SAVE_LEVEL_PATH);
            console.error('Datos enviados:', data);

            // ✅ Mostrar error en pantalla para debugging
            alert(`Error al guardar: ${err.message}\nURL: ${SAVE_LEVEL_PATH}`);
            return null;
        }
    }
}