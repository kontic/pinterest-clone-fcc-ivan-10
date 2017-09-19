var express = require('express')
  , router = express.Router();

/* logout */
router.get('/', function(req, res){
  req.logout(); 
  res.redirect('/');
});

module.exports = router;



