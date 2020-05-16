'use strict'

//? Cargar dependencias de NodeJS
var express = require('express');
var bodyParser = require('body-parser');

//? Ejecutar Express (HTTP)
var app = express();

//? Cargar ficheros rutas
var aricle_routes = require('./routes/article');

//? Cargar Middlewares
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//? CORS
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

//? Añadir prefijos a rutas / cargar rutas
app.use('/', aricle_routes);

//? Exportar modulos(fichero actual)
module.exports = app;