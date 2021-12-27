'use strict';
require('dotenv').config();
require('pug');
const express = require('express');
const myDB = require('./connection');
const passport = require('passport');
const session = require('express-session');
const fccTesting = require('./freeCodeCamp/fcctesting.js');

const routes = require('./routes.js');
const auth = require('./auth.js');

const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo')(session);
const URI = process.env.MONGO_URI;
const store = new MongoStore({ url: URI });


const app = express();


const http = require('http').createServer(app);
const io = require('socket.io')(http);


SetupApp();
SetupDatabaseAndPages();

const PORT = process.env.PORT || 9560;
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT);
});


function SetupApp() {
  fccTesting(app); //For FCC testing purposes
  app.use('/public', express.static(process.cwd() + '/public'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.set('view engine', 'pug');

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
}

function SetupDatabaseAndPages() {
  myDB(async (client) => {
    const myDataBase = await client.db('database').collection('users');
    routes(app, myDataBase);
    auth(app, myDataBase);

    SetupIOSocket();



  }).catch(e => {
    app.route('/').get((req, res) => {
      res.render('pug/index', { title: e, message: 'Unable to login' });
    });
  });
}
function SetupIOSocket() {
  let currentUsers = 0;

  io.use(
    passportSocketIo.authorize({
      cookieParser: cookieParser,
      key: 'express.sid',
      secret: process.env.SESSION_SECRET,
      store: store,
      success: onAuthorizeSuccess,
      fail: onAuthorizeFail
    })
  );

  io.on('connection', socket => {
    console.log('A user has connected');
    ++currentUsers;

    io.emit('user', {
      name: socket.request.user.name,
      currentUsers,
      connected: true
    });

    socket.on('chat message', (message) => {
      io.emit('chat message', { name: socket.request.user.name, message });
    });
  });
}

function onAuthorizeSuccess(data, accept) {
  console.log('successful connection to socket.io');

  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  if (error) throw new Error(message);
  console.log('failed connection to socket.io:', message);
  accept(null, false);
}
