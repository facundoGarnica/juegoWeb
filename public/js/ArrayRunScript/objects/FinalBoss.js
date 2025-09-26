export default class FinalBoss {
    constructor(scene, x, y, spriteKey, vel_lateral, proyectil_delay) {
        this.scene = scene;

        // Sprite del jefe
        this.sprite = scene.add.sprite(x, y, spriteKey).setOrigin(0.5, 0.5);

        // Propiedades de vida
        this.vidaMax = 500;
        this.vidaActual = this.vidaMax;
        this.vivo = true;
        this.usarFisica = false;

        // ===== Configuración de fases =====
        this.fase = 1;
        this.velocidadLateral = vel_lateral; // ms para tween lateral
        this.proyectilDelay = proyectil_delay;   // ms entre disparos
        this.amplitudMovimiento = 400;

        this.proyectilesEvento = null; // para guardar evento de disparos
    }

    recibirDanio(cantidad) {
        if (!this.vivo) return;

        this.vidaActual = Math.max(this.vidaActual - cantidad, 0);

        // Actualizar barra si existe
        if (this.scene.barraVida) this.scene.barraVida.recibirDanio(cantidad);

        // Comprobar fase 2
        if (this.fase === 1 && this.vidaActual <= this.vidaMax / 2) {
            this.iniciarSegundaFase();
        }

        // Si muere, avisar a la escena
        if (this.vidaActual === 0) {
            this.morir();
            if (this.scene && typeof this.scene.gameComplete === 'function') {
                this.scene.gameComplete();
            }
        }
    }

   iniciarSegundaFase() {
        this.fase = 2;

        // ===== Variables locales =====
        const multiplicadorVelocidad = 2;       
        const multiplicadorProyectiles = 1;     
        const duracionShake = 50;               // duración de cada sacudida
        const intensidadShake = 0.006;          // intensidad de cada sacudida

        // Ajustar velocidad y frecuencia de disparos
        this.velocidadLateral = Math.max(this.velocidadLateral / multiplicadorVelocidad, 50);
        this.proyectilDelay = Math.max(this.proyectilDelay / multiplicadorProyectiles, 50);

        console.log('Jefe en la segunda fase');

        // ===== Sacudido constante de cámara =====
        if (this.temblorEvento) this.temblorEvento.remove(false); // por si ya existía
        this.temblorEvento = this.scene.time.addEvent({
            delay: duracionShake,
            loop: true,
            callback: () => {
                this.scene.cameras.main.shake(duracionShake, intensidadShake);
            }
        });

        // Reiniciar evento de proyectiles
        if (this.proyectilesEvento) this.proyectilesEvento.remove(false);
        this.lanzarProyectiles();
    }




    morir() {
        this.vivo = false;
        this.sprite.setVisible(false);
        if (this.proyectilesEvento) this.proyectilesEvento.remove(false);
        // Animación de muerte opcional
    }

    habilitarFisicas() {
        this.scene.physics.add.existing(this.sprite);
        this.sprite.body.setImmovable(true);
        this.usarFisica = true;
    }

  moverLateral() {
    if (!this.vivo) return;

    const centroX = this.scene.scale.width / 2;

    // Función que crea el siguiente tween aleatorio
    const moverAleatorio = () => {
            if (!this.vivo) return;

            // Escoger un destino aleatorio alrededor del centro
            const destino = centroX + Phaser.Math.Between(-this.amplitudMovimiento, this.amplitudMovimiento);

            // Escoger una duración aleatoria entre 50% y 150% de la velocidad lateral
            const duracion = Phaser.Math.Between(this.velocidadLateral / 2, this.velocidadLateral * 1.5);

            this.scene.tweens.add({
                targets: this.sprite,
                x: destino,
                duration: duracion,
                ease: 'Sine.easeInOut',
                onComplete: moverAleatorio // al terminar, se mueve a otro destino aleatorio
            });
        };

        // Empezar desde el centro
        this.sprite.x = centroX;

        // Lanzar el primer movimiento
        moverAleatorio();
    }



    lanzarProyectiles() {
        if (!this.vivo) return;

        this.proyectilesEvento = this.scene.time.addEvent({
            delay: this.proyectilDelay,
            loop: true,
            callback: () => {
                const proyectil = this.scene.proyectilesBoss.get();
                if (proyectil) {
                    const x = this.sprite.x;
                    const y = this.sprite.y + (this.sprite.displayHeight / 2);
                    proyectil.setScale(0.2);
                    proyectil.lanzar(x, y, 300); // velocidad constante o también podrías parametrizar
                }
            }
        });
    }

    update(time, delta) {
        if (!this.vivo) return;
        // Aquí podrías agregar más lógica dinámica por fase
    }
}
