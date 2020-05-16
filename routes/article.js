'use strict'

//? Definimos dependencias y modelos
var express = require('express');
var ArticleController = require('../controllers/article');
var multipart = require('connect-multiparty');

var router = express.Router();
var md_upload = multipart({uploadDir: './uploads/articles'});

//? Definimos rutas de prueba
router.get('/test-article', ArticleController.test);
router.post('/test-article', ArticleController.datosCurso);

//* Ruta para articulos
router.post('/save', ArticleController.save);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.delete('/article/:id', ArticleController.removeArticle);
router.post('/upload-image/:id', md_upload , ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);

//? Exportar rutas
module.exports = router;