function Gameboard() {

    let board = [
        ["-", "-", "-"],
        ["-", "-", "-"],
        ["-", "-", "-"]
    ];

    const getBoard = () => board;

    const printBoard = () => {
        console.log(board.map(row => row.join(' ')).join('\n'));
    }

    const clearBoard = () => {
        board = [
            ["-", "-", "-"],
            ["-", "-", "-"],
            ["-", "-", "-"]
        ];
    }

    const placeToken = (row, column, token) => {
        if (board[row][column] !== "-") {
            console.log("Invalid turn");
            return;
        }
        board[row][column] = token;
    }

    return {getBoard, placeToken, printBoard, clearBoard};
}

function Player(name, token) {
    return {name, token};
}

function GameController() {
    
    const gameBoard = Gameboard();

    const player1 = Player("Player1", "x");
    const player2 = Player("Player2", "o");

    let activePlayer = player1;

    const switchActivePlayer = () => {
        activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
    }

    const getActivePlayer = () => {
        return activePlayer;
    }

    const printNewRound = () => {
        console.log("Active player: " + getActivePlayer().name + " : " + getActivePlayer().token);
        gameBoard.printBoard();
    }

    const checkWin = (row, column, token) => {
        const board = gameBoard.getBoard();
    
        // Check row
        if (board[row].every(cell => cell === token)) {
            return true;
        }
    
        // Check column
        if (board.every(r => r[column] === token)) {
            return true;
        }
    
        // Check top-left to bottom-right diagonal
        if (row === column && board.every((r, idx) => r[idx] === token)) {
            return true;
        }
    
        // Check top-right to bottom-left diagonal
        if (parseInt(row) + parseInt(column) === 2 && board.every((r, idx) => r[2 - idx] === token)) {
            return true;
        }
    
        return false;
    };

    const playRound = (row, column) => {
        if (gameBoard.getBoard()[row][column] !== "-") {
            return;
        }

        gameBoard.placeToken(row, column, activePlayer.token);
        
        if (!checkWin(row, column, activePlayer.token)) {
            switchActivePlayer();
        }
        printNewRound();
    }

    const endGame = () => {
        gameBoard.clearBoard();
    }

    printNewRound();

    return {playRound, checkWin, getActivePlayer, getGameBoard: gameBoard.getBoard, endGame};

}

function DisplayController() {
    const gameController = GameController();

    const playerTurnDiv = document.querySelector(".turn");
    const gameBoardDiv = document.querySelector(".board");
    const container = document.querySelector(".container");

    const restartButton = document.createElement("button");
    let isGameOver = false;

    const updateScreen = () => {
        gameBoardDiv.textContent = "";

        const gameBoard = gameController.getGameBoard();
        const activePlayer = gameController.getActivePlayer();
        
        if (!isGameOver) {
            playerTurnDiv.textContent = activePlayer.name + "'s turn";
        } else {
            playerTurnDiv.textContent = activePlayer.name + " is the winner!";
        }


        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.dataset.row = i;
                cellButton.dataset.column = j;
                if (gameBoard[i][j] === "-") {
                    cellButton.textContent = ""
                } else {
                    cellButton.textContent = gameBoard[i][j];
                }
                gameBoardDiv.appendChild(cellButton);
            }
        }
        
    }

    const cellClick = (e) => {
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;
        const activePlayer = gameController.getActivePlayer();

        if(!selectedRow || !selectedColumn) {
            return;
        }
        gameController.playRound(selectedRow, selectedColumn);
        if (gameController.checkWin(selectedRow, selectedColumn, activePlayer.token)) {
            restartGame();
        }

        updateScreen();
    }

    const restartClick = () => {
        console.log("restart");
        gameController.endGame();
        gameBoardDiv.addEventListener("click", cellClick);
        restartButton.remove();
        
        updateScreen();
    }

    const restartGame = () => {
        restartButton.classList.add("restart-button");
        restartButton.textContent = "Restart game";
        container.appendChild(restartButton);
        isGameOver = true;
        updateScreen();
        gameBoardDiv.removeEventListener("click", cellClick);
        restartButton.addEventListener("click", restartClick);
    }

    gameBoardDiv.addEventListener("click", cellClick);

    updateScreen();
}

DisplayController();

