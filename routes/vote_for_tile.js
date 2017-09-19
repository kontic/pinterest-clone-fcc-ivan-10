var express = require('express')
  , Tile = require('../models/tile')
  , router = express.Router();


router.post('/', function(req, res){
  Tile.findById(req.body.tile_id, function(err, tile){
    if (err) throw err;
    if (tile.liked_by.indexOf(req.user.name) >= 0){
      tile.liked_by.splice(tile.liked_by.indexOf(req.user.name), 1);
    }else{
      tile.liked_by.push(req.user.name);
    }
    tile.save().then(function(){
      res.send({changed_tile: tile});
    });
  });
});

module.exports = router;

