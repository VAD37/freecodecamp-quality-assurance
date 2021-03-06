const passport = require('passport');

module.exports = function (app, myDataBase) {
    SetupMainPage(app);
    SetupLogin(app);
    SetupProfilePage(app);
    SetupLogout(app);
    SetupRegister(app, myDataBase);
    SetupChat(app);
}

function SetupChat(app) {
    app.route('/chat').get((req, res) => {
        //Change the response to render the Pug template
        res.render('pug/chat', { user: req.user });
    });
}

function SetupRegister(app, myDataBase) {
    app.route('/register')
        .post((req, res, next) => {
            myDataBase.findOne({ username: req.body.username }, function (err, user) {
                if (err) {
                    next(err);
                } else if (user) {
                    res.redirect('/');
                } else {
                    const hash = bcrypt.hashSync(req.body.password, 12);
                    myDataBase.insertOne({
                        username: req.body.username,
                        password: hash
                    },
                        (err, doc) => {
                            if (err) {
                                res.redirect('/');
                            } else {
                                // The inserted document is held within
                                // the ops property of the doc
                                next(null, doc.ops[0]);
                            }
                        }
                    );
                }
            });
        },
            passport.authenticate('local', { failureRedirect: '/' }),
            (req, res, next) => {
                res.redirect('/profile');
            }
        );
}

function SetupProfilePage(app) {
    app.route('/profile').get(ensureAuthenticated, (req, res) => {
        res.render('pug/profile', { username: req.user.username });
    });
}

function SetupLogout(app) {
    app.route('/logout')
        .get((req, res) => {
            req.logout();
            res.redirect('/');
        });
    app.use((req, res, next) => {
        res.status(404)
            .type('text')
            .send('Not Found');
    });
}

function SetupMainPage(app) {
    app.route('/').get((req, res) => {
        //Change the response to render the Pug template
        res.render('pug/index', {
            title: 'Connected to Database',
            message: 'Please login',
            showLogin: true,
            showRegistration: true,
            showSocialAuth: true
        });
    });
}

function SetupLogin(app) {
    app.route('/login').post(passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/'
    }));

    app.route('/auth/github')
        .get(passport.authenticate('github', { failureRedirect: '/' }))


    app.route('/auth/github/callback')
        .get(passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
            req.session.user_id = req.user.id;
            res.redirect('/chat');
        });
}

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
};