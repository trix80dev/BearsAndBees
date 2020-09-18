import Phaser from 'phaser'

import Game from './scenes/Game'
import Preload from './scenes/Preload'

const config = {
    width: 800,
    height: 500,
    backgroundColor: 0x000000,
    type: Phaser.CANVAS,
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: { y: 0 }
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

var game = new Phaser.Game(config);

game.scene.add('preload', Preload)
game.scene.add('game', Game)

game.scene.start('preload')