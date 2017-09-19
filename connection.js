const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

function connectToDb(){
  //Connect to mongodb
  mongoose.connect('mongodb://localhost:27017/pinterest-clone-db');
  mongoose.connection.once('open', function(){
    console.log('The connection to the database has been established!');
  }).on('error', function(error){
    console.log('Connection to db error:', error);
  });
}

module.exports = connectToDb;