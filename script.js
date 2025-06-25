// On encapsule tout le code dans une IIFE (Immediately Invoked Function Expression)
// pour protéger le scope global et garder nos variables privées.
(function() {
    'use strict';

    // 1. Sélection des éléments du DOM
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const messageArea = document.getElementById('message-area');
    const replayButton = document.getElementById('replay-button');

    // 2. Variables d'état du jeu
    let secretNumber;

    // 3. Fonctions principales
    
    /**
     * Initialise ou réinitialise une partie.
     */
    function initializeGame() {
        // Génère un nouveau nombre secret entre 1 et 100
        secretNumber = Math.floor(Math.random() * 100) + 1;
        
        // Réinitialise l'interface utilisateur
        messageArea.textContent = '';
        messageArea.style.color = '#333';
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.disabled = false;
        replayButton.classList.add('hidden'); // Cache le bouton rejouer
        guessInput.focus(); // Met le curseur dans le champ de saisie
    }

    /**
     * Gère la tentative du joueur.
     */
    function handleGuess() {
        const userGuess = parseInt(guessInput.value, 10);

        // Validation de l'entrée
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            messageArea.textContent = 'Veuillez entrer un nombre entre 1 et 100.';
            messageArea.style.color = '#b91c1c'; // Rouge pour l'erreur
            return;
        }

        // Comparaison et mise à jour de l'interface
        messageArea.style.color = '#1e3a8a'; // Couleur par défaut pour les indices
        if (userGuess < secretNumber) {
            messageArea.textContent = 'C’est plus grand !';
        } else if (userGuess > secretNumber) {
            messageArea.textContent = 'C’est plus petit !';
        } else {
            messageArea.textContent = `Bravo ! Le nombre était bien ${secretNumber}.`;
            messageArea.style.color = '#166534'; // Vert pour la victoire
            
            // Fin de partie : on désactive les contrôles et on montre le bouton "Rejouer"
            guessInput.disabled = true;
            guessButton.disabled = true;
            replayButton.classList.remove('hidden');
        }

        // On vide le champ pour la prochaine tentative
        guessInput.value = '';
        guessInput.focus();
    }

    // 4. Ajout des écouteurs d'événements
    guessButton.addEventListener('click', handleGuess);
    replayButton.addEventListener('click', initializeGame);
    
    // Bonus : Permettre de valider avec la touche "Entrée"
    guessInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            handleGuess();
        }
    });

    // 5. Lancement de la première partie
    initializeGame();

})();
