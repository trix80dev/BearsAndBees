var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: 

    function Preloader() {
        Phaser.Scene.call(this, {
            key: 'preloader',
            pack: {
                files: [
                    {type: 'image', key: 'loadingbar', url: 'assets/images/loadingbar.png'}
                ]
            }
        });
    },

    preload: function() {
        this.loadingbar = this.add.sprite(400, 250, 'loadingbar');
        this.load.on('progress', this.onProgress, this);

        this.load.image('background', '/assets/images/background2.png')
        this.load.image('bee', '/assets/images/bee.png')
        this.load.image('honey', 'assets/images/honey.png')
        this.load.image('bear', '/assets/images/bear.png');
        this.load.image('deadbear', '/assets/images/deadbear.png')
        this.load.image('snail', '/assets/images/snail.png')
        this.load.image('bubble', '/assets/images/bubble.png')
        this.load.image('swatter', '/assets/images/swatter.png')
        this.load.image('bubblebear', '/assets/images/bubblebear.png')

        this.load.audio('beesting', 'assets/audio/beesting.mp3')
        this.load.audio('honeysound', '/assets/audio/honey.mp3')
        this.load.audio('music', '/assets/audio/music.wav')
        this.load.audio('powerup', '/assets/audio/powerup.mp3')
    },

    onProgress: function(value) {
        var w = Math.floor(this.loadingbar.width * value);

        this.loadingbar.frame.width = (w <= 0 ? 1 : w);
        this.loadingbar.frame.cutWidth = w;
        this.loadingbar.frame.updateUVs();
    },

    create: function() {
        this.loadingbar.destroy();

        this.scene.start('menu')
    }

})