var express = require('express')
  , Tile = require('../models/tile')
  , router = express.Router();



router.post('/', function(req, res){
  var tile = new Tile({
        title: req.body.tile_title,
        source: req.body.tile_url,
        added_by: req.user.name,
      });
      tile.save().then(function(){
        //---
        Tile.find({added_by: req.user.name}, function(err, tiles){
          if (err) throw err;
          res.send({data: tiles});
        });
    
        // res.send({stat: 'ok'});
      });
});

module.exports = router;





