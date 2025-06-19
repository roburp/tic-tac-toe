const players = (() => {
  const createPlayer = (name, symbol) => {
    return { name, symbol };
  };

  return [createPlayer("Player 1", "X"), createPlayer("Player 2", "O")];
})();

const gameBoard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  //returns a copy of the board
  const getBoard = () => [...board];

  //set a symbol in a cell
  const setCell = (index, symbol) => {
    board[index] = symbol;
  };

  //returns the symbol in a cell
  const getCell = (index) => board[index];

  //resets the board - called by resetGame()
  const resetBoard = () => {
    board = ["", "", "", "", "", "", "", "", ""];
  };

  return {
    getBoard,
    setCell,
    getCell,
    resetBoard,
  };
})();

const gameController = (() => {
  let currentPlayer = players[0];
  let gameOver = false;
  const winConditions = [
    //rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //columns
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  const switchPlayer = () => {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  };

  const getPlayer = () => currentPlayer;

  //combo = array item inside winConditions being looped
  //checks if every items (i) in combo has the same symbol in the gameBoard
  const checkWin = (symbol) =>
    winConditions.find((combo) => combo.every((i) => gameBoard.getCell(i) === symbol)) || null;

  const checkTie = () => {
    return gameBoard.getBoard().every((cell) => cell !== "");
  };

  const highlightWinningCombo = (winningCombo) => {
    winningCombo.forEach((index) => {
      const cell = document.querySelector(`[data-index="${index}"]`);
      if (cell) cell.classList.add("highlight");
    });
  };

  const playRound = (index) => {
    if (gameOver || gameBoard.getCell(index) !== "") return;

    gameBoard.setCell(index, currentPlayer.symbol);
    const winningCombo = checkWin(currentPlayer.symbol);

    //checks if game ends with win / tie, or game continues with next player
    //timeout to make sure the board is updated before alert
    if (winningCombo) {
      gameOver = true;
      displayController.renderBoard(winningCombo);
      setTimeout(() => {
        alert(`${currentPlayer.name} wins!`);
      }, 50);
    } else if (checkTie()) {
      displayController.renderBoard();
      setTimeout(() => {
        alert("Draw!");
      }, 50);
    } else {
      switchPlayer();
      displayController.renderBoard();
    }
  };

  const resetGame = () => {
    gameBoard.resetBoard();
    currentPlayer = players[0]; //sets back to player 1
    gameOver = false;
    displayController.renderBoard();
  };

  return {
    playRound,
    switchPlayer,
    getPlayer,
    resetGame,
  };
})();

const displayController = (() => {
  const boardContainer = document.querySelector(".gameboard");
  const playerText = document.querySelector(".player-text");

  const renderBoard = (winningCombo = []) => {
    boardContainer.innerHTML = "";
    playerText.innerHTML = `${gameController.getPlayer().name}'s turn`;
    gameBoard.getBoard().forEach((cell, index) => {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("box");

      cellDiv.dataset.index = index;
      cellDiv.textContent = cell;

      if (cell !== "") cellDiv.classList.add("filled");

      if (winningCombo.includes(index)) {
        cellDiv.classList.add("highlight");
      }

      cellDiv.addEventListener("click", () => {
        gameController.playRound(index);
      });
      boardContainer.appendChild(cellDiv);
    });
  };

  return { renderBoard };
})();

const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", () => {
  gameController.resetGame();
});

displayController.renderBoard();
