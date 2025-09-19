export default class Mesa extends Phaser.Physics.Arcade.Sprite {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture
     * @param {number} weight - afecta la facilidad de mover
     * @param {number} minX - límite izquierdo
     * @param {number} maxX - límite derecho
     */
    constructor(scene, x, y, texture = 'mesa', weight = 1, minX = 0, maxX = 1000) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        this.body.allowGravity = true;
        this.body.setImmovable(false);
        this.weight = weight;
        this.pushForce = 150 / this.weight; // fuerza de empuje
        this.player = null;
        this.minX = minX;
        this.maxX = maxX;
    }
    
    setPlayer(player) {
        this.player = player;
    }
    
    update() {
        if (!this.player) return;
        
        const touchingPlayer = this.scene.physics.overlap(this.player, this);
        
        if (touchingPlayer) {
            // Solo empujar horizontalmente según la posición relativa
            const dir = (this.x - this.player.x) > 0 ? 1 : -1;
            
            // Corregir la lógica de límites:
            // dir < 0 = movimiento hacia la izquierda, verificar límite izquierdo
            // dir > 0 = movimiento hacia la derecha, verificar límite derecho
            if ((dir < 0 && this.x > this.minX) || (dir > 0 && this.x < this.maxX)) {
                this.body.velocity.x = dir * this.pushForce * (this.player.body.velocity.x / Math.abs(this.player.body.velocity.x || 1));
            } else {
                // Limite alcanzado
                this.body.velocity.x = 0;
            }
        } else {
            // Nadie empuja → frena la mesa
            this.body.velocity.x = 0;
        }
        
        // Asegurarse de que no se salga de los límites
        this.x = Phaser.Math.Clamp(this.x, this.minX, this.maxX);
    }
   
    isTouchingBorder() {
        const w = this.displayWidth / 2;
        const h = this.displayHeight / 2;
        const sw = this.scene.scale.width;
        const sh = this.scene.scale.height;
        return (
            this.x - w <= 0 ||           // borde izquierdo
            this.x + w >= sw ||          // borde derecho
            this.y - h <= 0 ||           // borde superior
            this.y + h >= sh ||          // borde inferior
            this.x <= this.minX ||       // límite personalizado izquierdo
            this.x >= this.maxX          // límite personalizado derecho
        );
    }
}