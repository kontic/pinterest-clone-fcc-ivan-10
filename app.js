var express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , expressSession = require('express-session')
  , passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy;
  
var app = express();

var connectToDb = require('./connection')
  , index = require('./routes/index')
  , users = require('./routes/users')
  , login = require('./routes/login')
  , signup = require('./routes/signup')
  , logout = require('./routes/logout')
  , your_tiles = require('./routes/your_tiles')
  , new_tile = require('./routes/new_tile')
  , vote_for_tile = require('./routes/vote_for_tile')
  , delete_tile = require('./routes/delete_tile')
  , User = require('./models/user');


/******************************************************************************/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: process.env.SESSION_SECRET || 'QQrHt0ZAuocx5UBLI6cn',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//verify user
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({name: username}, function(err, user){
      if (err) throw err;
      if (!user){
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.check_pass(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      } 
      return done(null, { id: user._id, name: user.name });
    });
  }
));

//passport twitter [start]
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: "https://pinterest-clone-fcc-ivan-10-ivan8.c9users.io/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
    User.findOne({ name: '@' + profile.username, twitter_id: profile.id  }, function (err, user) {
      if (err) throw err;
      if (!user){
        //new user
        var new_user = new User({
          name: '@' + profile.username,
          password: "$2a$10$oX5Y5H8QEeDyOeRIfre.UeGAOzBHUILjh9ikwMqLgb98nDWUcGo6S", //valid BCrypt hash!!!
          twitter_id: profile.id
        });
        new_user.save().then(function(){
          //---
          return cb(err, new_user);
        });
      }else{
        return cb(err, user);
      }
    });
  }
));

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
//passport twitter [end]

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user) {
    if (err) throw err;
    done(null, { id: user._id, name: user.name });
  });
});

/******************************************************************************/
//routes
app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/signup', signup);
app.use('/logout', logout);
app.use('/your_tiles', your_tiles);
app.use('/new_tile', new_tile);
app.use('/vote_for_tile', vote_for_tile);
app.use('/delete_tile', delete_tile);

/******************************************************************************/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

connectToDb();

module.exports = app;
