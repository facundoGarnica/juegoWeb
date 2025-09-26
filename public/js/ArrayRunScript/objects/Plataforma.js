export default class Plataforma {
    /**
     * 
     * @param {Phaser.Scene} scene Escena donde se creará la plataforma
     * @param {string} key Key de la imagen de la plataforma precargada
     * @param {object} opciones { ancho, alto, y } - medidas y posición opcionales
     */
    constructor(scene, key, opciones = {}) {
        this.scene = scene;

        const ancho = opciones.ancho || scene.scale.width; // ancho por defecto = 100% pantalla
        const alto = opciones.alto || null;               // altura por defecto = imagen original
        const posY = opciones.y || scene.scale.height - 10; // posición vertical por defecto

        // Crear sprite
        this.sprite = scene.add.sprite(scene.scale.width / 2, posY, key);

        // Ajustar tamaño
        this.sprite.displayWidth = ancho;
        if (alto) this.sprite.displayHeight = alto;

        // Origen en el centro inferior
        this.sprite.setOrigin(0.5, 1);

        // Agregar física estática si existe physics
        if (scene.physics) {
            scene.physics.add.existing(this.sprite, true);
        }
    }
}
