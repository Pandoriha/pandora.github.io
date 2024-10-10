const wordsWithHints = [
    { word: "apple", hint: "A fruit that's red or green." },
    { word: "banana", hint: "A long, yellow fruit." },
    { word: "orange", hint: "A round, orange fruit." },
    // ... otras palabras y pistas
];

let selectedWordObj, guessedLetters, wrongGuesses, maxWrongGuesses = 6;

const wordDisplay = document.getElementById('wordDisplay');
const hintDisplay = document.getElementById('hintDisplay');
const wrongGuessesDisplay = document.getElementById('wrongGuesses');
const resetButton = document.getElementById('resetButton');
const keyboard = document.getElementById('keyboard');
const correctSound = document.getElementById('correctSound');
const wrongSound = document.getElementById('wrongSound');
const winSound = document.getElementById('winSound'); // Sonido de victoria
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
const confettiContainer = document.getElementById('confettiContainer'); // Contenedor para el confeti

function startGame() {
    selectedWordObj = wordsWithHints[Math.floor(Math.random() * wordsWithHints.length)];
    guessedLetters = [];
    wrongGuesses = [];
    updateWordDisplay();
    wrongGuessesDisplay.textContent = '';
    hintDisplay.textContent = `Hint: ${selectedWordObj.hint}`;
    drawBase();
    drawHangman(0);
    generateKeyboard();
    confettiContainer.innerHTML = ''; // Limpia confeti
    confettiContainer.style.display = 'none'; // Oculta el confeti
}

function updateWordDisplay() {
    wordDisplay.textContent = selectedWordObj.word.split('').map(letter => 
        guessedLetters.includes(letter) ? letter : '_').join(' ');
}

function handleGuess(letter) {
    if (selectedWordObj.word.includes(letter)) {
        guessedLetters.push(letter);
        correctSound.play();
        updateWordDisplay();
        checkGameStatus(); // Se mueve aquí para resolver el problema de sincronización
    } else {
        wrongGuesses.push(letter);
        wrongGuessesDisplay.textContent = wrongGuesses.join(', ');
        wrongSound.play();
        drawHangman(wrongGuesses.length);
        checkGameStatus(); // Revisamos el estado del juego aquí también
    }
}

function checkGameStatus() {
    if (!wordDisplay.textContent.includes('_')) {
        winSound.play();
        showConfetti(); // Lanza el confeti
        alert('You won!');
    } else if (wrongGuesses.length >= maxWrongGuesses) {
        alert(`Game over! The word was: ${selectedWordObj.word}`);
    }
}

function generateKeyboard() {
    keyboard.innerHTML = '';
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    letters.forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.onclick = () => handleGuess(letter);
        keyboard.appendChild(button);
    });
}

function drawBase() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, 240);
    ctx.lineTo(190, 240);  // Línea horizontal de la base
    ctx.moveTo(50, 240);
    ctx.lineTo(50, 20);    // Línea vertical de la base
    ctx.lineTo(150, 20);   // Línea superior horizontal
    ctx.lineTo(150, 50);   // Cuerda que cuelga
    ctx.stroke();
}

function drawHangman(wrongGuesses) {
    if (wrongGuesses > 0) {
        ctx.beginPath();
        ctx.arc(150, 70, 20, 0, Math.PI * 2); // Cabeza
        ctx.stroke();
    }
    if (wrongGuesses > 1) {
        ctx.beginPath();
        ctx.moveTo(150, 90);
        ctx.lineTo(150, 150); // Cuerpo
        ctx.stroke();
    }
    if (wrongGuesses > 2) {
        ctx.beginPath();
        ctx.moveTo(150, 110);
        ctx.lineTo(130, 130); // Brazo izquierdo
        ctx.stroke();
    }
    if (wrongGuesses > 3) {
        ctx.beginPath();
        ctx.moveTo(150, 110);
        ctx.lineTo(170, 130); // Brazo derecho
        ctx.stroke();
    }
    if (wrongGuesses > 4) {
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.lineTo(130, 190); // Pierna izquierda
        ctx.stroke();
    }
    if (wrongGuesses > 5) {
        ctx.beginPath();
        ctx.moveTo(150, 150);
        ctx.lineTo(170, 190); // Pierna derecha (Juego terminado)
        ctx.stroke();
    }
}

function showConfetti() {
    confettiContainer.style.display = 'block';
    for (let i = 0; i < 100; i++) {
        const confettiPiece = document.createElement('div');
        confettiPiece.classList.add('confetti');
        confettiPiece.style.left = Math.random() * 100 + 'vw';
        confettiPiece.style.animationDuration = Math.random() * 3 + 2 + 's';
        confettiContainer.appendChild(confettiPiece);
    }
}

resetButton.addEventListener('click', startGame);

startGame();
