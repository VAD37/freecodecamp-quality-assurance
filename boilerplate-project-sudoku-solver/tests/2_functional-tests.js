const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');
chai.use(chaiHttp);

describe('Functional Tests', () => {

    // Solve a puzzle with valid puzzle string: POST request to /api/solve
    describe('POST /api/solve', () => {
        it('should return a valid solution', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzleString: puzzlesAndSolutions[0][0]
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.equal(res.body.solution, puzzlesAndSolutions[0][1]);
                    done();
                });
        });
        // Solve a puzzle with missing puzzle string: POST request to /api/solve
        it('should return a missing puzzle string error', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzleString: ''
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });
        // Solve a puzzle with invalid characters: POST request to /api/solve
        it('should return an invalid characters error', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzleString: puzzlesAndSolutions[0][0].replace(/[0-9]/g, 'a') })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });
        // Solve a puzzle with incorrect length: POST request to /api/solve
        it('should return an incorrect length error', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzleString: puzzlesAndSolutions[0][0].replace(/[0-9]/g, '') })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });
        // Solve a puzzle that cannot be solved: POST request to /api/solve
        it('should return a puzzle that cannot be solved error', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({ puzzleString: puzzlesAndSolutions[1][0] })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    });

    describe('POST /api/check', () => {
        const input =
            '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        // Check a puzzle placement with all fields: POST request to /api/check
        it('should return a valid placement', (done) => {
            const coordinate = 'A1';
            const value = '7';
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzleString: input,
                    placement: coordinate,
                    value: value
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isTrue(res.body.valid);
                    done();
                });
        });
        // Check a puzzle placement with single placement conflict: POST request to /api/check
        it('should return a single placement conflict', (done) => {
            const coordinate = 'A1';
            const value = '6';
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzleString: input,
                    placement: coordinate,
                    value: value
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, 'conflicts');
                    assert.isArray(res.body.conflicts);
                    assert.include(res.body.conflicts, 'column');
                    done();
                });
        });

        // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
        it('should return multiple placement conflict', (done) => {
            const coordinate = 'A1';
            const value = '1';
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzleString: input,
                    placement: coordinate,
                    value: value
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, 'conflicts');
                    assert.isArray(res.body.conflicts);
                    assert.include(res.body.conflicts, 'column');
                    assert.include(res.body.conflicts, 'row');
                    done();
                });
        });
        // Check a puzzle placement with all placement conflicts: POST request to /api/check
        it('should return multiple placement conflict', (done) => {
            const coordinate = 'A1';
            const value = '5';
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzleString: input,
                    placement: coordinate,
                    value: value
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, 'conflicts');
                    assert.isArray(res.body.conflicts);
                    assert.include(res.body.conflicts, 'column');
                    assert.include(res.body.conflicts, 'row');
                    assert.include(res.body.conflicts, 'region');
                    done();
                });
        });
        // Check a puzzle placement with missing required fields: POST request to /api/check
        it('should return a missing required field error', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field missing');
                    done();
                });
        });
        // Check a puzzle placement with invalid characters: POST request to /api/check
        it('should return an invalid characters error', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzleString: input,
                    placement: 'A1',
                    value: 'a'
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });
        // Check a puzzle placement with incorrect length: POST request to /api/check
        it('should return an incorrect length error', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzleString: input,
                    placement: 'A13',
                    value: '35'
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });
        // Check a puzzle placement with invalid placement: POST request to /api/check
        it('should return an invalid placement error', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzleString: input,
                    placement: 'C',
                    value: '1'
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });
    });
});

