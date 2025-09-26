export default class BarraVida {
    /**
     * 
     * @param {Phaser.Scene} scene Escena donde se mostrará la barra
     * @param {number} x Posición X
     * @param {number} y Posición Y
     * @param {object} opciones Opciones: vidaMax, imagen, titulo
     */
    constructor(scene, x, y, opciones = {}) {
        this.scene = scene;

        // Configuración
        this.maxWidth = scene.scale.width * 0.9; // 90% ancho pantalla
        this.height = 20;
        this.vidaMax = opciones.vidaMax || 100;
        this.vidaActual = this.vidaMax;

        // Fondo (gris oscuro)
        this.fondo = scene.add.rectangle(x, y, this.maxWidth, this.height, 0x222222);
        this.fondo.setOrigin(0.5, 0.5);
        this.fondo.setScale(0, 1); // Comenzamos invisible en X para animación

        // Barra de vida: puede ser imagen o rectángulo
        if (opciones.imagen) {
            this.barra = scene.add.image(x, y, opciones.imagen);
            this.barra.setOrigin(0.5, 0.5);
            this.barra.displayWidth = this.maxWidth;
            this.barra.displayHeight = this.height;
            this.barra.setScale(0, 1); // Comenzamos invisible
        } else {
            this.barra = scene.add.rectangle(x, y, this.maxWidth, this.height, 0xff0000);
            this.barra.setOrigin(0.5, 0.5);
            this.barra.scaleX = 0; // Comenzamos invisible
        }

        // Texto del título del jefe (opcional)
        if (opciones.titulo) {
            this.titulo = scene.add.text(
                x, 
                y - this.height / 2 - 5, // más cerca de la barra
                opciones.titulo, 
                {
                    font: '24px Arial',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3,
                    align: 'center'
                }
            ).setOrigin(0.5, 1); // centrado horizontal, justo arriba de la barra
            this.titulo.setAlpha(0); // comenzamos invisible
        }
    }

    /**
     * Configura los valores de vida máxima y actual
     */
    setVidaMaxima(valor) {
        this.vidaMax = valor;
        this.vidaActual = valor;
        this.actualizarBarra();
    }

    /**
     * Recibe daño y actualiza la barra
     */
    recibirDanio(cantidad) {
        this.vidaActual = Math.max(this.vidaActual - cantidad, 0);
        this.actualizarBarra();
    }

    /**
     * Actualiza el tamaño de la barra según el porcentaje de vida
     */
    actualizarBarra() {
        let porcentaje = this.vidaActual / this.vidaMax;

        if (this.barra.type === 'Image') {
            this.barra.displayWidth = this.maxWidth * porcentaje;
        } else {
            this.barra.width = this.maxWidth * porcentaje;
        }
    }

    /**
     * Aparece la barra con efecto desde el centro hacia los costados
     * @param {number} delay Segundos antes de que empiece la animación
     * @param {number} velocidad Tiempo (ms) que tarda en completarse la animación
     */
    aparecer(delay = 2, velocidad = 1000) {
        this.scene.time.delayedCall(delay * 1000, () => {
            const targets = [this.barra, this.fondo];
            if (this.titulo) targets.push(this.titulo);

            this.scene.tweens.add({
                targets: targets,
                scaleX: 1,
                alpha: 1, // texto y barra se hacen visibles
                duration: velocidad,
                ease: 'Power2'
            });
        });
    }
}
