const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const puzzlesAndSolutions = require('../controllers/puzzle-strings.js');
chai.use(chaiHttp);

describe('Functional Tests', () => {

    
    describe('POST /api/solve', () => {
        // Solve a puzzle with valid puzzle string: POST request to /api/solve
        it('should return a valid solution', (done) => {
            chai.request(server)
                .post('/api/solve')
                .send({
                    puzzle: puzzlesAndSolutions[0][0]
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
                    puzzle: ''
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
                .send({ puzzle: puzzlesAndSolutions[0][0].replace(/[0-9]/g, 'a') })
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
                .send({ puzzle: puzzlesAndSolutions[0][0].replace(/[0-9]/g, '') })
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
                .send({ puzzle: '5..91372.3...8.5.9.9.25778.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3' })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.equal(res.body.error, 'Puzzle cannot be solved');
                    done();
                });
        });
    });

    describe('POST /api/check', () => {
        const input = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        // Check a puzzle coordinate with all fields: POST request to /api/check
        it('should return a valid coordinate', (done) => {
            const coordinate = 'A1';
            const value = '7';
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: coordinate,
                    value: value
                })
                .end((err, res) => {
                    
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.isTrue(res.body.valid);
                    done();
                });
        });
        // Check a puzzle coordinate with single coordinate conflict: POST request to /api/check
        it('should return a single coordinate conflict', (done) => {
            const coordinate = 'A1';
            const value = '6';
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: coordinate,
                    value: value
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, 'conflict');
                    assert.isArray(res.body.conflict);
                    assert.include(res.body.conflict, 'column');
                    done();
                });
        });

        // Check a puzzle coordinate with multiple coordinate conflict: POST request to /api/check
        it('should return multiple coordinate conflict', (done) => {
            const coordinate = 'A1';
            const value = '1';
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: coordinate,
                    value: value
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, 'conflict');
                    assert.isArray(res.body.conflict);
                    assert.include(res.body.conflict, 'column');
                    assert.include(res.body.conflict, 'row');
                    done();
                });
        });
        // Check a puzzle coordinate with all coordinate conflict: POST request to /api/check
        it('should return multiple coordinate conflict', (done) => {
            const coordinate = 'A1';
            const value = '5';
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: coordinate,
                    value: value
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);
                    assert.property(res.body, 'conflict');
                    assert.isArray(res.body.conflict);
                    assert.include(res.body.conflict, 'column');
                    assert.include(res.body.conflict, 'row');
                    assert.include(res.body.conflict, 'region');
                    done();
                });
        });
        // Check a puzzle coordinate with missing required fields: POST request to /api/check
        it('should return a missing required field error', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({})
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });
        // Check a puzzle coordinate with invalid characters: POST request to /api/check
        it('should return an invalid characters error', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: 'A1',
                    value: 'a'
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });
        // Check a puzzle coordinate with incorrect length: POST request to /api/check
        it('should return an incorrect length error', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: 'A13',
                    value: '35'
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });
        // Check a puzzle coordinate with invalid coordinate: POST request to /api/check
        it('should return an invalid coordinate error', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: 'ZXC',
                    value: '3'
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });
        // Check a puzzle placement with invalid placement value: POST request to /api/check
        it('Should return invalid value error', (done) => {
            chai.request(server)
                .post('/api/check')
                .send({
                    puzzle: input,
                    coordinate: 'A1',
                    value: '0'
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        })
    });
});

