import Phaser from 'phaser'

var bear, bees, honey, scoreText
var snail, bubble, swatter
var speed = 600
var maxSpeed = 150
var beeSpeed = 50
var beeSpeedIncrement = 2
var score = 0
var xInput, yInput
var canDie, snailActive

var verticalBees = new Array(12).fill(false)
var horizontalBees = new Array(8).fill(false)

var honeySound, beeSound, powerupSound, music

class Game extends Phaser.Scene {

    preload()
    {
    }

    create()
    {
        //a
        music = this.sound.add('music')
        music.play({loop: true, volume: 0.25})
        this.add.image(0, 0, 'background').setOrigin(0, 0)
        bear = this.add.sprite(400, 250, 'bear').setOrigin(0.5,0.5).setScale(0.075, 0.075)

        this.physics.add.existing(bear)
        bear.body.setSize(800, 800)
        bees = this.physics.add.group()

        bear.body.setCollideWorldBounds(true)
        bear.body.setAllowDrag(true)
        bear.body.setDrag(150, 150)
        bear.body.setFriction(0, 0)
        bear.body.setMaxSpeed(maxSpeed, maxSpeed)

        honey = this.add.sprite(0, 0, 'honey').setScale(0.25, 0.25)
        this.physics.add.existing(honey)
        honey.body.setSize(150, 150)
        this.moveObjectRandom(honey)

        snail = this.add.sprite(0, 0, 'snail').setScale(0.2, 0.2).setVisible(false)
        bubble = this.add.sprite(0, 0, 'bubble').setScale(0.25, 0.25).setVisible(false)
        swatter = this.add.sprite(0, 0, 'swatter').setScale(0.15, 0.15).setVisible(false)
        this.physics.add.existing(snail)
        this.physics.add.existing(bubble)
        this.physics.add.existing(swatter)
        snail.body.setSize(200, 200)
        bubble.body.setSize(150, 150)
        swatter.body.setSize(200, 300)
        snail.body.enable = false
        bubble.body.enable = false
        swatter.body.enable = false

        this.physics.add.overlap(bear, bees, this.collideBee, null, this)
        this.physics.add.overlap(bear, honey, this.collideHoney, null, this)
        this.physics.add.overlap(bear, snail, this.collideSnail, null, this)
        this.physics.add.overlap(bear, bubble, this.collideBubble, null, this)
        this.physics.add.overlap(bear, swatter, this.collideSwatter, null, this)
        
        scoreText = this.add.text(400, 30, "Score: 0", { fontSize: 32}).setOrigin(0.5, 0.5)
            
        this.cursors = this.input.keyboard.addKeys({up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D})

        beeSound = this.sound.add('beesting')
        honeySound = this.sound.add('honeysound')
        powerupSound = this.sound.add('powerup')

        canDie = true
        snailActive = false

    }

    update()
    {
        xInput = 0
        yInput = 0
        if(this.cursors.up.isDown) {
            yInput -= 1
        }
        if(this.cursors.down.isDown) {
            yInput += 1
        }
        if(this.cursors.left.isDown) {
            xInput -= 1
        }
        if(this.cursors.right.isDown) {
            xInput += 1
        }
        if(xInput != 0 && yInput != 0){
            var magnitude = Math.sqrt((xInput * xInput) + (yInput * yInput))
            xInput /= magnitude
            yInput /= magnitude
        }
        if(bear.body.velocity.x < 0 && !bear.flipX) {
            bear.flipX = true
        }
        if(bear.body.velocity.x > 0 && bear.flipX) {
            bear.flipX = false
        }
        bear.body.setAcceleration(xInput * speed, yInput * speed)

        bees.getChildren().forEach(bee => {
            var velocity = bee.body.velocity
            if(velocity.x < 0 && bee.flipX && velocity.y == 0) {
                bee.flipX = false
            }
            if(velocity.x > 0 && !bee.flipX && velocity.y == 0) {
                bee.flipX = true
            }
            if(velocity.y < 0 && bee.flipX /*&& velocity.x == 0*/) {
                bee.flipX = false
            }
            if(velocity.y > 0 && !bee.flipX && velocity.x == 0) {
                bee.flipX = true
            }
            if(velocity.y != 0 && velocity.x != 0) {
                var angle = Math.atan2(velocity.y, velocity.x) + Math.PI
                if(velocity.x > 0 && !bee.flipY) {
                    bee.flipY = true
                }
                if(velocity.x < 0 && bee.flipY) {
                    bee.flipY = false
                }
                if(bee.rotation != angle) {
                    bee.setRotation(angle)
                }
            }
        });
    }

    collideHoney(bear, honey) {
        honeySound.play()
        score++
        this.spawnBee()
        this.moveObjectRandom(honey)
        scoreText.setText("Score: " + score)
        if(!snailActive){
            bees.getChildren().forEach(bee => {
                var v = bee.body.velocity
                bee.body.setVelocity(v.x == 0 ? 0 : Math.abs(v.x)/v.x * beeSpeed + Math.abs(v.x)/v.x * score * beeSpeedIncrement, v.y == 0 ? 0 : Math.abs(v.y)/v.y * beeSpeed + Math.abs(v.y)/v.y * score * beeSpeedIncrement)
            });
        }
        if(score % 6 == 0) {
            while (true){
                var choice = bees.getChildren()[bees.getChildren().length - 1]
                var velocity = choice.body.velocity
                if(velocity.x == 0) {
                    velocity.y = Math.abs(velocity.y)
                    velocity.x = velocity.y;
                    choice.setRotation(0)
                    choice.body.flipX = false
                    break
                } else if (velocity.y == 0) {
                    velocity.x = Math.abs(velocity.x)
                    velocity.y = velocity.x;
                    choice.setRotation(0)
                    choice.body.flipX = false
                    break
                }
            }
        }
        if(score % 8 == 0) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    this.moveObjectRandom(snail)
                    snail.setVisible(true)
                    snail.body.enable = true
                    break
                case 1:
                    this.moveObjectRandom(bubble)
                    bubble.setVisible(true)
                    bubble.body.enable = true
                    break
                case 2:
                    this.moveObjectRandom(swatter)
                    swatter.setVisible(true)
                    swatter.body.enable = true
                    break
            }
        }
    }

    collideSnail(bear, snail) {
        powerupSound.play()
        snailActive = true
        beeSpeed /= 2
        bees.getChildren().forEach(bee => {
            bee.body.velocity.x /= 2
            bee.body.velocity.y /=2
        })
        this.time.addEvent({delay: 4000, callback: this.removeSnailEffect})
        snail.visible = false
        snail.body.enable = false
    }

    removeSnailEffect() {
        snailActive = false
        beeSpeed *= 2
        bees.getChildren().forEach(bee => {
            bee.body.velocity.x *= 2
            bee.body.velocity.y *= 2
        })
    }

    collideBubble(bear, bubble) {
        powerupSound.play()
        canDie = false
        bear.setTexture('bubblebear')
        this.time.addEvent({delay: 4000, callback: this.removeBubbleEffect})
        bubble.visible = false
        bubble.body.enable = false
    }

    removeBubbleEffect() {
        bear.setTexture('bear')
        canDie = true
    }

    collideSwatter(bear, swatter) {
        powerupSound.play()
        var bee = bees.getChildren()[Math.floor(Math.random() * bees.getChildren().length)]
        bees.remove(bee)
        bee.visible = false
        bee.body.enable = false
        swatter.visible = false
        swatter.body.enable = false
    }

    collideBee(bear, bee) {
        if(!canDie) return

        bear.visible = false
        bear.body.enable = false
        honey.visible = false
        scoreText.visible = false

        this.add.image(400, 250, 'deadbear').setOrigin(0.5, 0.5).setScale(0.5, 0.5)
        this.add.text(400, 250, "You Lost!\nScore: " + score, { fontSize: 64}).setOrigin(0.5, 0.5)
        
        bees.getChildren().forEach(bee => {
            bee.visible = false
            bee.body.enable = false
        });

        beeSound.play()
        music.pause()
    } 

    spawnBee()
    {
        while(true){
            if(verticalBees.every(value => value == true) && horizontalBees.every(value => value == true)){
                //console.log("you win!")
                return
            }
            if(Math.floor(Math.random() * 2) == 0) {
                //horizontal
                var num = Math.floor(Math.random() * horizontalBees.length)
                if(!horizontalBees[num]) {
                    horizontalBees[num] = true
                    var bee = this.add.sprite(bear.x > 400 ? Math.floor(Math.random() * 200 + 20) : Math.floor(Math.random() * 200 + 580), num * this.game.canvas.height/horizontalBees.length + this.game.canvas.height/(horizontalBees.length * 2), 'bee').setScale(0.1, 0.1)
                    bees.add(bee)
                    this.physics.add.existing(bee)
                    bee.body.setSize(250, 150)
                    bee.body.setCollideWorldBounds(true, 1, 1)
                    bee.body.setVelocity(Math.floor(Math.random() * 2) == 0 ? -beeSpeed : beeSpeed, 0)
                    break
                }
            } else {
                //vertical
                var num = Math.floor(Math.random() * verticalBees.length)
                if(!verticalBees[num]) {
                    verticalBees[num] = true
                    var bee = this.add.sprite(num * this.game.canvas.width/verticalBees.length + this.game.canvas.width/(verticalBees.length * 2), bear.y > 250 ? Math.floor(Math.random() * 100 + 20) : Math.floor(Math.random() * 100 + 320), 'bee').setScale(0.1, 0.1).setRotation(Math.PI/2)
                    bees.add(bee)
                    this.physics.add.existing(bee)
                    bee.body.setSize(200    , 200)
                    bee.body.setCollideWorldBounds(true, 1, 1)
                    bee.body.setVelocity(0, Math.floor(Math.random() * 2) == 0 ? -beeSpeed : beeSpeed)
                    break
                }
            }
        }
    }

    moveObjectRandom(object) {
        while(true){
            var x = Math.floor(Math.random() * 700 + 50)
            var y = Math.floor(Math.random() * 400 + 50)
            if(Math.abs(x - bear.x) > 100 && Math.abs(y - bear.y) > 60) {
                object.x = x
                object.y = y
                break
            }
        }
    }
}

export default Game