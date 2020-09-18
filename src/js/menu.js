var Menu = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function Menu() {
        Phaser.Scene.call(this, { key: 'menu' });
    },

    preload: function() {
    },

    create: function() {
        this.add.text(400, 100, "Bears And Bees");
        this.playButton = this.add.sprite(400, 300, 'button');
        playButton.on('pointerdown', startGame)
    },

    startGame: function() {
        this.scene.start('game')
    }
})