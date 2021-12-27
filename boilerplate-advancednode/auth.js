require('dotenv').config();
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');
const passport = require('passport');
const bcrypt = require('bcrypt');
const GitHubStrategy = require('passport-github').Strategy;
module.exports = function (app, myDataBase) {
    SetupPasspost(app, myDataBase);
    SetupGithubStrategy(myDataBase);
}



function SetupGithubStrategy(myDataBase) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "https://test.vad37.com/auth/github/callback"
  },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      //Database logic here with callback containing our user object
      myDataBase.findOneAndUpdate(
        { id: profile.id },
        {
          $setOnInsert: {
            id: profile.id,
            name: profile.displayName || 'John Doe',
            photo: profile.photos[0].value || '',
            email: Array.isArray(profile.emails)
              ? profile.emails[0].value
              : 'No public email',
            created_on: new Date(),
            provider: profile.provider || ''
          },
          $set: {
            last_login: new Date()
          },
          $inc: {
            login_count: 1
          }
        },
        { upsert: true, new: true },
        (err, doc) => {
          return cb(null, doc.value);
        }
      );
    }
  ));
}

function SetupPasspost(app, myDataBase) {
    passport.use(new LocalStrategy(
        function (username, password, done) {
            myDataBase.findOne({ username: username }, function (err, user) {
                console.log('User ' + username + ' attempted to log in.');
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                // new hash password
                if (!bcrypt.compareSync(password, user.password)) {
                    return done(null, false);
                }
                // if (password !== user.password) { return done(null, false); }
                return done(null, user);
            });
        }
    ));
    // Serialization and deserialization here...
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        myDB.findOne({ _id: new ObjectID(id) }, (err, doc) => {
            done(null, null, doc);
        });
    });
}
