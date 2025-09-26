// BootScene.js
export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        const path = window.background_path;
        const playerSpriteFolder = window.CURRENT_PLAYER_SPRITE; //sprite del jugador pasado por el twig

        // Fondo específico por nivel
        if (window.CURRENT_LEVEL_ID === 1) {
            this.load.image('background_level_1', `${path}/fondo-nivel-1.png`);
        } else if (window.CURRENT_LEVEL_ID === 2) {
            this.load.image('background_level_2', `${path}/fondo2.png`);
        } else if (window.CURRENT_LEVEL_ID === 3) {
            this.load.image('background_level_3', `${path}/fondo-nivel-3.png`);
        }

        // Player con imágenes separadas
        this.load.image('player_idle', `${path}/sprites/${playerSpriteFolder}/derecha_estar.png`);
        this.load.image('player_walk1', `${path}/sprites/${playerSpriteFolder}/derecha_paso1.png`);
        this.load.image('player_walk2', `${path}/sprites/${playerSpriteFolder}/derecha_transicion.png`);
        this.load.image('player_walk3', `${path}/sprites/${playerSpriteFolder}/derecha_paso2.png`);

        // Otros
        this.load.image('platform', `${path}/sprites/platform.png`);
        this.load.image('enemy', `${path}/sprites/enemy.png`);

        // Ataque jefe final
        this.load.image('error_500', `${path}/sprites/jefe_final/error500.png`);
        this.load.image('error_404', `${path}/sprites/jefe_final/error404.png`);

        //200Ok de jefe
        this.load.image('200_ok', `${path}/sprites/jefe_final/200ok.png`);

        //sprite de vida con corazones
        this.load.image('corazon_lleno', `${path}/sprites/objetos/corazon-lleno.png`);
        this.load.image('corazon_vacio', `${path}/sprites/objetos/corazon-vacio.png`);
        
        //Interruptor SI-NO
        this.load.image('interruptor_no', `${path}/sprites/objetos/interruptor_no.png`);
        this.load.image('interruptor_si', `${path}/sprites/objetos/interruptor_si.png`);

        //llave
        this.load.image('llave', `${path}/sprites/objetos/llave.png`);

        //Mesa
        this.load.image('mesa', `${path}/sprites/objetos/mesa.png`);

        //monedas que giran
        this.load.image('moneda', `${path}/sprites/objetos/moneda.png`);

        //Charco de agua
        this.load.image('charco', `${path}/sprites/objetos/charco.png`);

        //Charco de agua
        this.load.image('paloma', `${path}/sprites/objetos/paloma.png`);

        //Final Boss
        this.load.image('jefe', `${path}/sprites/jefe_final/jefe.png`);

        // Cargar música del jefe
        this.load.audio('bossMusic', `${path}/sound/musica.mp3`);

    }   

    create() {
        // Crear animaciones a partir de los sprite del personaje
        this.anims.create({
            key: 'idle',
            frames: [{ key: 'player_idle' }],
            frameRate: 1
        });

        this.anims.create({
            key: 'walk_right',
            frames: [
                { key: 'player_walk1', duration: 200 },
                { key: 'player_walk2', duration: 200 },
                { key: 'player_walk3', duration: 200 }
            ],
            repeat: -1
        });


        if (window.CURRENT_LEVEL_ID === 1) {
            this.scene.start('Level1');
        } else if (window.CURRENT_LEVEL_ID === 2) {
            this.scene.start('Level2');
        } else if (window.CURRENT_LEVEL_ID === 3) {
            this.scene.start('Level3');
        }

    }
}
