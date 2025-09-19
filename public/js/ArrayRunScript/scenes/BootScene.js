// BootScene.js
export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        const path = window.background_path;

        this.load.image('background', `${path}/fondo-nivel-1.png`);

        // Player con imágenes separadas
        this.load.image('player_idle', `${path}/sprites/player_chico/derecha_estar.png`);
        this.load.image('player_walk1', `${path}/sprites/player_chico/derecha_paso1.png`);
        this.load.image('player_walk2', `${path}/sprites/player_chico/derecha_transicion.png`);
        this.load.image('player_walk3', `${path}/sprites/player_chico/derecha_paso2.png`);

        // Otros
        this.load.image('platform', `${path}/sprites/platform.png`);
        this.load.image('enemy', `${path}/sprites/enemy.png`);

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


        this.scene.start('Level1');
    }
}
