var express = require('express');
var Tile = require('../models/tile');
var router = express.Router();

/* GET test_page page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    Tile.find({added_by: req.user.name}, function(err, tiles){
      if (err) throw err;
      res.render('your_tiles', { 
        isAuthenticated: req.isAuthenticated(),
        user: req.user,
        tiles: tiles
      });
    });
  }else{
    res.redirect('/');
  }
});

module.exports = router;




  