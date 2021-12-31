const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');

describe('Functional Tests', () => {

    //     If one or more of the required fields is missing, return { error: 'Required field(s) missing' }.
    // If text is empty, return { error: 'No text to translate' }

    // If text requires no translation, return "Everything looks good to me!" for the translation value.
    // Translation with text and locale fields: POST request to /api/translate
    it('Translation with text and locale fields POST request to /api/translate', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: 'Mangoes are my favorite fruit.',
                locale: 'american-to-british'
            })
            .end((err, res) => {
                assert.equal(res.body.translation, 'Mangoes are my <span class=\"highlight\">favourite</span> fruit.');
                done();
            });
    })

    // Translation with text and invalid locale field: POST request to /api/translate
    it('should return { error: "Invalid value for locale field" } if locale is invalid', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: 'Mangoes are my favorite fruit.',
                locale: 'invalid-locale'
            })
            .end((err, res) => {
                assert.equal(res.body.error, 'Invalid value for locale field');
                done();
            });
    });
    // Translation with missing text field: POST request to /api/translate
    it('should return { error: "Required field(s) missing" } if missing text field', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                locale: 'american-to-british'
            })
            .end((err, res) => {
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });
    // Translation with missing locale field: POST request to /api/translate
    it('should return { error: "Required field(s) missing" } if missing locale field', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: 'Mangoes are my favorite fruit.',
            })
            .end((err, res) => {
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    // Translation with empty text: POST request to /api/translate
    it('should return { error: "No text to translate" } if text is empty', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: '',
                locale: 'american-to-british'
            })
            .end((err, res) => {
                assert.equal(res.body.error, 'No text to translate');
                done();
            });
    });
    // Translation with text that needs no translation: POST request to /api/translate
    it('should return "Everything looks good to me!" for the translation value', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: 'I am a random text',
                locale: 'american-to-british'
            })
            .end((err, res) => {
                assert.equal(res.body.translation, 'Everything looks good to me!');
                done();
            });
    });

    // Translation with text that needs no translation: POST request to /api/translate
    it('should return "Everything looks good to me!" for SaintPeter and nhcarrigan give their regards!', (done) => {
        chai.request(server)
            .post('/api/translate')
            .send({
                text: 'SaintPeter and nhcarrigan give their regards!',
                locale: 'american-to-british'
            })
            .end((err, res) => {
                assert.equal(res.body.translation, 'Everything looks good to me!');
                done();
            });
    });

});
