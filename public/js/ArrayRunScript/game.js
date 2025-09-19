import BootScene from './scenes/BootScene.js';
import GameCompleteScene from './scenes/GameCompleteScene .js';
import GameOverScene from './scenes/GameOverScene.js';
import Level1 from './scenes/Level1.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1000 }, debug: false }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,            // siempre ocupa 100% de la ventana
        autoCenter: Phaser.Scale.CENTER_BOTH  // centra el canvas
    },
    scene: [BootScene, Level1, GameOverScene, GameCompleteScene]
};

const game = new Phaser.Game(config);


// Ajustar automáticamente si el usuario redimensiona la ventana
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight);
});
