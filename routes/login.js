var express = require('express')
  , router = express.Router()
  , passport = require('passport');

//render login page
router.get('/', function(req, res, next) {
  res.render('login', { 
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

//form has to have fields with names "username" and "password", because of authentication
router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { 
      return res.render('login', { 
        isAuthenticated: false,
        message: info.message,
        username: req.body.username,
        password: req.body.password
      });
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

module.exports = router;