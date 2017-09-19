var express = require('express')
  , Tile = require('../models/tile')
  , router = express.Router();


router.post('/', function(req, res){
  Tile.findByIdAndRemove(req.body.tile_id, function(err, tile){
    if (err) throw err;
    res.status(200).send({deleted: true});
  });
});

module.exports = router;


