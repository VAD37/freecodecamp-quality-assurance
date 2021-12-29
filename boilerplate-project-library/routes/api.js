/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
var uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true });

const BookSchema = new mongoose.Schema({
  title: String,
  comments: [String]
});
const LibraryModel = mongoose.model("Library", BookSchema);

function GetAllBooks(req, res) {
  LibraryModel.find({}, function (err, books) {
    if (err) {
      res.send(err);
    }
    // Send back new books array only have tittle and _id with total commentcount    
    let formatBooks = books.map(book => ({
      _id: book._id,
      title: book.title,
      commentcount: book.comments.length
    }));
    res.json(formatBooks);
  });
}

async function PostCreateNewBook(req, res) {
  let title = req.body.title;
  if (!title) {
    res.send('missing required field title');
    return;
  }
  // Create new book in database
  let newBook = new LibraryModel({
    title: title,
    comments: []
  });
  await newBook.save();
  res.json(newBook);
}



function DeleteAllBooks(req, res) {
  //if successful response will be 'complete delete successful'
  LibraryModel.deleteMany({}, function (err) {
    if (err) {
      res.send(err);
    } else
      res.send('complete delete successful');
  });
}

function GetABookFromDatabase(req, res) {
  let bookid = req.params.id;
  LibraryModel.findById(bookid, function (err, book) {
    if (err || book == null) {
      res.send('no book exists');
      return;
    }
    res.json(book);
  });
}

function PostAddNewCommentToBook(req, res) {
  let bookid = req.params.id;
  let comment = req.body.comment;
  if (!bookid) {
    res.send('missing required field bookid');
    return;
  }
  if (!comment) {
    res.send('missing required field comment');
    return;
  }
  LibraryModel.findById(bookid, function (err, book) {
    if (err || book == null) {
      res.send('no book exists');
      return;
    }
    // Add comment to book
    book.comments.push(comment);
    book.save(function (err) {
      if (err) {
        res.send(err);
      }
      else
        res.json(book);
    });
  });
}

function DeleteABook(req, res) {
  let bookid = req.params.id;
  LibraryModel.findByIdAndDelete(bookid, function (err, book) {
    if (err || book == null) {
      res.send('no book exists');
    }
    else res.send('delete successful');
  });
}

module.exports = function (app) {

  app.route('/api/books')
    .get(GetAllBooks)
    .post(PostCreateNewBook)
    .delete(DeleteAllBooks);
  app.route('/api/books/:id')
    .get(GetABookFromDatabase)
    .post(PostAddNewCommentToBook)
    .delete(DeleteABook);
};
