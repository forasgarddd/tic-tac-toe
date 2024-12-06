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

    const availableCells = () => {
        let counter = 0;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === "-") {
                    counter++;
                }
            }
        }
        return counter;
    }

    return {getBoard, placeToken, printBoard, clearBoard, availableCells};
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

    const getPlayer1 = () => {
        return player1;
    }

    const getPlayer2 = () => {
        return player2;
    }

    const printNewRound = () => {
        console.log("Active player: " + getActivePlayer().name + " : " + getActivePlayer().token);
        gameBoard.printBoard();
    }

    const checkWin = (row, column, token) => {
        const board = gameBoard.getBoard();
    
        if (board[row].every(cell => cell === token)) {
            return true;
        }
    
        if (board.every(r => r[column] === token)) {
            return true;
        }
    
        if (row === column && board.every((r, idx) => r[idx] === token)) {
            return true;
        }
    
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

    return {playRound, checkWin, getActivePlayer, getGameBoard: gameBoard.getBoard, getAvailableCells: gameBoard.availableCells,
            endGame, getPlayer1, getPlayer2
    };

}

function DisplayController() {
    const gameController = GameController();

    const playerTurnDiv = document.querySelector(".turn");
    const gameBoardDiv = document.querySelector(".board");
    const container = document.querySelector(".container");

    const restartButton = document.createElement("button");

    const name1Div = document.querySelector(".name1");
    const name2Div = document.querySelector(".name2");

    const inputOne = document.querySelector("#name1");
    const inputTwo = document.querySelector("#name2");

    const checkButton1 = document.querySelector(".check-btn-n1");
    const checkButton2 = document.querySelector(".check-btn-n2");

    let isGameOver = false;
    let outcome = "";

    const inputNameClick = (player, inputValue, nameDiv) => {
        if (inputValue.trim() === "") {
            return;
        } else {
            player.name = inputValue;
            nameDiv.style.display = "none";
        }

        updateScreen();
    }

    checkButton1.addEventListener("click", () => inputNameClick(gameController.getPlayer1(), inputOne.value, name1Div));
    checkButton2.addEventListener("click", () => inputNameClick(gameController.getPlayer2(), inputTwo.value, name2Div));

    const updateScreen = () => {
        gameBoardDiv.textContent = "";

        const gameBoard = gameController.getGameBoard();
        const activePlayer = gameController.getActivePlayer();
        
        if (!isGameOver) {
            playerTurnDiv.textContent = activePlayer.name + "'s turn";
        } else if (outcome === "tie") {
            playerTurnDiv.textContent = "It's a tie!";
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
        } else if (gameController.getAvailableCells() === 0) {
            outcome = "tie";
            restartGame();
        }
        updateScreen();
    }

    const restartClick = () => {
        console.log("restart");
        gameController.endGame();
        gameBoardDiv.addEventListener("click", cellClick);
        restartButton.remove();
        isGameOver = false;
        
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

