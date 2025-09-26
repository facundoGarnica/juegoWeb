// Level3.js
import BarraVida from '../objects/BarraVida.js';
import FallingEnemy from '../objects/FallingEnemy.js';
import FinalBoss from '../objects/FinalBoss.js';
import ObjetoLanzado from '../objects/ObjetoLanzado.js';
import Plataforma from '../objects/Plataforma.js';
import Player from '../objects/player.js';
export default class Level3 extends Phaser.Scene {
    constructor() {
        super('Level3');
    }

    create() {
        this.startTime = this.time.now;


         // =========================
        // Fondo (opcional)
        // =========================
        this.background = this.add.image(0, 0, 'background_level_3').setOrigin(0, 0);
        this.background.displayWidth = this.scale.width;
        this.background.displayHeight = this.scale.height;
        
         // Crear plataforma en el fondo
        this.suelo = new Plataforma(this, 'platform', { ancho: this.scale.width, alto: 60 });
        // Hacerla invisible pero aún colisionable
        this.suelo.sprite.setAlpha(0);

        // Crear jugador sobre la plataforma
        const playerX = this.scale.width / 10 + 110;
        const playerY = this.scale.height / 1 - 100; // justo arriba de la plataforma
        this.player = new Player(this, playerX, playerY);
        this.player.setScale(2);
        
        // Configurar controles
        this.cursors = this.input.keyboard.createCursorKeys();

        // Collider entre jugador y plataforma
        if (this.player.body && this.suelo.sprite.body) {
            this.physics.add.collider(this.player, this.suelo.sprite);
        }

       // =========================
        // HUD de vidas (corazones)
        // =========================
        this.corazones = [];
        const marginX = 1650;                 // Margen desde el borde derecho
        const marginY = this.scale.height - 56; // Posición vertical más abajo
        const heartSpacing = 35;            // Separación horizontal entre corazones

        for (let i = 0; i < this.player.vidaTotal; i++) {
            const corazon = this.add.image(
                this.scale.width - marginX - (i * heartSpacing), // Posición X
                marginY,                                         // Posición Y más abajo
                'corazon_lleno'
            )
            .setOrigin(1, 0)     // Ancla superior derecha
            .setScale(0.07)       // Tamaño del corazón
            .setScrollFactor(0); // Que no se mueva con la cámara

            this.corazones.push(corazon);
        }

       

        // =========================
        // LLuvia de enemigos
        // =========================

    // Grupo para enemigos
    this.fallingEnemiesGroup = this.add.group();

    // Función para generar enemigos tipo lluvia
    const spawnRainEnemies = (cantidad = 3) => {
        for (let i = 0; i < cantidad; i++) {
            const posiblesSprites = ['error_500', 'error_404'];
            const spriteKey = Phaser.Utils.Array.GetRandom(posiblesSprites);

            const startX = Phaser.Math.Between(0, this.scale.width);
            const startY = -50 - Phaser.Math.Between(0, 900); // más dispersión vertical

            const enemy = new FallingEnemy(this, this.player, {
                minSpeed: Phaser.Math.Between(400, 800),
                maxSpeed: Phaser.Math.Between(1000, 1600),
                scale: Phaser.Math.FloatBetween(0.1, 0.25),
                diagonalIntensity: 'toward_player',
                rotateSprite: true,
                spriteKey: spriteKey
            });

            enemy.setX(startX);
            enemy.setY(startY);

            // Colisiones
            if (this.suelo.sprite.body) {
                this.physics.add.collider(enemy, this.suelo.sprite, () => enemy.destroy());
            }
            this.physics.add.overlap(enemy, this.player, () => {
                this.player.takeDamage(1);
                 this.actualizarCorazones();
                enemy.destroy();
                this.checkPlayerDeath();
            });

            this.fallingEnemiesGroup.add(enemy);
        }
    };

    // Llamar para crear lluvia torrencial con cantidad variable
    // Iniciar lluvia torrencial a los 9 segundos
    const delayLluvia = 18.7;
    this.time.delayedCall(delayLluvia * 1000, () => {
        this.time.addEvent({
            delay: 760, // cada 0.3 segundos
            callback: () => {
                // Generar entre 3 y 8 enemigos por oleada
                const cantidadAleatoria = Phaser.Math.Between(3, 9);
                spawnRainEnemies(cantidadAleatoria);
            },
            callbackScope: this,
            loop: true
        });
    });

        // =========================
        // Barra de vida jefe
        // =========================

        this.barraVida = new BarraVida(this, this.scale.width / 2, 50, { 
            vidaMax: 500, 
            titulo: 'Legendario Sugist'
          //  imagen: 'barra_roja' <-- en caso de querer subir una imagen como barra de vida
        });

        // Configurar vida máxima
        this.barraVida.setVidaMaxima(500);
        this.barraVida.aparecer(5, 1500); //5 es la duracion que tarda en aparecer


       // =========================
    // Enemigo jefe final
    // =========================
    const delaySegundos = 9;
    const velocidadLateral = 800; // ms para tween lateral
    const proyectilDelay = 1800;   // ms entre disparos
    // Crear grupo de proyectiles del jefe
    this.proyectilesBoss = this.physics.add.group({
        classType: ObjetoLanzado,
        maxSize: 20,
        runChildUpdate: true
    });

    // Crear el jefe
    this.boss = new FinalBoss(this, this.scale.width / 2, -200, 'jefe', velocidadLateral, proyectilDelay);
    this.boss.sprite.setScale(0.4);

    // ===== Aparición del jefe =====
    this.time.delayedCall(delaySegundos * 1000, () => {
        this.tweens.add({
            targets: this.boss.sprite,
            y: this.scale.height / 3.5,
            duration: 10000, // duración de subida
            ease: 'Power2',
            onComplete: () => {
                // Iniciar movimiento lateral y disparos usando los métodos de la clase
                this.boss.moverLateral();
                this.boss.lanzarProyectiles();
            }
        });
    });

    // ===== Colisión proyectiles-jugador =====
    this.physics.add.overlap(this.player, this.proyectilesBoss, (player, proyectil) => {
        if (!proyectil.active) return;

        // Desactivar proyectil
        proyectil.setActive(false);
        proyectil.setVisible(false);
        if (proyectil.body) proyectil.body.stop();

        // Aplicar daño al jefe
        const danio = 20;
        this.boss.recibirDanio(danio); // La lógica de segunda fase se maneja dentro de la clase

        // Efecto visual
        this.cameras.main.flash(200, 255, 0, 0);
    });




                // =========================
        // Objetos de sonido
        // =========================
        this.bossMusic = this.sound.add('bossMusic', {
            volume: 0.5,
            loop: true
        });

        // Reproducir con delay de 7 segundos
        this.time.delayedCall(1000, () => {
            this.bossMusic.play();
        });

        // Botón para apagar/reanudar música
        this.muteButton = this.add.text(this.scale.width - 150, 20, '🔊 Música ON', {
            font: '20px Arial',
            fill: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true });

        // Variable de estado
        this.musicOn = true;

        this.muteButton.on('pointerdown', () => {
            if (this.musicOn) {
                this.bossMusic.pause(); // pausa la música
                this.muteButton.setText('🔇 Música OFF');
                this.musicOn = false;
            } else {
                this.bossMusic.resume(); // reanuda la música
                this.muteButton.setText('🔊 Música ON');
                this.musicOn = true;
            }
        });
        // Barra de volumen
        const barraWidth = 100;
        const barraHeight = 10;
        const barraX = this.scale.width - 150;
        const barraY = 60;

        // Fondo de la barra
        this.volumeBarBg = this.add.rectangle(barraX, barraY, barraWidth, barraHeight, 0x555555).setOrigin(0, 0.5);

        // Barra de volumen actual
        this.volumeBar = this.add.rectangle(barraX, barraY, barraWidth * 0.5, barraHeight, 0x00ff00).setOrigin(0, 0.5); // volumen inicial 50%

        // Hacer interactiva
        this.volumeBarBg.setInteractive();
        this.volumeBarBg.on('pointerdown', (pointer) => {
            let localX = pointer.x - barraX;
            localX = Phaser.Math.Clamp(localX, 0, barraWidth);
            const volumen = localX / barraWidth;
            this.bossMusic.setVolume(volumen);
            this.volumeBar.width = barraWidth * volumen;
        });


    }

    update(time, delta) {
       if (this.boss) this.boss.update(time, delta);
        this.player.update(delta);
        // Actualizar enemigos que caen
        this.fallingEnemiesGroup.getChildren().forEach(enemy => enemy.update());
    }
    
    actualizarCorazones() {
        this.corazones.forEach((corazon, i) => {
            corazon.setTexture(i < this.player.vidaActual ? 'corazon_lleno' : 'corazon_vacio');
        });
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
        const puntaje = this.player.puntaje || 0;

        // Detener música del boss si está sonando
        if (this.bossMusic && this.bossMusic.isPlaying) {
            this.bossMusic.stop();
        }

        this.scene.stop();
        this.scene.start('GameOverScene', { puntaje, tiempo: tiempoFinal, level: 'Level3' });
    }


    // =========================
    // Manejo de Game Complete (boss muerto)
    // =========================
    checkBossDefeated() {
        if (this.boss.vidaActual <= 0) {
            this.gameComplete();
        }
    }

   gameComplete() {
    const tiempoFinal = Math.floor((this.time.now - this.startTime) / 1000);

    const totalMonedas = this.player.puntaje || 0;
    const vidaActual = this.player.vidaActual;
    const vidaTotal = this.player.vidaTotal;

    // Detener música del boss si existe
    if (this.bossMusic && this.bossMusic.isPlaying) {
        this.bossMusic.stop();
    }

    // Detener la escena Level3 y lanzar GameCompleteScene
    this.scene.stop();
    this.scene.start('GameCompleteScene', {
        puntaje: totalMonedas,
        tiempo: tiempoFinal,
        monedas: totalMonedas,
        totalMonedas: totalMonedas, // opcional: ajustar si hay un total distinto
        vidaActual,
        vidaTotal,
        level: 'Level3'
    });
}





}