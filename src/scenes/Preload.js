import Phaser from 'phaser'

export default class Preload extends Phaser.Scene
{
    preload()
    {
        this.load.image('background', '/assets/background2.png')
        this.load.image('bee', '/assets/bee.png')
        this.load.image('honey', 'assets/honey.png')
        this.load.image('bear', '/assets/bear.png');
        this.load.image('deadbear', '/assets/deadbear.png')
        this.load.image('snail', '/assets/snail.png')
        this.load.image('bubble', '/assets/bubble.png')
        this.load.image('swatter', '/assets/swatter.png')
        this.load.image('bubblebear', '/assets/bubblebear.png')
        this.load.audio('beesting', 'assets/beesting.mp3')
        this.load.audio('honeysound', '/assets/honey.mp3')
        this.load.audio('music', '/assets/music.wav')
        this.load.audio('powerup', '/assets/powerup.mp3')
    }

    create()
    {
        console.log("loaded")
        this.scene.start('game')
    }
}