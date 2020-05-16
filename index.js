'use strict'
//? Referencia a dependecia
var mongoose = require('mongoose');
var app = require('./app');
var port = (process.env.PORT || 3900);

//? Hace que desactivemos los antigüos metodos de mongoose y usemos los nuevos los que estan documentados
mongoose.set('useFindAndModify', false);

//? Decimos que haga promesas al metodo mongoose
mongoose.Promise = global.Promise;

//? Conexion a base de datos
mongoose.connect('mongodb://localhost:27017/blog', {useNewUrlParser: true, useUnifiedTopology: true})

    .then(()=>{

        console.log("You're connected to database");

        //* Crear el servidor y escuchar peticiones HTTP
        app.listen(port, ()=>{

            console.log("Servidor http://localhost:" + port);

        });

});