var express = require('express');
var Tile = require('../models/tile');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  Tile.find({}, function(err, tiles){
    if (err) throw err;
    res.render('index', { 
      isAuthenticated: req.isAuthenticated(),
      user: req.user,
      tiles: tiles
    });
  });  
});

module.exports = router;

