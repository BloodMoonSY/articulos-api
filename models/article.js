'use strict'

//? Referencias a dependecias
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//? Definicion de schema en mongodb
var ArticleSchema = Schema({
    title: String,
    content: String,
    date: {type: Date, default: Date.now},
    image: String
});

//? Exportarlo como modulo y usarlo
module.exports = mongoose.model('Article', ArticleSchema);