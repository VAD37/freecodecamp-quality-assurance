const chai = require('chai');
const assert = chai.assert;
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();


describe('UnitTests', () => {
    // Logic handles a valid puzzle string of 81 characters
    it('should return a valid puzzle string of 81 characters', () => {
        assert.equal(solver.validate(puzzlesAndSolutions[0][0]).valid, true);
        assert.equal(solver.validate(puzzlesAndSolutions[1][0]).valid, true);
        assert.equal(solver.validate(puzzlesAndSolutions[2][0]).valid, true);
    });
    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    it('should return a puzzle string with invalid characters (not 1-9 or .)', () => {
        assert.equal(solver.validate(puzzlesAndSolutions[0][0].replace(/[1-9]/g, 'a')).valid, false);
        assert.equal(solver.validate(puzzlesAndSolutions[1][0].replace(/[1-3]/g, '*')).valid, false);
        assert.equal(solver.validate(puzzlesAndSolutions[1][0].replace(/[1-7]/g, 'b')).valid, false);
    });
    // Logic handles a puzzle string that is not 81 characters in length
    it('should return a puzzle string that is not 81 characters in length', () => {
        assert.equal(solver.validate(puzzlesAndSolutions[0][0].slice(0, 80)).valid, false);
        assert.equal(solver.validate(puzzlesAndSolutions[1][0].slice(0, 60)).valid, false);
        assert.equal(solver.validate(puzzlesAndSolutions[2][0] + '..13.123.123.541').valid, false);
    });
    // Logic handles a valid row placement
    it('should return a valid row placement', () => {
        assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 3, 4, '1'));
        assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 3, 4, '9'));
        assert.isTrue(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 3, 4, '5'));
    });
    // Logic handles an invalid row placement
    it('should return an invalid row placement', () => {
        assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 3, 4, '2'));
        assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 3, 4, '3'));
        assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 3, 4, '4'));
        assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 3, 4, '6'));
        assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 3, 4, '7'));
        assert.isFalse(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 3, 4, '8'));
    });
    // Logic handles a valid column placement
    it('should return a valid column placement', () => {
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 3, 4, '2'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 3, 4, '4'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 3, 4, '5'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 3, 4, '7'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 3, 4, '8'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 3, 4, '9'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 2, 6, '3'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 2, 6, '4'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 2, 6, '8'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 7, 1, '1'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 7, 1, '2'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 7, 1, '3'));
        assert.isTrue(solver.checkColPlacement(puzzlesAndSolutions[0][0], 7, 1, '6'));
    });

    // Logic handles an invalid column placement
    it('should return an invalid column placement', () => {
        assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[0][0], 3, 4, '1'));
        assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[0][0], 3, 4, '3'));
        assert.isFalse(solver.checkColPlacement(puzzlesAndSolutions[0][0], 3, 4, '6'));
    });
    // Logic handles a valid region (3x3 grid) placement
    it('should return a valid region (3x3 grid) placement', () => {
        assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 1, 1, '4'));
        assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 3, 4, '5'));
        assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 6, 2, '1'));
        assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 6, 6, '2'));
        assert.isTrue(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 1, 7, '3'));
    });
    // Logic handles an invalid region (3x3 grid) placement
    it('should return an invalid region (3x3 grid) placement', () => {
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 1, 1, '6'));
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 3, 4, '3'));
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 5, 2, '5'));
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 6, 6, '9'));
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 7, 7, '7'));
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 7, 7, '1'));
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 7, 7, '3'));
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 1, 7, '2'));
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 1, 7, '9'));
        assert.isFalse(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 1, 7, '7'));
    });
    // Logic handles a valid region (3x3 grid) placement
    it('should return a valid if placement have same value', () => {
        assert.isTrue(solver.checkSameValuePlacement(puzzlesAndSolutions[0][0], 2, 0, '5'));
    });
    // Valid puzzle strings pass the solver
    it('should pass a valid puzzle string', () => {
        assert.equal(solver.solve(puzzlesAndSolutions[0][0]), puzzlesAndSolutions[0][1]);
        assert.equal(solver.solve(puzzlesAndSolutions[1][0]), puzzlesAndSolutions[1][1]);
        assert.equal(solver.solve(puzzlesAndSolutions[2][0]), puzzlesAndSolutions[2][1]);
    });
    // Invalid puzzle strings fail the solver
    it('should fail an invalid puzzle string', () => {
        const impossiblePuzzle = '82..4..6...16..89...98315.749.157....213......53..4...96.415..81..7632..3...28.51';
        assert.isFalse(solver.solve(impossiblePuzzle));
    });
    // Solver returns the expected solution for an incomplete puzzle
    it('should return the expected solution for an incomplete puzzle', () => {
        assert.equal(solver.solve(puzzlesAndSolutions[3][0]), puzzlesAndSolutions[3][1]);
    });
});
