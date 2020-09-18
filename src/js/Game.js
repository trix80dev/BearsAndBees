import Phaser from 'phaser'

var originalX, originalY, lineLength
var bear, line
var canJump

class Game extends Phaser.Scene {

    preload()
    {
        this.load.image('background', '/assets/background.png')
        this.load.image('bear', '/assets/bear.png');
    }

    create()
    {
        canJump = true
        this.add.image(0, 0, 'background').setOrigin(0, 0)
        bear = this.add.sprite(400, 250, 'bear').setOrigin(0.5,0.5).setScale(0.25, 0.25)
        bear.width = 1
        bear.height = 1
        line = this.add.line(
            0,
            0,
            0,
            0,
            0,
            0,
            0xffffff,
            ).setOrigin(0, 0).setVisible(false)
        this.physics.add.existing(bear)
        bear.body.setGravity(0, 200)
        bear.body.setCollideWorldBounds(true)

        bear.body.setVelocity(200, 200)

        this.input.on('pointerdown', function(pointer){
            if(canJump){
                originalX = pointer.x
                originalY = pointer.y
                bear.body.setGravity(0, 100)
                bear.body.velocity.y /= 2;
                bear.body.velocity.x /= 2
            }
        })

        this.input.on('pointerup', function(pointer){
            line.setVisible(false)
            if(canJump){
                bear.body.setGravity(0, 200)
                if(lineLength > 120){
                    if(bear.body.velocity.y != 0){
                        canJump = false
                    }
                    bear.body.setVelocity(pointer.x - originalX, pointer.y - originalY)
                } else {
                    bear.body.velocity.x *= 2
                    bear.body.velocity.y *= 2
                }
            }
        })

    }

    update()
    {
        if(bear.body.velocity.y == 0){
            bear.body.velocity.x = 0
            canJump = true
        }
        if(bear.body.velocity.x < 0) {
            bear.flipX = true
        } else {
            bear.flipX = false
        }
        if(canJump){
            var pointer = this.input.activePointer;
            lineLength = Math.sqrt(Math.pow(pointer.x - originalX, 2) + Math.pow(pointer.y - originalY, 2));
            if(pointer.isDown && lineLength > 120) {
                if(line.visible != true) {
                    line.setVisible(true)
                }
                line.setTo(
                    bear.x,
                    bear.y,
                    bear.x + pointer.x - originalX,
                    bear.y + pointer.y - originalY,
                )
            }
        }
    }
}

export default Game