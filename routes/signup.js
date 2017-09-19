var express = require('express')
  , User = require('../models/user')
  , bcrypt = require('bcrypt-nodejs')
  , router = express.Router();

//render signup page
router.get('/', function(req, res, next) {
  res.render('signup', { 
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  });
});

//responds to validation from singup frontend page (if user exists => 'ok' else =>'not ok')
router.post('/', function(req, res){
  User.findOne({name: req.body.username}, function(err, user_db){
    if (err) throw err;
    if (!user_db){
      //new user
      var user = new User({
        name: req.body.username,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      });
      user.save().then(function(){
        //---
        res.send({stat: 'ok'});
      });
    }else{
      //user already exists
      res.send({stat: 'not ok'});
    }
  });
});

module.exports = router;