const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tileSchema = new Schema({
    title: String,
    source: String,
    added_by: String,
    liked_by: [ String ]
});

const Tile = mongoose.model('tile', tileSchema);

module.exports = Tile;