// Tic-Tac-Toe Game JavaScript

// DOM Elements
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const pvpBtn = document.getElementById('pvp-btn');
const pvcBtn = document.getElementById('pvc-btn');

// Game State Variables
let gameState = ['', '', '', '', '', '', '', '', '']; // Represents the 9 cells of the board
let currentPlayer = 'X'; // Current player ('X' or 'O')
let gameActive = true; // Flag to check if the game is still active
let gameMode = 'pvp'; // 'pvp' for Player vs Player, 'pvc' for Player vs Computer

// Winning combinations (indices of the board array)
const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left
    [2, 4, 6]  // Diagonal from top-right
];

// Function to handle cell clicks
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Check if the cell is already taken or if the game is not active
    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update game state and UI
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add('taken');

    // Check for winner or draw
    checkResult();

    // If game is still active and in PvC mode, make computer move
    if (gameActive && gameMode === 'pvc' && currentPlayer === 'X') {
        setTimeout(makeComputerMove, 500); // Delay for better UX
    }
}

// Function to check game result (win, draw, or continue)
function checkResult() {
    let roundWon = false;
    let winningCells = [];

    // Check each winning combination
    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        // Highlight winning cells
        winningCells.forEach(index => {
            cells[index].classList.add('winning');
        });

        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    // Check for draw
    if (!gameState.includes('')) {
        statusDisplay.textContent = 'It\'s a draw!';
        gameActive = false;
        return;
    }

    // Switch player and update status
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDisplay.textContent = gameMode === 'pvc' && currentPlayer === 'O' ? 'Computer\'s turn' : `Player ${currentPlayer}'s turn`;
}

// Function to make computer move (basic AI)
function makeComputerMove() {
    if (!gameActive) return;

    // Simple AI: Try to win, block player, or take center/corners
    let moveIndex = getBestMove();

    if (moveIndex !== -1) {
        gameState[moveIndex] = 'O';
        cells[moveIndex].textContent = 'O';
        cells[moveIndex].classList.add('taken');

        checkResult();
    }
}

// Function to get the best move for computer (basic logic)
function getBestMove() {
    // Try to win
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (gameState[a] === 'O' && gameState[b] === 'O' && gameState[c] === '') return c;
        if (gameState[a] === 'O' && gameState[c] === 'O' && gameState[b] === '') return b;
        if (gameState[b] === 'O' && gameState[c] === 'O' && gameState[a] === '') return a;
    }

    // Try to block player from winning
    for (let combo of winningCombinations) {
        let [a, b, c] = combo;
        if (gameState[a] === 'X' && gameState[b] === 'X' && gameState[c] === '') return c;
        if (gameState[a] === 'X' && gameState[c] === 'X' && gameState[b] === '') return b;
        if (gameState[b] === 'X' && gameState[c] === 'X' && gameState[a] === '') return a;
    }

    // Take center if available
    if (gameState[4] === '') return 4;

    // Take corners
    let corners = [0, 2, 6, 8];
    for (let corner of corners) {
        if (gameState[corner] === '') return corner;
    }

    // Take any available cell
    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') return i;
    }

    return -1; // No move available
}

// Function to reset the game
function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;

    // Clear board UI
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'winning');
    });

    // Reset status
    statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

// Function to change game mode
function changeGameMode(mode) {
    gameMode = mode;
    resetGame();

    // Update button styles
    pvpBtn.classList.toggle('active', mode === 'pvp');
    pvcBtn.classList.toggle('active', mode === 'pvc');
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
pvpBtn.addEventListener('click', () => changeGameMode('pvp'));
pvcBtn.addEventListener('click', () => changeGameMode('pvc'));

// Initialize game
resetGame();
