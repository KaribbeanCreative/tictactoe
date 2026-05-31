// 1. Déclarer la surface du jeu ;
// 2. Déclarer les combinaisons gagnantes pour savoir lesquelles sont perdantes ;
// 3. Le joueur X joue ;
// 4. Le joueur O joue ;
// 5. SI combinaison gagnante afficher quel joueur à gagner et terminer la partie ;
// 6. SINON afficher : match nul veuillez recommencer ;

     //getElementById()
     //querySelectorAll()
     //addEventListener()

// Joueur courant (on changera sa valeur entre X et O)
let player = "X";

// Mémorise qui commence la manche, pour alterner d'une manche à l'autre
let joueurQuiCommence = "X";

// Indique si la manche en cours est terminée (victoire ou match nul)
let partieTerminee = false;

// Scores des joueurs et objectif pour gagner le match
let scoreX = 0;
let scoreO = 0;
const OBJECTIF = 5;

// Indique si le match complet est gagné (un joueur a atteint l'objectif)
let matchTermine = false;

const game = ["","","","","","","","",""];

const winCombinaison = [
     [0,1,2],
     [3,4,5],
     [6,7,8],
     [0,3,6],
     [1,4,7],
     [2,5,8],
     [0,4,8],
     [2,4,6]
]

// Renvoie tous les éléments qui correspondent à la class .cell
const element = document.querySelectorAll(".cell")

// Le titre qui affiche les infos (tour du joueur, victoire, match nul)
const info = document.querySelector(".info")

// Le bouton Recommencer
const restart = document.getElementById("restart")

// Les compteurs de score affichés
const scoreXElement = document.getElementById("score-x")
const scoreOElement = document.getElementById("score-o")

// L'overlay de victoire et ses éléments
const overlay = document.getElementById("overlay")
const confettiContainer = document.getElementById("confetti")
const victoryTitle = document.getElementById("victory-title")
const newMatchBtn = document.getElementById("new-match")

// Au démarrage on indique à qui de jouer
info.textContent = "Au tour du joueur " + player

// 3 & 4 : un joueur joue quand il clique sur une case
function manipClik(event) {
     const cell = event.target
     const index = parseInt(cell.dataset.index)

     // On ignore le clic si la case est déjà prise ou si la partie est finie
     if (game[index] !== "" || partieTerminee) {
          return
     }

     // On enregistre le coup et on l'affiche
     game[index] = player
     cell.textContent = player
     // On ajoute la classe de couleur néon (.x cyan ou .o magenta)
     cell.classList.add(player === "X" ? "x" : "o")

     // 5 & 6 : on vérifie l'état de la partie
     if (verifierVictoire()) {
          partieTerminee = true

          // Le joueur courant marque un point
          if (player === "X") {
               scoreX++
          } else {
               scoreO++
          }
          majScores()

          // A-t-il atteint l'objectif et donc gagné le match ?
          const scoreCourant = (player === "X") ? scoreX : scoreO
          if (scoreCourant >= OBJECTIF) {
               matchTermine = true
               info.textContent = "Le joueur " + player + " remporte le match ! Cliquez sur Recommencer"
               afficherVictoire(player)
          } else {
               info.textContent = "Le joueur " + player + " marque !"
          }
     } else if (matchNul()) {
          info.textContent = "Match nul, veuillez recommencer"
          partieTerminee = true
     } else {
          // On change de joueur
          player = (player === "X") ? "O" : "X"
          info.textContent = "Au tour du joueur " + player
     }
}

// Met à jour l'affichage des scores
function majScores() {
     scoreXElement.textContent = scoreX
     scoreOElement.textContent = scoreO
}

// Affiche l'overlay de victoire avec le nom du gagnant et lance les confettis
function afficherVictoire(gagnant) {
     victoryTitle.textContent = "Joueur " + gagnant + " gagne !"
     overlay.classList.add("show")
     lancerConfettis()
}

// Génère des confettis colorés qui tombent dans l'overlay
function lancerConfettis() {
     const couleurs = ["#00f0ff", "#ff00c8", "#ffe600", "#00ff88", "#ff5500"]
     confettiContainer.innerHTML = ""
     for (let i = 0; i < 80; i++) {
          const confetti = document.createElement("div")
          confetti.classList.add("confetti")
          confetti.style.left = Math.random() * 100 + "%"
          confetti.style.backgroundColor = couleurs[Math.floor(Math.random() * couleurs.length)]
          confetti.style.animationDuration = (2 + Math.random() * 2) + "s"
          confetti.style.animationDelay = Math.random() * 0.5 + "s"
          confettiContainer.appendChild(confetti)
     }
}

// 2 : on parcourt les combinaisons gagnantes pour savoir si le joueur courant en a une
function verifierVictoire() {
     return winCombinaison.some(function(combinaison) {
          const [a, b, c] = combinaison
          return game[a] !== "" && game[a] === game[b] && game[b] === game[c]
     })
}

// Match nul : toutes les cases sont remplies et personne n'a gagné
function matchNul() {
     return game.every(function(caseDuJeu) {
          return caseDuJeu !== ""
     })
}

// Recommencer : on vide le plateau pour la manche suivante.
// Si le match était gagné, on repart de zéro (scores remis à 0).
function recommencer() {
     for (let i = 0; i < game.length; i++) {
          game[i] = ""
     }
     element.forEach(function(cell) {
          cell.textContent = ""
          cell.classList.remove("x", "o")
     })
     // On alterne le joueur qui commence la manche
     joueurQuiCommence = (joueurQuiCommence === "X") ? "O" : "X"
     player = joueurQuiCommence
     partieTerminee = false

     // Nouveau match complet : on réinitialise aussi les scores
     if (matchTermine) {
          scoreX = 0
          scoreO = 0
          matchTermine = false
          majScores()
     }

     // On masque l'overlay de victoire et on enlève les confettis
     overlay.classList.remove("show")
     confettiContainer.innerHTML = ""

     info.textContent = "Au tour du joueur " + player
}

// On attache l'écouteur de clic sur chaque case
element.forEach(cell => cell.addEventListener("click", manipClik))

// On attache l'écouteur sur le bouton Recommencer
restart.addEventListener("click", recommencer)

// Le bouton "Nouveau match" de l'overlay relance également une partie
newMatchBtn.addEventListener("click", recommencer)
