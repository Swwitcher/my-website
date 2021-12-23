var config = {
    type: Phaser.AUTO,
    width: window.innerWidth-20,
    height: window.innerHeight-20,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config)
var colors
var colorsPhone
function preload ()
{
    this.load.image('blue', 'img/blue.png')
    this.load.image('green', 'img/green.png')
    this.load.image('red', 'img/red.png')
    this.load.image('white', 'img/white.png')
    this.load.image('yellow', 'img/yellow.png')
    colors = ['blue', 'green', 'red', 'white', 'yellow']
    
    this.load.image('bluePhone', 'img/bluePhone.png')
    this.load.image('greenPhone', 'img/greenPhone.png')
    this.load.image('redPhone', 'img/redPhone.png')
    this.load.image('whitePhone', 'img/whitePhone.png')
    this.load.image('yellowPhone', 'img/yellowPhone.png')
    colorsPhone = ['bluePhone', 'greenPhone', 'redPhone', 'whitePhone', 'yellowPhone']
}


var logo
var phone
function create ()
{
console.log(window.innerWidth)
    phone = window.innerHeight > window.innerWidth
    var res = window.innerWidth * 0.0003
    if(phone){
        logo = this.physics.add.sprite(200, 100, 'whitePhone').setScale(res)
    }
    else{
        logo = this.physics.add.sprite(200, 100, 'white').setScale(res)
    }
    logo.setCollideWorldBounds(true)
    logo.setBounce(1)
    logo.setVelocityX(window.innerWidth/3)
    logo.setVelocityY(window.innerHeight/5)
}

var x
function update ()
{       
    if(logo.body.blocked.left || logo.body.blocked.right || logo.body.blocked.up || logo.body.blocked.down ){
        do{
            var tmp = Math.floor(Math.random() * colors.length)
        } while(tmp==x)
        x = tmp
        if(phone){
            logo.setTexture(colorsPhone[x])
        }
        else{
            logo.setTexture(colors[x])
        }
    }
}
