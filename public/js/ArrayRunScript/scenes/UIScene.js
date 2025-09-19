export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true });
    }

    create() {
        // Vida inicial
        this.life = 10;

        // Texto de vida
        this.lifeText = this.add.text(16, 16, `❤️ ${this.life}`, {
            fontSize: '24px',
            fill: '#fff'
        });

        // Botón “Volver al menú”
        this.menuButton = this.add.text(650, 16, 'MENU', {
            fontSize: '20px',
            backgroundColor: '#222',
            padding: { x: 10, y: 5 },
            fill: '#fff'
        })
        .setInteractive()
        .on('pointerdown', () => {
            window.location.href = "/arrayrun"; // ajusta la ruta de tu menú
        });

        // Botón “Reiniciar nivel”
        this.restartButton = this.add.text(650, 50, 'REINICIAR', {
            fontSize: '20px',
            backgroundColor: '#222',
            padding: { x: 10, y: 5 },
            fill: '#fff'
        })
        .setInteractive()
        .on('pointerdown', () => {
            this.scene.get('Level1').scene.restart();
        });
    }

    updateLife(newLife) {
        this.life = newLife;
        this.lifeText.setText(`❤️ ${this.life}`);
    }
}
