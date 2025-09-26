// Level2.js
import Charco from '../objects/Charco.js';
import Paloma from '../objects/Paloma.js';
import Player from '../objects/player.js';

export default class Level2 extends Phaser.Scene {
    constructor() {
        super('Level2');
    }

    create() {
        // =========================
        // Fondo (opcional)
        // =========================
        this.background = this.add.image(0, 0, 'background_level_2').setOrigin(0, 0);
        this.background.displayWidth = this.scale.width;
        this.background.displayHeight = this.scale.height;

        // =========================
        // Plataforma principal
        // =========================
        this.platforms = this.physics.add.staticGroup();
        this.piso = this.platforms.create(
            this.scale.width / 2, 
            this.scale.height * 0.95, 
            'platform'
        )
            .setDisplaySize(this.scale.width, 20)
            .refreshBody();

        // =========================
        // Jugador
        // =========================
        this.player = new Player(this, this.scale.width * 0.1, this.scale.height * 0.5);
        this.player.setScale(2);

        // Colisiones
        this.physics.add.collider(this.player, this.platforms);

        // Controles
        this.cursors = this.input.keyboard.createCursorKeys();

        // =========================
        // Objeto Charco
        // =========================

        this.charco = new Charco(this, 400, 900, 'charco');
        // Escalar el sprite
        this.charco.setScale(0.4, 0.3);

        this.charco.setupCollision(this.player);

        // Cursor
        this.cursors = this.input.keyboard.createCursorKeys();

        // =========================
        // Grupo de Objetos Interactuables
        // =========================
        this.objetosInteractuables = this.physics.add.group();

        // =========================
        // Grupo de Palomas
        // =========================
        this.palomas = this.physics.add.group({
            classType: Paloma,
            runChildUpdate: true,
            createCallback: (paloma) => {
                paloma.body.setAllowGravity(false);
                paloma.body.setImmovable(true);
                paloma.setScale(0.4);
                paloma.resetPosition();
            }
        });

    // Timer para spawnear palomas cada 2 segundos, hasta 5 segundos
    this.time.addEvent({
        delay: 2000, // cada 2 segundos
        repeat: Math.floor(5000 / 2000) - 1, // repite 2 veces (total: 3 palomas en 5s)
        callback: () => {
            const config = {
                speed: Phaser.Math.Between(80, 140),
                damage: Phaser.Math.Between(1, 2),
                amplitude: Phaser.Math.Between(20, 80),
                frequency: 0.0015 + Math.random() * 0.0015
            };

            const paloma = this.palomas.get(this, this.player, config);
            if (paloma) {
                paloma.setActive(true).setVisible(true);
            }
        },
        callbackScope: this
    });

    // Colisión con el jugador
    this.physics.add.overlap(this.player, this.palomas, (player, paloma) => {
        if (player && typeof player.takeDamage === "function" && paloma && paloma.damage !== undefined) {
            player.takeDamage(paloma.damage);
        }
    });
        // =========================
        // HUD de vidas
        // =========================
        this.corazones = [];
        const margin = 20;
        const heartSpacing = 50;
        for (let i = 0; i < this.player.vidaTotal; i++) {
            const corazon = this.add.image(this.scale.width - margin - (i * heartSpacing), margin, 'corazon_lleno')
                .setOrigin(1, 0)
                .setScale(0.1)
                .setScrollFactor(0);
            this.corazones.push(corazon);
        }
        // =========================
        // Menu de pausa
        // =========================

        // Tecla ESC para pausar
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();          // Pausar Level1
            this.scene.launch('Pause');  // Lanzar escena de pausa
        });

    }

    update(time, delta) {
        this.player.update(time, delta, this.cursors);

    }
}
