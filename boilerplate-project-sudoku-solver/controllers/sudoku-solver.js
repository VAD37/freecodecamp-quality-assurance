class SudokuSolver {

  validate(puzzleString) {
    // Reading a string with 81 characters. Return false if it contain not 1-9 or .
    // Return false if it is not 81 characters in length
    // Return true if all is valid
    if (puzzleString.match(/[^\.\d]/g)) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }
    return { valid: true };
  }

  convertStringToSudokuPuzzle(puzzleString) {
    // Convert a string to a 9x9 array of arrays
    // Return false if the string is not valid
    // Return the puzzle array
    if (!this.validate(puzzleString)) {
      return false;
    }
    const puzzleArray = [];
    for (let i = 0; i < 9; i++) {
      puzzleArray.push(puzzleString.slice(i * 9, i * 9 + 9).split(''));
    }
    return puzzleArray;
  }
  // Check if the placement already exist with same value then return true
  checkSameValuePlacement(puzzle, row, column, value) {
    const index = column * 9 + row;
    if (puzzle[index] == value) {
      return true;
    }
    return false;
  }


  // reading a string with 81 characters.
  // Check if the value is valid in the row
  // Return true if the value is valid
  checkRowPlacement(puzzle, row, column, value) {
    const index = column * 9 + row;
    const startIndex = index - (index % 9);
    const endIndex = startIndex + 9;
    for (let i = startIndex; i < endIndex; i++) {
      if (puzzle[i] == value) {
        return false;
      }
    }
    return true;
  }

  // reading a string with 81 characters.
  // Check if the value is valid in the column
  // Return true if the value is valid
  checkColPlacement(puzzle, row, column, value) {
    for (let i = 0; i < 81; i += 9) {
      if (puzzle[i + row] == value)
        return false;
    }
    return true;
  }

  // reading a string with 81 characters.
  // Check if the value is valid in the region
  // Return true if the value is valid
  checkRegionPlacement(puzzle, row, column, value) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(column / 3) * 3;
    const startRowIndex = regionCol * 9 + regionRow;
    const endRowIndex = startRowIndex + 3;

    for (let i = 0; i < 3; i++) {
      for (let j = startRowIndex; j < endRowIndex; j++) {
        if (puzzle[i * 9 + j] == value) {
          return false;
        }
      }
    }
    return true;
  }

  // Solve the sudoku puzzle using bruteforce backtracking method
  // Find next empty cell.
  // Check each empty cell in the puzzle.
  // Then try each value 1-9. If the value is valid, then place it in the puzzle.
  // If the value is valid, then recursively call the solve function.
  // If the value is invalid, then try the next value.
  // If all values are invalid, then backtrack and try the next value.
  // If all values are invalid, then return false.
  // If all values are valid, then return true.
  solve(puzzleString) {
    let puzzle = puzzleString.split('');
    let arrayPuzzle = this.solveArray(puzzle);
    if (arrayPuzzle)
      return arrayPuzzle.join('');
    else
      return false;
  }

  solveArray(puzzle) {
    // Find next empty cell.
    let emptyCell = puzzle.indexOf('.');
    // Check each empty cell in the puzzle.
    // Then try each value 1-9. If the value is valid, then place it in the puzzle.
    // If the value is valid, then recursively call the solve function.
    // If all values are valid, then return true.
    if (emptyCell == -1) {
      return puzzle;
    }
    for (let i = 1; i < 10; i++) {
      let row = emptyCell % 9;
      let col = Math.floor(emptyCell / 9);
      if (this.checkRowPlacement(puzzle, row, col, i) &&
        this.checkColPlacement(puzzle, row, col, i) &&
        this.checkRegionPlacement(puzzle, row, col, i)) {
        puzzle[emptyCell] = i;
        let result = this.solveArray(puzzle);
        if (result) {
          return result;
        }
      }
    }
    // back track cell
    puzzle[emptyCell] = '.';
    return false;
  }
}

module.exports = SudokuSolver;

