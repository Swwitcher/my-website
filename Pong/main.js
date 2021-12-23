var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y:0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var gamexx
game = new Phaser.Game(config)

function preload ()
{
    this.load.image('ball', 'img/square.png')
    this.load.image('platform', 'img/platform.png')
    
}

var platformU, platformD
var ball
var ballSpeed
var start
function create ()
{
    play()
    
    platformU = this.physics.add.sprite(200, 50, 'platform').setScale(0.2)
    platformD = this.physics.add.sprite(200, 550, 'platform').setScale(0.2)
    platformU.setCollideWorldBounds(true)
    platformD.setCollideWorldBounds(true)
    
    platformU.body.setImmovable()
    platformD.body.setImmovable()
    
    ball = this.physics.add.sprite(200, 300, 'ball').setScale(0.5)
    ball.body.bounce.setTo(1, 1)
    ball.setCollideWorldBounds(true)
    
    this.physics.add.collider(ball, platformD)
    this.physics.add.collider(ball, platformU)
    
    
}

var cursors
function update ()
{
    platformD.setVelocityX(0)
    platformU.setVelocityX(0)
    
    cursors = this.input.keyboard.addKeys(
{leftU:Phaser.Input.Keyboard.KeyCodes.Q,
rightU:Phaser.Input.Keyboard.KeyCodes.D,
leftD:Phaser.Input.Keyboard.KeyCodes.LEFT,
rightD:Phaser.Input.Keyboard.KeyCodes.RIGHT,
space:Phaser.Input.Keyboard.KeyCodes.SPACE});
    
    if(cursors.leftD.isDown)
        platformD.setVelocityX(-160)
    if(cursors.rightD.isDown)
        platformD.setVelocityX(160)
    if(cursors.leftU.isDown)
        platformU.setVelocityX(-160)
    if(cursors.rightU.isDown)
        platformU.setVelocityX(160)
    if(cursors.space.isDown && !start){
        start = true
        ball.setVelocityX(Phaser.Math.FloatBetween(-100, 100))
        if(Math.floor(Math.random() * 2) == 0)
            ballSpeed *= -1
        ball.setVelocityY(ballSpeed)
    }
    
    if(ball.body.touching.down && cursors.leftD.isDown)
        ball.setVelocityX(Phaser.Math.FloatBetween(-200, -100))
    else if(ball.body.touching.down && cursors.rightD.isDown)
        ball.setVelocityX(Phaser.Math.FloatBetween(100, 200))
    else if(ball.body.touching.down)
        ball.setVelocityX(Phaser.Math.FloatBetween(-50, 50))
    
    if(ball.body.touching.up && cursors.leftU.isDown)
        ball.setVelocityX(Phaser.Math.FloatBetween(-200, -100))
    else if(ball.body.touching.up && cursors.rightU.isDown)
        ball.setVelocityX(Phaser.Math.FloatBetween(100, 200))
    else if(ball.body.touching.up)
        ball.setVelocityX(Phaser.Math.FloatBetween(-50, 50))
    
    if(ball.body.touching.down || ball.body.touching.up)
        increaseSpeed()
    
    if(ball.body.blocked.up || ball.body.blocked.down)
        this.scene.restart()
}

function play() {
    start = false
    ballSpeed = 200
    
}

function increaseSpeed() {
    ballSpeed *= -1
    ballSpeed += ballSpeed>0 ? 50 : -50
    if(ballSpeed > 1200)
        ballSpeed = 1200
    if(ballSpeed < -1200)
        ballSpeed = -1200
    ball.setVelocityY(ballSpeed)
}
