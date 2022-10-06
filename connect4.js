class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.startGame();
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = (`${this.currPlayer.color}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  endGame(msg) {
    this.activeGame = false;
    this.gameOver = true;
    alert(msg);
  }

  handleClick(evt) {
    if (this.gameOver) {
      return
    }
    else {
      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get next spot in column (if none, ignore click)
      const y = this.findSpotForCol(x)
      if (y === null) {
        return;
      }

      // place piece in board and add to HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        return this.endGame(`${this.currPlayer.color} player won!`);
      }

      // check for tie
      if (this.board.every(row => row.every(cell => cell))) {
        return this.endGame('Tie!');
      }

      // switch players
      this.currPlayer = this.currPlayer === this.playerInput[0] ? this.playerInput[1] : this.playerInput[0];
    }
  }

  checkForWin() {
    const _win = (cells) => {
      // Check four cells to see if they're all color of current player
      //  - cells: list of four (y, x) cells
      //  - returns true if all are legal coordinates & all match currPlayer

      return cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    }

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }
  startGame() {
    let startButton = document.createElement('button');
    startButton.innerText = 'Start Game'
    startButton.addEventListener('click', () => {
      if (!this.activeGame) {
        document.querySelector('#board').innerHTML = '';
        this.board = [];
        this.getPlayerInfo();
        this.currPlayer = this.playerInput[0];
        this.makeBoard();
        this.makeHtmlBoard();
        this.activeGame = true;
        this.gameOver = false;
      }
    })
    document.querySelector('body').append(startButton);
  }
  getPlayerInfo() {
    let player1Color = document.querySelector('#playerOne');
    let player2Color = document.querySelector('#playerTwo');
    if(player1Color.value && player2Color.value){
      this.playerInput = [new Player(player1Color.value), new Player(player2Color.value)];
    } else { alert('Please enter two colors!'); }
    player1Color.value = '';
    player2Color.value = '';
  }
}

class Player {
  constructor(color){
    this.color = color;
  }
}

new Game(6, 7);

// add 2 inputs into HTML
// have start button grab value from those inputs
// game creates two player objects in an array
// instead of numbers, current player should be equal to the object in the tern operator
//piece should grab color from player object color property