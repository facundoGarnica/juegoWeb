// Level1.js
import Enemy from '../objects/Enemy.js';
import Escaleras from '../objects/Escaleras.js';
import FallingEnemy from '../objects/FallingEnemy.js';
import Interruptor from '../objects/Interruptor.js';
import Llave from '../objects/Llave.js';
import Mesa from '../objects/Mesa.js';
import Monedas from '../objects/Monedas.js';
import Player from '../objects/player.js';
import PuntajeFinal from '../objects/PuntajeFinal.js';
import PuntoGuardado from '../objects/PuntoGuardado.js';

export default class Level1 extends Phaser.Scene {
    constructor() {
        super('Level1');

        this.spawnConfig = {
            minSpeed: 600,
            maxSpeed: 900,
            scale: 1.3,
            spawnDelayMin: 200,
            spawnDelayMax: 500,
            diagonalIntensity: 'high',
            rotateSprite: true
        };
    }

    create() {
        this.startTime = this.time.now;

        // =========================
        // Fondo full screen
        // =========================
        this.background = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.background.displayWidth = this.scale.width;
        this.background.displayHeight = this.scale.height;


        // =========================
        // Grupo de objetos que se puedan agarrar
        // =========================
        this.objetosInteractuables = this.physics.add.group();


        // =========================
        // Plataformas
        // =========================
        this.platforms = this.physics.add.staticGroup();
        this.piso = this.platforms.create(this.scale.width / 2, this.scale.height * 0.95, 'platform')
            .setDisplaySize(this.scale.width, 20)
            .refreshBody();

        this.plataforma2 = this.platforms.create(this.scale.width / 2 + this.scale.width * 0.18, this.scale.height * 0.561, 'platform')
            .setDisplaySize(this.scale.width * 0.7, 20)
            .refreshBody();

        this.platforms_enemy = this.physics.add.staticGroup();
        this.plataforma3 = this.platforms_enemy.create(this.scale.width / 2 - this.scale.width * 0.43, this.scale.height * 0.56, 'platform')
            .setDisplaySize(this.scale.width * 0.5, 20)
            .setTint(0xff00ff)
            .refreshBody();

       this.plataforma4 = this.platforms.create(this.scale.width / 10 + this.scale.width * 0.07, this.scale.height * 0.45, 'platform')
            .setDisplaySize(this.scale.width * 0.05, 20)
            .refreshBody();


        // =========================
        // Jugador
        // =========================
        this.player = new Player(this, this.scale.width * 0.9, this.scale.height * 0.2);
        this.player.setScale(2);
        this.physics.add.collider(this.player, this.platforms);

        // =========================
        // Enemigos en plataformas
        // =========================
        this.enemy1 = new Enemy(this, this.scale.width * 0.1, this.scale.height * 0.5, 'enemy', 0, this.scale.width * 0.8, 1000);
        this.enemy2 = new Enemy(this, this.scale.width * 0.6, this.scale.height * 0.9, 'enemy', 0, this.scale.width * 0.8, 1400);

        this.physics.add.collider(this.enemy1, this.platforms);
        this.physics.add.collider(this.enemy1, this.platforms_enemy);
        this.physics.add.collider(this.enemy2, this.platforms);

        this.enemies = [this.enemy1, this.enemy2];

        // =========================
        // Enemigos cayentes
        // =========================
        this.fallingEnemies = this.physics.add.group();
        this.spawnFallingEnemy();

        this.physics.add.overlap(this.player, this.fallingEnemies, (player, enemy) => {
            if (!player.invulnerable) {
                player.takeDamage(1);
                this.actualizarCorazones();
                enemy.destroy();
                this.checkPlayerDeath();
            }
        });

        // =========================
        // Escalera modular
        // =========================
        this.escaleras = new Escaleras(this, this.player, this.scale.width * 0.1345, this.scale.height * 0.912);

        // =========================
        // Interruptor SI-NO
        // =========================

        this.interruptor = new Interruptor(this, this.scale.width * 0.8, this.scale.height * 0.3);
        this.interruptor.setScale(0.05);

        // =========================
        // Llave con metodos booleanos
        // =========================

        this.llave = new Llave(this, this.scale.width * 0.6, this.scale.height * 0.75, 'llave');
        this.llave.setScale(0.05);

        // Overlap con jugador
        this.physics.add.overlap(this.player, this.llave, () => {
            this.llave.recoger();
            console.log("Llave agarrada:", this.llave.agarrada); // true
        });

        // Asignarle la llave al interruptor
        this.interruptor.setLlave(this.llave);

        // Activar interruptor solo si player lo toca y tiene la llave
        this.physics.add.overlap(this.player, this.interruptor, () => {
            if (this.llave.agarrada) {
                this.interruptor.activate();
                console.log("Interruptor activado porque se tiene la llave");
            } else {
                console.log("No tienes la llave todavía");
            }
        });

        // =========================
        // Mesa movible
        // =========================
        
        
        // mesa y que conecta al jugador
       this.mesa = new Mesa(
            this,
            this.scale.width * 0.4,
            this.scale.height * 0.5,
            'mesa',
            0.2,                        // peso
            this.scale.width * 0.1,   // minX
            this.scale.width * 1    // maxX
        );
        this.mesa.setScale(0.17);
        this.mesa.setPlayer(this.player);
        this.objetosInteractuables.add(this.mesa);

        // Colisiones con plataformas
        this.physics.add.collider(this.mesa, this.platforms);
        this.physics.add.collider(this.player, this.mesa); // para empujar

        
        // =========================
        // Monedas para agarrar
        // =========================

        // Crear grupo de monedas (normal)
        this.monedas = this.add.group();

        // Inicializar puntaje del jugador si no existe
        if (this.player.puntaje === undefined) {
            this.player.puntaje = 0;
        }

        // Agregar algunas monedas
        const positions = [
            { x: this.scale.width * 0.17, y: this.scale.height * 0.35 }, // izquierda
            { x: this.scale.width * 0.27, y: this.scale.height * 0.35 },
            { x: this.scale.width * 0.37, y: this.scale.height * 0.31 },
            { x: this.scale.width * 0.47, y: this.scale.height * 0.31 }, // centro alto
            { x: this.scale.width * 0.57, y: this.scale.height * 0.31 },
            { x: this.scale.width * 0.67, y: this.scale.height * 0.35 },
            { x: this.scale.width * 0.77, y: this.scale.height * 0.40 },
            { x: this.scale.width * 0.87, y: this.scale.height * 0.43 }  // derecha
        ];



        positions.forEach(pos => {
            const moneda = new Monedas(this, pos.x, pos.y, 'moneda');
            moneda.setScale(3);
            this.monedas.add(moneda);
        });

        // Colisión con el jugador - usando overlap para detección más suave
        this.physics.add.overlap(this.player, this.monedas, (player, moneda) => {
            moneda.collect(player);
            this.actualizarPuntajeHUD();
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
        // HUD de puntaje
        // =========================
        this.puntajeTexto = this.add.text(20, 20, 'Monedas: 0', {
            fontSize: '24px',
            fill: '#FFD700',
            fontFamily: 'Arial',
            stroke: '#000000',
            strokeThickness: 2
        }).setScrollFactor(0).setDepth(100);

        // =========================
        // Controles
        // =========================
        this.cursors = this.input.keyboard.createCursorKeys();

        // =========================
        // Checkpoint
        // =========================
        this.checkpoint = new PuntoGuardado(
            this,
            this.scale.width * 0.93,
            this.scale.height * 0.82,
            180,
            200,
            this.player
        );

        this.checkpoint.setCallback(() => {
            // Solo se activa si el interruptor está activado
            if (this.interruptor.activated) {
                this.reachCheckpoint();
            } else {
                console.log("No podés activar el checkpoint aún. Primero activá el interruptor.");
            }
        });


        // =========================
        // Ajuste responsive
        // =========================
        this.scale.on('resize', ({ width, height }) => {
            // Fondo
            this.background.displayWidth = width;
            this.background.displayHeight = height;

            // Plataformas
            this.piso.setDisplaySize(width, 20).setPosition(width / 2, height * 0.95).refreshBody();
            this.plataforma2.setDisplaySize(width * 0.7, 20).setPosition(width / 2 + width * 0.18, height * 0.56).refreshBody();
            this.plataforma3.setDisplaySize(width * 0.5, 20).setPosition(width / 2 - width * 0.25, height * 0.56).refreshBody();

            // Jugador y enemigos
            this.player.x = width * 0.9;
            this.player.resize(width, height);

            this.enemy1.maxX = width * 0.8;
            this.enemy2.maxX = width * 0.8;
            this.enemy1.resize(width, height);
            this.enemy2.resize(width, height);

            // Escaleras
            this.escaleras.resize(width, height);

            // HUD
            this.corazones.forEach((corazon, i) => {
                corazon.setPosition(width - 20 - (i * 50), 20);
            });

            // Checkpoint
            this.checkpoint.resize(width, height);
        });
    }

    // =========================
    // Manejo de checkpoints
    // =========================
    reachCheckpoint() {
        const tiempoFinal = Math.floor((this.time.now - this.startTime) / 1000);

        const puntajeCalc = new PuntajeFinal(this.monedas.getLength(), this.player.vidaTotal);
        const puntaje = puntajeCalc.calcular(this.player, tiempoFinal);

        this.scene.stop();
        this.scene.start('GameCompleteScene', { puntaje, tiempo: tiempoFinal });
    }

    // =========================
    // Manejo de Game Over
    // =========================
    checkPlayerDeath() {
        if (this.player.vidaActual <= 0) {
            this.gameOver();
        }
    }

    gameOver() {
        const tiempoFinal = Math.floor((this.time.now - this.startTime) / 1000);

        const puntajeCalc = new PuntajeFinal(this.monedas.getLength(), this.player.vidaTotal);
        const puntaje = puntajeCalc.calcular(this.player, tiempoFinal);

        this.scene.stop();
        this.scene.start('GameOverScene', { puntaje, tiempo: tiempoFinal });
    }

    // =========================
    // Update loop
    // =========================
    update(time, delta) {
        // Actualizamos al jugador (incluye el sistema de agarrar objetos)
        this.player.update(delta);

        // Enemigos
        this.enemy1.patrol();
        this.enemy2.patrol();

        this.fallingEnemies.children.iterate(enemy => {
            if (enemy) enemy.update();
        });

        this.enemies.forEach(enemy => {
            if (this.physics.overlap(this.player, enemy)) {
                this.player.takeDamage(1);
                this.actualizarCorazones();
                this.checkPlayerDeath();
            }
        });

        // Actualizar mesa
        if (this.mesa) this.mesa.update();

        // Update del interruptor
        if (this.interruptor) this.interruptor.update();

        this.monedas.children.iterate(moneda => {
            if (moneda) moneda.update(this.time.now, delta);
        });


    }


    actualizarCorazones() {
        this.corazones.forEach((corazon, i) => {
            corazon.setTexture(i < this.player.vidaActual ? 'corazon_lleno' : 'corazon_vacio');
        });
    }

    spawnFallingEnemy() {
        const delay = Phaser.Math.Between(this.spawnConfig.spawnDelayMin, this.spawnConfig.spawnDelayMax);
        this.time.addEvent({
            delay,
            callback: () => {
                const enemy = new FallingEnemy(this, this.player, this.spawnConfig);
                this.fallingEnemies.add(enemy);
                this.spawnFallingEnemy();
            }
        });
    }

    spawnVariedFallingEnemies() {
        const delay = Phaser.Math.Between(this.spawnConfig.spawnDelayMin, this.spawnConfig.spawnDelayMax);
        this.time.addEvent({
            delay,
            callback: () => {
                const movementTypes = ['high', 'medium', 'random', 'toward_player'];
                const randomType = Phaser.Utils.Array.GetRandom(movementTypes);

                const variedConfig = { ...this.spawnConfig, diagonalIntensity: randomType };
                const enemy = new FallingEnemy(this, this.player, variedConfig);
                this.fallingEnemies.add(enemy);
                this.spawnVariedFallingEnemies();
            }
        });
    }
    actualizarPuntajeHUD() {
    if (this.puntajeTexto) {
        this.puntajeTexto.setText(`Monedas: ${this.player.puntaje || 0}`);
    }
}
}
