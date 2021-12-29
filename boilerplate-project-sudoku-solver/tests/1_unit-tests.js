const chai = require('chai');
const assert = chai.assert;
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();


describe('UnitTests', () => {
    // Logic handles a valid puzzle string of 81 characters
    it('should return a valid puzzle string of 81 characters', () => {        
        assert.equal(solver.validate(puzzlesAndSolutions[0][0]), true);
        assert.equal(solver.validate(puzzlesAndSolutions[1][0]), true);
        assert.equal(solver.validate(puzzlesAndSolutions[2][0]), true);
    });
    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    it('should return a puzzle string with invalid characters (not 1-9 or .)', () => {
        assert.equal(solver.validate(puzzlesAndSolutions[0][0].replace(/[1-9]/g, 'a')), false);
        assert.equal(solver.validate(puzzlesAndSolutions[1][0].replace(/[1-3]/g, '"')), false);
        assert.equal(solver.validate(puzzlesAndSolutions[1][0].replace(/[1-7]/g, '(')), false);
    });
    // Logic handles a puzzle string that is not 81 characters in length
    it('should return a puzzle string that is not 81 characters in length', () => {
        assert.equal(solver.validate(puzzlesAndSolutions[0][0].slice(0, 80)), false);
        assert.equal(solver.validate(puzzlesAndSolutions[1][0].slice(0, 60)), false);
        assert.equal(solver.validate(puzzlesAndSolutions[2][0]+'..13.123.123.541'), false);
    });
    // Logic handles a valid row placement
    it('should return a valid row placement', () => {
        assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 1, 0, '3'), true);
        assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 1, 0, '6'), true);
        assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 1, 0, '7'), true);
    });
    // Logic handles an invalid row placement
    it('should return an invalid row placement', () => {
        assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 1, 0, '14'), false);
        assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 1, 0, '1'), false);
        assert.equal(solver.checkRowPlacement(puzzlesAndSolutions[0][0], 1, 0, '8'), false);
    });
    // Logic handles a valid column placement
    it('should return a valid column placement', () => {
        assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 1, '1'), true);
        assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 1, '8'), true);
        assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 1, '3'), true);
    });

    // Logic handles an invalid column placement
    it('should return an invalid column placement', () => {
        assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 1, '6'), false);
        assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 1, '9'), false);
        assert.equal(solver.checkColPlacement(puzzlesAndSolutions[0][0], 0, 1, '2'), false);
    });
    // Logic handles a valid region (3x3 grid) placement
    it('should return a valid region (3x3 grid) placement', () => {
        assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 0, 0, '4'), true);
        assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 0, 0, '8'), true);
        assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 0, 0, '9'), true);
    });
    // Logic handles an invalid region (3x3 grid) placement
    it('should return an invalid region (3x3 grid) placement', () => {
        assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 0, 0, '1'), false);
        assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 0, 0, '2'), false);
        assert.equal(solver.checkRegionPlacement(puzzlesAndSolutions[0][0], 0, 0, '6'), false);
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
        assert.equal(solver.solve(impossiblePuzzle), null);
    });
    // Solver returns the expected solution for an incomplete puzzle
    it('should return the expected solution for an incomplete puzzle', () => {
        assert.equal(solver.solve(puzzlesAndSolutions[3][0]), puzzlesAndSolutions[3][1]);
    });
});
