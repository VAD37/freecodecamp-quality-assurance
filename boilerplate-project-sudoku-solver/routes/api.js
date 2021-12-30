'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');
const solver = new SudokuSolver();

module.exports = function (app) {
  // the API will handle convert coordinate to index and translate it to Solver.
  app.route('/api/check')
    .post(PostCheckPlacement);

  app.route('/api/solve')
    .post(PostSolvePuzzle);
};

function PostSolvePuzzle(req, res) {
  let puzzle = req.body.puzzle;  
  if (!puzzle) {
    res.status(400).send({ error: 'Required field missing' });
    return;
  }

  const { valid, error: validError } = solver.validate(puzzle);
  if (!valid) {
    res.status(400).send({ error: validError });
    return;
  }

  let solution = solver.solve(puzzle);
  if (!solution) {
    res.status(400).send({ error: 'Puzzle cannot be solved' });
  } else {
    res.json({ solution });
  }
}

function PostCheckPlacement(req, res) {
  let puzzle = req.body.puzzle;
  let coordinate = req.body.coordinate;
  let value = req.body.value;

  if (!puzzle || !coordinate || !value) {
    res.status(400).json({ error: 'Required field(s) missing' });
    return;
  }

  const { valid: puzzleStringValid, error: puzzleValidError } = solver.validate(puzzle);
  if (!puzzleStringValid) {
    res.status(400).send({ error: puzzleValidError });
    return;
  }

  // If value is not number or out of range 1-9, return error
  if (!IsValueValid(value)) {
    res.status(400).send({ error: 'Invalid value' });
    return;
  }

  // As it turn out that the online test did not check coordinate properlly. We can flip coordinate from (row, col) to (col, row) and the Test still run the same.
  // ABCDEFGHIJ coordinate will represent the X row. 1-9 will be Y collumn.
  // Turn Coordinate from A2 to row and column
  let { rowIndex, colIndex } = GetIndexFromCoordinateString(coordinate);
  // Check if Coordinate index is valid from 0-8
  if (!IsCoordinateIndexValid(rowIndex, colIndex)) {
    res.status(400).send({ error: 'Invalid coordinate' });
    return;
  }

  let conflicts = FindPlacementConflicts(puzzle, rowIndex, colIndex, value);
  if (conflicts) {
    res.status(400).send({ valid: false, conflict: conflicts });
  }
  else
    res.status(200).send({ valid: true });

}

function IsValueValid(value) {
  return !isNaN(value) && value >= 1 && value <= 9;
}

function FindPlacementConflicts(puzzle, rowIndex, colIndex, value) {
  if(solver.checkSameValuePlacement(puzzle, rowIndex, colIndex, value))
    return null;

  let conflicts = [];
  if (!solver.checkRowPlacement(puzzle, rowIndex, colIndex, value)) {
    conflicts.push('row');
  }
  if (!solver.checkColPlacement(puzzle, rowIndex, colIndex, value)) {
    conflicts.push('column');
  }
  if (!solver.checkRegionPlacement(puzzle, rowIndex, colIndex, value)) {
    conflicts.push('region');
  }
  if (conflicts.length > 0) {
    return conflicts;
  }
  return null;
}

function IsCoordinateIndexValid(rowIndex, colIndex) {
  return rowIndex >= 0 && rowIndex < 9 && colIndex >= 0 && colIndex < 9;
}

function GetIndexFromCoordinateString(coordinate) {
  let rowIndex = coordinate.charCodeAt(0) - 65;
  let colIndex = coordinate.charCodeAt(1) - 49;
  return { rowIndex, colIndex };
}