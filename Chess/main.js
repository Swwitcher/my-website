 var size = Math.min(window.innerHeight, window.innerWidth) -25

var config = {
    type: Phaser.AUTO,
    width: size,
    height: size,
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
}

var game = new Phaser.Game(config)

function preload ()
{
    this.load.image('white', 'img/white.png')
    this.load.image('black', 'img/black.png')
    this.load.image('green', 'img/green.png')
    this.load.image('kingB', 'img/white/king.png')
    this.load.image('kingN', 'img/black/king.png')
    this.load.image('queenB', 'img/white/queen.png')
    this.load.image('queenN', 'img/black/queen.png')
    this.load.image('cavalierB', 'img/white/cavalier.png')
    this.load.image('cavalierN', 'img/black/cavalier.png')
    this.load.image('fouB', 'img/white/fou.png')
    this.load.image('fouN', 'img/black/fou.png')
    this.load.image('tourB', 'img/white/tour.png')
    this.load.image('tourN', 'img/black/tour.png')
    this.load.image('pionB', 'img/white/pion.png')
    this.load.image('pionN', 'img/black/pion.png')

}

var grid
var pawnTab = []
var spriteTab = []
var colorTab = []
function create ()
{
    grid = this.physics.add.staticGroup();
    for(var x = 0; x < 8; x++){
        for(var y = 0; y<8; y++){
            x%2==0 && y%2==0 || x%2==1 && y%2==1 ?
            grid.create(gridToCoord(x), gridToCoord(y), 'white').setScale(size/32/8).refreshBody()
            : grid.create(gridToCoord(x), gridToCoord(y), 'black').setScale(size/32/8).refreshBody()
        }
    }
    fillPawnTab()
    fillColorTab()
    for(x = 0; x < 8; x++){
        for(y = 0; y < 8; y++){
            if(pawnTab[XYToInd(x, y)] != 'vide')
                spriteTab[XYToInd(x, y)] = this.add.image(gridToCoord(x), gridToCoord(y), pawnTab[XYToInd(x, y)]).setScale(size/200/8)
        }
    }
}

var pointer
var greenCases = []
var moves = []
var attackMoves = []
var rockMoves = []
var toMove = []
var selected = false
var wasPressed = false
var turn = 'White'
var tourLB = false, tourRB = false, kingB = false
var tourLN = false, tourRN = false, kingN = false
function update ()
{
    var cpt, a
    var moveActu
   
   
    pointer = this.input.activePointer
    var mouse = pointerToCoord(pointer)
    if (pointer.isDown && !wasPressed && !selected) {
        wasPressed = true
   
        for(cpt = 0; cpt < greenCases.length; cpt++)
            greenCases[cpt].destroy()
        if(colorTab[XYToInd(mouse[0], mouse[1])] != turn)
            return
        moves = possibleMoves(mouse[0], mouse[1])
        attackMoves = possibleAttacks(mouse[0], mouse[1])
        rockMoves = possibleRock(mouse[0], mouse[1], tourLB, tourRB, tourLN, tourRN, kingB, kingN)
        for(a = 0; a < moves.length; a++){
            moveActu = moves[a]
            greenCases.push(this.add.image(gridToCoord(moveActu[0]), gridToCoord(moveActu[1]), 'green').setScale(size/32/8))
        }
        for(a = 0; a < attackMoves.length; a++){
            moveActu = attackMoves[a]
            greenCases.push(this.add.image(gridToCoord(moveActu[0]), gridToCoord(moveActu[1]), 'green').setScale(size/32/8))
        }
        for(a = 0; a < rockMoves.length; a++){
            moveActu = rockMoves[a]
            greenCases.push(this.add.image(gridToCoord(moveActu[0]), gridToCoord(moveActu[1]), 'green').setScale(size/32/8))
        }
        toMove = mouse
        if(moves.length + attackMoves.length > 0)
            selected = true
    } else if (pointer.isDown && !wasPressed && selected) {
       
        wasPressed = true
        for(cpt = 0; cpt < greenCases.length; cpt++)
                greenCases[cpt].destroy()
        if(isEmpty(mouse[0], mouse[1]))
            selected = false
        if(isAMove(mouse[0], mouse[1], moves, moves.length)){
            move(toMove, mouse)
            changeColor()
            selected = false
        }
        if(isAMove(mouse[0], mouse[1], attackMoves, attackMoves.length)){
            attack(toMove, mouse)
            changeColor()
            selected = false
        }
        if(isAMove(mouse[0], mouse[1], rockMoves, rockMoves.length)){
            move(toMove, mouse)
            if(mouse[1] == 0){
                if(mouse[0] == 1)
                    move([0, 0], [2, 0])
                if(mouse[0] == 5)
                    move([7, 0], [4, 0])
            }
            if(mouse[1] == 7){
                if(mouse[0] == 1)
                    move([0, 7], [2, 7])
                if(mouse[0] == 5)
                    move([7, 7], [4, 7])
            }
            changeColor()
            selected = false
        }
        else {
            if(colorTab[XYToInd(mouse[0], mouse[1])] != turn)
                return
            moves = possibleMoves(mouse[0], mouse[1])
            attackMoves = possibleAttacks(mouse[0], mouse[1])
            for(a = 0; a < moves.length; a++){
                moveActu = moves[a]
                greenCases.push(this.add.image(gridToCoord(moveActu[0]), gridToCoord(moveActu[1]), 'green').setScale(size/32/8))
            }
            for(a = 0; a < attackMoves.length; a++){
                moveActu = attackMoves[a]
                greenCases.push(this.add.image(gridToCoord(moveActu[0]), gridToCoord(moveActu[1]), 'green').setScale(size/32/8))
            }
            toMove = mouse
            if(moves.length + attackMoves.length > 0)
                selected = true
        }
        if(pawnTab[0] != 'tourB')
            tourLB = true
        if(pawnTab[7] != 'tourB')
            tourRB = true
        if(pawnTab[56] != 'tourN')
            tourLN = true
        if(pawnTab[63] != 'tourN')
            tourRN = true
        if(pawnTab[3] != 'kingB')
            kingB = true
        if(pawnTab[59] != 'kingN')
            kingN = true
    }
   
    if(!pointer.isDown)
        wasPressed = false
}

function move (from, to)
{
    var tmp
    var f = XYToInd(from[0], from[1])
    var t = XYToInd(to[0], to[1])
    pawnTab[t] = pawnTab[f]
    pawnTab[f] = 'vide'
   
    spriteTab[f].setPosition(gridToCoord(to[0]), gridToCoord(to[1]))
    spriteTab[t] = spriteTab[f]
   
    colorTab[t] = colorTab[f]
    colorTab[f] = 'None'
   
    if(pawnTab[XYToInd(to[0], to[1])] == 'pionB' && to[1] == 7){
        pawnTab[XYToInd(to[0], to[1])] = 'queenB'
        tmp = spriteTab[XYToInd(to[0], to[1])]
        tmp.setTexture('queenB')
    }
    if(pawnTab[XYToInd(to[0], to[1])] == 'pionN' && to[1] == 0){
        pawnTab[XYToInd(to[0], to[1])] = 'queenN'
        tmp = spriteTab[XYToInd(to[0], to[1])]
        tmp.setTexture('queenN')
    }
}

function changeColor()
{
    if(turn == 'White')
        turn = 'Black'
    else
        turn = 'White'
}

function attack (from, to)
{
    var tmp
    var f = XYToInd(from[0], from[1])
    var t = XYToInd(to[0], to[1])
   
    spriteTab[t].destroy()
    pawnTab[t] = pawnTab[f]
    pawnTab[f] = 'vide'
   
    spriteTab[f].setPosition(gridToCoord(to[0]), gridToCoord(to[1]))
    spriteTab[t] = spriteTab[f]
   
    colorTab[t] = colorTab[f]
    colorTab[f] = 'None'
   
    if(pawnTab[XYToInd(to[0], to[1])] == 'pionB' && to[1] == 7){
        pawnTab[XYToInd(to[0], to[1])] = 'queenB'
        tmp = spriteTab[XYToInd(to[0], to[1])]
        tmp.setTexture('queenB')
    }
    if(pawnTab[XYToInd(to[0], to[1])] == 'pionN' && to[1] == 0){
        pawnTab[XYToInd(to[0], to[1])] = 'queenN'
        tmp = spriteTab[XYToInd(to[0], to[1])]
        tmp.setTexture('queenN')
    }
}

function pointerToCoord (pointer)
{
    for(var i = 0; i<8; i++){
        for(var j = 0; j<8; j++){
            if(pointer.x > (size/8)*i && pointer.x < (size/8)*(i+1)
            && pointer.y > (size/8)*j && pointer.y < (size/8)*(j+1))
            return [i, j]
        }
    }
    return [-1, -1]
}

function isCheck (color)
{
    var res, actuAttack, attacks
    if(color == 'White')
        for(var cpt = 0; cpt < 64; cpt++){
            if(pawnTab[cpt] == 'kingB')
                res = cpt
        }
    for(var x = 0; x < 8; x++){
        for(var y = 0; y < 8; y++){
            actuAttack = possibleAttacks(x, y)
            for(var a = 0; a < actuAttack.length; a++){
                attacks = actuAttack[a]
                if(XYToInd(attacks[0], attacks[1]) == res)
                    return true
            }
        }
    }
    return false
}
function possibleRock(x, y, tourLB, tourRB, tourLN, tourRN, kingB, kingN)
{
    var res = []
    if(x <= -1 || y <= -1)
        return res
    var piece = pawnTab[XYToInd(x, y)]

    if(piece == 'kingB' && !kingB && !tourLB && isEmpty(x-1, y) && isEmpty(x-2, y))
            res.push([x-2, y])
    if(piece == 'kingB' && !kingB && !tourRB && isEmpty(x+1, y) && isEmpty(x+2, y) && isEmpty(x+3, y))
            res.push([x+2, y])
    if(piece == 'kingN' && !kingN && !tourLN && isEmpty(x-1, y) && isEmpty(x-2, y))
            res.push([x-2, y])
    if(piece == 'kingN' && !kingN && !tourRN && isEmpty(x+1, y) && isEmpty(x+2, y) && isEmpty(x+3, y))
            res.push([x+2, y])
    return res
}
function possibleMoves (x, y)
{
    var i, j
    var res = []
    if(x <= -1 || y <= -1)
        return res
    var piece = pawnTab[XYToInd(x, y)]
   
    if(piece == 'kingB' || piece == 'kingN'){
        if(isEmpty(x-1, y))
            res.push([x-1, y])
        if(isEmpty(x-1, y-1))
            res.push([x-1, y-1])
        if(isEmpty(x, y-1))
            res.push([x, y-1])
        if(isEmpty(x+1, y-1))
            res.push([x+1, y-1])
        if(isEmpty(x+1, y))
            res.push([x+1, y])
        if(isEmpty(x+1, y+1))
            res.push([x+1, y+1])
        if(isEmpty(x, y+1))
            res.push([x, y+1])
        if(isEmpty(x-1, y+1))
            res.push([x-1, y+1])            
    } else if(piece == 'queenB' || piece == 'queenN'){
        for(i = x+1; i < 8; i++){
            if(!isEmpty(i, y))
                break
            res.push([i, y])
        }
        for(i = x-1; i >= 0; i--){
            if(!isEmpty(i, y))
                break
            res.push([i, y])
        }
        for(i = y+1; i < 8; i++){
            if(!isEmpty(x, i))
                break
            res.push([x, i])
        }
        for(i = y-1; i >= 0; i--){
            if(!isEmpty(x, i))
                break
            res.push([x, i])
        }
        j = y
        for(i = x+1; i < 8; i++){
            j++
            if(!isEmpty(i, j))
                break
            res.push([i, j])
        }
        j = y
        for(i = x-1; i >= 0; i--){
            j--
            if(!isEmpty(i, j))
                break
            res.push([i, j])
        }
        j = y
        for(i = x+1; i < 8; i++){
            j--
            if(!isEmpty(i, j))
                break
            res.push([i, j])
        }
        j = y
        for(i = x-1; i >= 0; i--){
            j++
            if(!isEmpty(i, j))
                break
            res.push([i, j])
        }
           
    } else if(piece == 'fouB' || piece == 'fouN'){
        j = y
        for(i = x+1; i < 8; i++){
            j++
            if(!isEmpty(i, j))
                break
            res.push([i, j])
        }
        j = y
        for(i = x-1; i >= 0; i--){
            j--
            if(!isEmpty(i, j))
                break
            res.push([i, j])
        }
        j = y
        for(i = x+1; i < 8; i++){
            j--
            if(!isEmpty(i, j))
                break
            res.push([i, j])
        }
        j = y
        for(i = x-1; i >= 0; i--){
            j++
            if(!isEmpty(i, j))
                break
            res.push([i, j])
        }
       
    } else if(piece == 'cavalierB' || piece == 'cavalierN'){
        if(isEmpty(x-1, y+2))
            res.push([x-1, y+2])
        if(isEmpty(x-1, y-2))
            res.push([x-1, y-2])
        if(isEmpty(x+1, y+2))    
            res.push([x+1, y+2])
        if(isEmpty(x+1, y-2))
            res.push([x+1, y-2])
        if(isEmpty(x-2, y+1))
            res.push([x-2, y+1])
        if(isEmpty(x-2, y-1))
            res.push([x-2, y-1])
        if(isEmpty(x+2, y+1))
            res.push([x+2, y+1])
        if(isEmpty(x+2, y-1))
            res.push([x+2, y-1])
           
    } else if(piece == 'tourB' || piece == 'tourN'){
        for(i = x+1; i < 8; i++){
            if(!isEmpty(i, y))
                break
            res.push([i, y])
        }
        for(i = x-1; i >= 0; i--){
            if(!isEmpty(i, y))
                break
            res.push([i, y])
        }
        for(i = y+1; i < 8; i++){
            if(!isEmpty(x, i))
                break
            res.push([x, i])
        }
        for(i = y-1; i >= 0; i--){
            if(!isEmpty(x, i))
                break
            res.push([x, i])
        }
           
    } else if(piece == 'pionB'){
        if(!isEmpty(x, y+1))
            return res
        res.push([x, y+1])
        if(y == 1 && isEmpty(x, y+2))
            res.push([x, y+2])
           
    } else if(piece == 'pionN'){
        if(!isEmpty(x, y-1))
            return res
        res.push([x, y-1])
        if(y == 6 && isEmpty(x, y-2))
            res.push([x, y-2])
    }
    return res
}

function XYToInd (x, y)
{
    return x + (y*8)
}

function gridToCoord (x)
{
    return x*size/8 + size/16
}

function isAMove (x, y, moves, n)
{
    var moveActu
    for(var a = 0; a < n; a++){
        moveActu = moves[a]
       if(x == moveActu[0] && y == moveActu[1])
           return true
    }
    return false
}

function possibleAttacks (x, y)
{
    var i, j
    var res = []
    if(x <= -1 || y <= -1)
        return res
    var piece = pawnTab[XYToInd(x, y)]
    var color = colorTab[XYToInd(x, y)]
   
     if(piece == 'kingB' || piece == 'kingN'){
        if(isEnemy(x+1, y+1, color))
            res.push([x+1, y+1])
        if(isEnemy(x-1, y, color))
            res.push([x-1, y])
        if(isEnemy(x-1, y-1, color))
            res.push([x-1, y-1])
        if(isEnemy(x, y-1, color))
            res.push([x, y-1])
        if(isEnemy(x+1, y-1, color))
            res.push([x+1, y-1])
        if(isEnemy(x+1, y, color))
            res.push([x+1, y])
        if(isEnemy(x+1, y+1, color))
            res.push([x+1, y+1])
        if(isEnemy(x, y+1, color))
            res.push([x, y+1])
        if(isEnemy(x-1, y+1, color))
            res.push([x-1, y+1])
         
     } else if(piece == 'queenB' || piece == 'queenN'){
        for(i = x+1; i < 8; i++){
            if(!isEmpty(i, y)){
                if(isEnemy(i, y, color))
                    res.push([i, y])
                break
            }
        }
        for(i = x-1; i >= 0; i--){
            if(!isEmpty(i, y)){
                if(isEnemy(i, y, color))
                    res.push([i, y])
                break
            }
        }
        for(i = y+1; i < 8; i++){
            if(!isEmpty(x, i)){
                if(isEnemy(x, i, color))
                    res.push([x, i])
                break
            }
        }
        for(i = y-1; i >= 0; i--){
            if(!isEmpty(x, i)){
                if(isEnemy(x, i, color))
                    res.push([x, i])
                break
            }
        }
        j = y
        for(i = x+1; i < 8; i++){
            j++
            if(!isEmpty(i, j)){
                if(isEnemy(i, j, color))
                    res.push([i, j])
                break
            }
               
        }
        j = y
        for(i = x-1; i >= 0; i--){
            j++
            if(!isEmpty(i, j)){
                if(isEnemy(i, j, color))
                    res.push([i, j])
                break
            }
               
        }
        j = y
        for(i = x+1; i < 8; i++){
            j--
            if(!isEmpty(i, j)){
                if(isEnemy(i, j, color))
                    res.push([i, j])
                break
            }
               
        }
        j = y
        for(i = x-1; i >= 0; i--){
            j--
            if(!isEmpty(i, j)){
                if(isEnemy(i, j, color))
                    res.push([i, j])
                break
            }
               
        }
     } else if(piece == 'fouB' || piece == 'fouN'){
        j = y
        for(i = x+1; i < 8; i++){
            j++
            if(!isEmpty(i, j)){
                if(isEnemy(i, j, color))
                    res.push([i, j])
                break
            }
               
        }
        j = y
        for(i = x-1; i >= 0; i--){
            j++
            if(!isEmpty(i, j)){
                if(isEnemy(i, j, color))
                    res.push([i, j])
                break
            }
               
        }
        j = y
        for(i = x+1; i < 8; i++){
            j--
            if(!isEmpty(i, j)){
                if(isEnemy(i, j, color))
                    res.push([i, j])
                break
            }
               
        }
        j = y
        for(i = x-1; i >= 0; i--){
            j--
            if(!isEmpty(i, j)){
                if(isEnemy(i, j, color))
                    res.push([i, j])
                break
            }
               
        }
     } else if(piece == 'cavalierB' || piece == 'cavalierN'){
        if(isEnemy(x-1, y+2, color))
            res.push([x-1, y+2])
        if(isEnemy(x-1, y-2, color))
            res.push([x-1, y-2])
        if(isEnemy(x+1, y+2, color))    
            res.push([x+1, y+2])
        if(isEnemy(x+1, y-2, color))
            res.push([x+1, y-2])
        if(isEnemy(x-2, y+1, color))
            res.push([x-2, y+1])
        if(isEnemy(x-2, y-1, color))
            res.push([x-2, y-1])
        if(isEnemy(x+2, y+1, color))
            res.push([x+2, y+1])
        if(isEnemy(x+2, y-1, color))
            res.push([x+2, y-1])
         
     } else if(piece == 'tourB' || piece == 'tourN'){
        for(i = x+1; i < 8; i++){
            if(!isEmpty(i, y)){
                if(isEnemy(i, y, color))
                    res.push([i, y])
                break
            }
        }
        for(i = x-1; i >= 0; i--){
            if(!isEmpty(i, y)){
                if(isEnemy(i, y, color))
                    res.push([i, y])
                break
            }
        }
        for(i = y+1; i < 8; i++){
            if(!isEmpty(x, i)){
                if(isEnemy(x, i, color))
                    res.push([x, i])
                break
            }
        }
        for(i = y-1; i >= 0; i--){
            if(!isEmpty(x, i)){
                if(isEnemy(x, i, color))
                    res.push([x, i])
                break
            }
        }
         
     } else if(piece == 'pionB'){
         if(isEnemy(x-1, y+1, color))
            res.push([x-1, y+1])
         if(isEnemy(x+1, y+1, color))
            res.push([x+1, y+1])
     } else if(piece == 'pionN'){
         if(isEnemy(x-1, y-1, color))
            res.push([x-1, y-1])
         if(isEnemy(x+1, y-1, color))
            res.push([x+1, y-1])
     }
    return res
}
   
function isEnemy (x, y, color)
{
    var enemyColor = colorTab[XYToInd(x, y)]
    var revColor
    if(enemyColor == 'White')
        revColor = 'Black'
    else if (enemyColor == 'Black')
        revColor = 'White'
    return (color == revColor)
}

function isEmpty (x, y)
{
    return (pawnTab[XYToInd(x, y)] == 'vide' || pawnTab[XYToInd(x, y)] == undefined)
}

function fillColorTab ()
{
    var x
    for(x = 0; x < 16; x++)
        colorTab[x] = 'White'
    for(x = 16; x < 48; x++)
        colorTab[x] = 'None'
    for(x = 48; x < 64; x++)
        colorTab[x] = 'Black'
}

function fillPawnTab ()
{
    var x
    for(x = 0; x<64; x++)
        pawnTab[x] = 'vide'
    pawnTab[0] = 'tourB'
    pawnTab[1] = 'cavalierB'
    pawnTab[2] = 'fouB'
    pawnTab[3] = 'kingB'
    pawnTab[4] = 'queenB'
    pawnTab[5] = 'fouB'
    pawnTab[6] = 'cavalierB'
    pawnTab[7] = 'tourB'
    for(x = 8; x<16; x++)
        pawnTab[x] = 'pionB'
    for(x = 48; x<56; x++)
        pawnTab[x] = 'pionN'
    pawnTab[56] = 'tourN'
    pawnTab[57] = 'cavalierN'
    pawnTab[58] = 'fouN'
    pawnTab[59] = 'kingN'
    pawnTab[60] = 'queenN'
    pawnTab[61] = 'fouN'
    pawnTab[62] = 'cavalierN'
    pawnTab[63] = 'tourN'
}

