/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

describe('Functional Tests', function () {

  describe('Routing tests', function () {
    // You can send a POST request to /api/books with title as part of the form data to add a book.
    // The returned response will be an object with the title and a unique _id as keys. 
    // If title is not included in the request, the returned response should be the string missing required field title.
    describe('POST /api/books with title => create book object/expect book object', function () {

      it('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({ title: 'test title' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'test title');
            assert.property(res.body, '_id');
            done();
          });
      });

      it('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });

    });

    // You can send a GET request to /api/books and receive a JSON response representing all the books. 
    // The JSON response will be an array of objects with each object (book) containing title, _id, and commentcount properties.
    describe('GET /api/books => array of books', function () {
      it('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });

    });

    // You can send a GET request to /api/books/{_id} to retrieve a single object of a book containing 
    // the properties title, _id, and a comments array (empty array if no comments present). 
    // If no book is found, return the string no book exists.
    describe('GET /api/books/[id] => book object with [id]', function () {
      // Create a book object before running tests
      let book;
      before(function (done) {
        chai.request(server).post('/api/books').send({ title: 'test title' }).end(function (err, res) {
          book = res.body;
          done();
        });
      });

      it('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/5b7c5c5a5f7f6a0c6d2e6b8c')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

      it('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get('/api/books/' + book._id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'test title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');
            done();
          });
      });

    });

    // You can send a POST request containing comment as the form body data to /api/books/{_id} to add a comment to a book. 
    //The returned response will be the books object similar to GET /api/books/{_id} request in an earlier test.
    // If comment is not included in the request, return the string missing required field comment.
    // If no book is found, return the string no book exists.
    describe('POST /api/books/[id] => add comment/expect book object with id', function () {
      // Create a book object before running tests
      let book;
      before(function (done) {
        chai.request(server).post('/api/books').send({ title: 'Test Book for POST comment' }).end(function (err, res) {
          book = res.body;
          done();
        });
      });

      it('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post('/api/books/' + book._id)
          .send({ comment: 'test comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.comments[0], 'test comment');
            done();
          });
      });

      it('Test POST /api/books/[id] without comment field', function (done) {
        chai.request(server)
          .post('/api/books/' + book._id)
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'missing required field comment');
            done();
          });
      });

      it('Test POST /api/books/[id] with comment, id not in db', function (done) {
        chai.request(server)
          .post('/api/books/5b7c5c5a5f7f6a0c6d2e6b8c')
          .send({ comment: 'test comment' })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });
    //You can send a DELETE request to /api/books/{_id} to delete a book from the collection.
    // The returned response will be the string delete successful if successful.
    // If no book is found, return the string no book exists.
    describe('DELETE /api/books/[id] => delete book object id', function () {
      // Create a book object before running tests
      let book;
      before(function (done) {
        chai.request(server).post('/api/books').send({ title: 'Test Book for DELETE' }).end(function (err, res) {
          book = res.body;
          done();
        });
      });
      it('Test DELETE /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .delete('/api/books/' + book._id)
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'delete successful');
            done();
          });
      });

      it('Test DELETE /api/books/[id] with  id not in db', function (done) {
        chai.request(server)
          .delete('/api/books/5b7c5c5a5f7f6a0c6d2e6b8c')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
          });
      });

    });

    // You can send a DELETE request to /api/books to delete all books in the database.
    // The returned response will be the string 'complete delete successful if successful.
    describe('DELETE /api/books => delete all books', function () {
      it('Test DELETE /api/books', function (done) {
        chai.request(server)
          .delete('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'complete delete successful');
            // Check Get all books
            chai.request(server).get('/api/books').end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.length, 0);
              done();
            });
          });
      });
    });
  });
});
