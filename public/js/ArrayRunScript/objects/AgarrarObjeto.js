export default class AgarrarObjeto {
    constructor(player, scene, interactKey, throwKey, throwForce = 400) {
        this.player = player;
        this.scene = scene;
        this.interactKey = interactKey;
        this.throwKey = throwKey;
        this.throwForce = throwForce;

        this.objetoAgarrado = null;
        this.holdingTime = 0;
        this.offsetY = this.player.displayHeight; // altura sobre la cabeza
        this.offsetX = 0; // centrado sobre el jugador
    }

   update(delta) {
    // Agarrar o soltar con E
    if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
        if (this.objetoAgarrado) this.soltarObjeto();
        else this.intentarAgarrar();
    }

    // Contador de tiempo sosteniendo
    if (this.objetoAgarrado && this.interactKey.isDown) {
        this.holdingTime += delta;
    }

    // Lanzar objeto con R
    if (this.objetoAgarrado && Phaser.Input.Keyboard.JustDown(this.throwKey)) {
        this.lanzarObjeto();
        this.holdingTime = 0;
    }

    // Mantener objeto sobre la cabeza
    if (this.objetoAgarrado) {
        this.offsetX = this.player.facingRight ? 10 : -10;
        this.objetoAgarrado.body.enable = false;
        this.objetoAgarrado.body.moves = false;
        this.objetoAgarrado.body.setAllowGravity(false);
        this.objetoAgarrado.setPosition(this.player.x + this.offsetX, this.player.y - this.offsetY);

        // Si el objeto tiene método isTouchingBorder y devuelve true → soltar
        if (this.objetoAgarrado.isTouchingBorder?.()) {
            this.soltarObjeto();
        }
    }
}


// Función para detectar si el objeto tocó un borde de pantalla
tocoBorde() {
    if (!this.objetoAgarrado) return false;

    const obj = this.objetoAgarrado;
    const w = obj.displayWidth / 2;
    const h = obj.displayHeight / 2;
    const sw = this.scene.scale.width;
    const sh = this.scene.scale.height;

    return (
        obj.x - w <= 0 ||           // borde izquierdo
        obj.x + w >= sw ||          // borde derecho
        obj.y - h <= 0 ||           // borde superior
        obj.y + h >= sh             // borde inferior
    );
}



    intentarAgarrar() {
        const objetos = this.scene.objetosInteractuables.getChildren();
        for (let obj of objetos) {
            if (!obj.body) continue;
            if (Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y) < 100) {
                this.agarrarObjeto(obj);
                break;
            }
        }
    }

    agarrarObjeto(obj) {
        this.objetoAgarrado = obj;
        obj.body.moves = false;
        obj.body.setAllowGravity(false);
        obj.body.enable = false;
    }

    soltarObjeto() {
        if (!this.objetoAgarrado) return;

        const obj = this.objetoAgarrado;

        // Reactivar física
        obj.body.enable = true;
        obj.body.moves = true;
        obj.body.setAllowGravity(true);

        // Resetear velocidad
        obj.setVelocity(0, 0);

        // Posicionarlo ligeramente delante del jugador
        const dir = this.player.facingRight ? 1 : -1;
        obj.x = this.player.x + dir * (obj.displayWidth + 5); // +5 píxeles de separación
        obj.y = this.player.y - obj.displayHeight / 2;

        this.objetoAgarrado = null;
        this.holdingTime = 0;
    }


    lanzarObjeto() {
        if (!this.objetoAgarrado) return;

        const obj = this.objetoAgarrado;
        obj.body.enable = true;
        obj.body.moves = true;
        obj.body.setAllowGravity(true);

        const dir = this.player.facingRight ? 1 : -1;
        obj.setVelocity(dir * this.throwForce, -this.throwForce / 1.5);

        this.objetoAgarrado = null;
        this.holdingTime = 0;
    }
}
