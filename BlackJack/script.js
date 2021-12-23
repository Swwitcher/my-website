var argentJoueur = 100
var argentBanque = 100
var scoreBanque = 0
var scoreJoueur = 0
var valeurs = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
var couleurs = ["♠", "♣", "♥", "♦"]

function init() {
    document.getElementById("argentBanque").innerHTML = argentBanque
    document.getElementById("argentJoueur").innerHTML = argentJoueur

    var banque = document.getElementById("banque")
    banque.getElementsByTagName("span")[0].innerHTML = scoreBanque
    var joueur = document.getElementById("joueur")
    joueur.getElementsByTagName("span")[0].innerHTML = scoreJoueur
    newCard('banque')
    newCard('joueur')
    newCard('joueur')
}

function updateScore(joueur, val) {
    var res
    if(val == 0){
        res = 1
    } else if (val >= 9) {
        res = 10
    } else {
        res = val + 1
    }

    if(joueur == "banque") {
        scoreBanque += res
        if (res == 1 && scoreBanque <= 11)
            scoreBanque += 10
        var banque = document.getElementById("banque")
        banque.getElementsByTagName("span")[0].innerHTML = scoreBanque
    } else {
        scoreJoueur += res
        if (res == 1 && scoreJoueur <= 11)
            scoreJoueur += 10
        var joueur = document.getElementById("joueur")
        joueur.getElementsByTagName("span")[0].innerHTML = scoreJoueur
    }
}

function newCard(joueur) {
    var randValeur = Math.floor(Math.random() * valeurs.length)
    var randCouleur = Math.floor(Math.random() * couleurs.length)
    var valeur = valeurs[randValeur]
    var couleur = couleurs[randCouleur]
    var rouge = (couleur=="♥" || couleur=="♦")

    var card = document.createElement("div")
    if(rouge)
        card.setAttribute("class", "card card--margin card--small card--red")
    else
        card.setAttribute("class", "card card--margin card--small")

    card.innerHTML = "<div class=\"card__tab\"> "+valeur+" <span class=\"card__tab__symbol\">"+couleur+"</span></div><div class=\"card__tab card__tab--bottom\"> "+valeur+" <span class=\"card__tab__symbol\">"+couleur+"</span></div><div class=\"card__graphic\"><span class=\"element\">"+couleur+"</span><span class=\"element\">"+couleur+"</span><span class=\"element\">"+couleur+"</span><span class=\"element\">"+couleur+"</span></div>"
    
    var elt = document.getElementById(joueur)
    elt.appendChild(card)

    updateScore(joueur, randValeur)
}

function stop() {
    while(scoreBanque < 17)
        newCard('banque')
}