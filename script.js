(function() {
    'use strict';

    // -- Constantes et Variables d'état --
    const MAX_ATTEMPTS = 10;
    let secretNumber;
    let attemptsLeft;
    let playerName;

    // -- Sélecteurs DOM --
    const setupContainer = document.getElementById('setup-container');
    const playerNameInput = document.getElementById('player-name-input');
    const startButton = document.getElementById('start-button');

    const gameContainer = document.getElementById('game-container');
    const attemptsLeftSpan = document.getElementById('attempts-left');
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const messageArea = document.getElementById('message-area');
    const replayButton = document.getElementById('replay-button');

    const victoryImg = document.getElementById('victory-img');
    const defeatImg = document.getElementById('defeat-img');

    const leaderboardList = document.getElementById('leaderboard-list');

    // -- Fonctions du LocalStorage --

    function getScores() {
        return JSON.parse(localStorage.getItem('guessingGameScores')) || [];
    }

    function saveScore(name, attemptsUsed) {
        const scores = getScores();
        scores.push({ name, score: attemptsUsed });
        scores.sort((a, b) => a.score - b.score); // Trie du plus petit au plus grand score
        const topScores = scores.slice(0, 3); // Garde seulement le top 3
        localStorage.setItem('guessingGameScores', JSON.stringify(topScores));
    }

    function renderLeaderboard() {
        const scores = getScores();
        leaderboardList.innerHTML = ''; // Vide la liste
        if (scores.length === 0) {
            leaderboardList.innerHTML = '<li>Aucun score pour le moment.</li>';
        } else {
            scores.forEach(entry => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${entry.name}</span> <span>${entry.score} tentatives</span>`;
                leaderboardList.appendChild(li);
            });
        }
    }

    // -- Fonctions de Logique du Jeu --

    function startGame() {
        playerName = playerNameInput.value.trim();
        if (!playerName) {
            alert('Veuillez entrer un pseudo !');
            return;
        }
        setupContainer.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        initializeRound();
    }

    function initializeRound() {
        secretNumber = Math.floor(Math.random() * 100) + 1;
        attemptsLeft = MAX_ATTEMPTS;

        // Réinitialisation de l'UI
        attemptsLeftSpan.textContent = attemptsLeft;
        messageArea.textContent = '';
        guessInput.value = '';
        guessInput.disabled = false;
        guessButton.disabled = false;
        replayButton.classList.add('hidden');
        victoryImg.classList.add('hidden');
        defeatImg.classList.add('hidden');
        guessInput.focus();
    }
    
    function handleGuess() {
        const userGuess = parseInt(guessInput.value, 10);

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            displayMessage('Veuillez entrer un nombre entre 1 et 100.', 'red');
            return;
        }
        
        attemptsLeft--;
        attemptsLeftSpan.textContent = attemptsLeft;

        if (userGuess === secretNumber) {
            endGame(true);
        } else if (attemptsLeft === 0) {
            endGame(false);
        } else {
            const hint = userGuess < secretNumber ? 'C’est plus grand !' : 'C’est plus petit !';
            displayMessage(hint, '#1e3a8a');
        }
        guessInput.value = '';
        guessInput.focus();
    }

    function endGame(isWin) {
        guessInput.disabled = true;
        guessButton.disabled = true;
        replayButton.classList.remove('hidden');

        if (isWin) {
            const attemptsUsed = MAX_ATTEMPTS - attemptsLeft;
            displayMessage(`Bravo, ${playerName} ! Le nombre était ${secretNumber}.`, 'green');
            victoryImg.classList.remove('hidden');
            saveScore(playerName, attemptsUsed);
            renderLeaderboard();
        } else {
            displayMessage(`Perdu ! Le nombre était ${secretNumber}.`, 'red');
            defeatImg.classList.remove('hidden');
        }
    }

    function displayMessage(text, color) {
        messageArea.textContent = text;
        messageArea.style.color = color;
    }

    // -- Initialisation et Écouteurs d'Événements --

    function init() {
        startButton.addEventListener('click', startGame);
        guessButton.addEventListener('click', handleGuess);
        replayButton.addEventListener('click', initializeRound);
        
        guessInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !guessButton.disabled) {
                handleGuess();
            }
        });

        playerNameInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                startGame();
            }
        });

        renderLeaderboard();
    }

    init(); // Lance l'application

})();
