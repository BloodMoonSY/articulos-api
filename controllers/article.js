'use strict'

//? Definir dependencias y modelos
var validator = require('validator');
var Article = require('../models/article');
var multiparty = require('connect-multiparty');
var fs = require('fs');
var path = require('path');

var controller = 
{
    //? Metodo de prueba
    datosCurso: (req, res) =>{
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en frameworks',
            autor: 'Fernando Villanueva',
            url: 'localhost:3900',
            hola
        });
    },

    //? Metodo de prueba
    test: (req, res) => {

        return res.status(200).send({message: 'Probando controlador articulos'});

    },

    //? Metodo para guardar un articulo
    save: (req, res) => {
        //? Recoger parametros por post
        var params = req.body;

        //? Validar datos
        try{
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);

        }catch(err){
            //! Campos incompletos
            return res.status(200).send({status: 'error', message: 'Faltan datos por enviar!!'});
        }

        //* Varificar si es correcta
        if(validate_title && validate_content){

            //? Crear objeto a guardar
            var article = new Article();

            //? Asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;

            //* Guardar el articulo
            article.save((err, articleStored)=>{

                if(err || !articleStored){
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    });
                }

                //* Devolver el articulo
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });

            });
        }else{
            //! Datos incorrectos
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos'
            });
        }
    },
    //? Obtener todos los articulos
    getArticles: (req, res) => {

        var query = Article.find({}, {__v:0});

        var last = req.params.last;

        if(last || last != undefined){
            query.limit(5);
        }

        //* Usamos un find para obtener todos los articulos
        query.sort('-_id').exec((err, articlesSearched)=>{

            if(err || !articlesSearched){
                return res.status(404).send({
                    status: 'error',
                    message: 'Error en el servidor / Algo sucedio al buscar los articulos'
                });
            }

            return res.status(200).send({articlesSearched});

        });
    },
    //? Obtener un articulo
    getArticle: (req, res) => {

        //? Asignamos el Id del articulo
        var articleId = req.params.id;

        //! Validamos
        if(!articleId || articleId == null){
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }

        //* Funcion para arrojar 1 resultado
        Article.findById({_id: articleId}, {__v: 0}).exec((err, articleFinded)=>{

            //! Capturamos los errores
            if(err || !articleFinded){
                return res.status(404).send({
                    status: 'error',
                    message: 'No exite el articulo'
                });
            }

            //* Obtenemos el articulo
            return res.status(200).send({article: articleFinded});
        });
    },

    //? Metodo para actualizar articulo
    update: (req, res) => {

        //* Id del articulo a actualizar
        var articleId = req.params.id;

        //* Recogemos los datos que llegan por put
        var params = req.body;

        //* Validacion de articulos
        try{

            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.conten);

        }catch(err){
            //! Capturamos el error
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar'
            });
        }

        if(validate_title && validate_content){

            //* Actualizamos el objeto
            Article.findByIdAndUpdate({_id: articleId}, params, {new: true}, (err, articleUpdated)=>{

                //! Capturamos los errores
                if(err){
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error en el servidor'
                    });
                }
                if(!articleUpdated){
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo'
                    });
                }

                //* Actualizar articulo
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });

            });

        }else{

            //! Devolvemos resultado
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            });

        }

    },

    //? Eliminar articulo
    removeArticle: (req, res) => {

        var articleId = req.params.id;

        Article.findByIdAndDelete({_id: articleId}).exec((err, articleDeleted)=>{

            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en el servidor'
                });
            }
            if(!articleDeleted){
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha podido eliminar el articulo'
                });
            }

            return res.status(200).send({
                status: 'success',
                article: articleDeleted
            });

        });

    },

    //? Subir archivos de imagen
    upload: (req, res) =>{

        //* Obtenemos el archivo
        var file_name = 'Imagen no subida . . .';

        //! Validamos que no este vacio
        if(!req.files){
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }

        //* Conseguir el nombre y extension del archivo
        var file_path = req.files.file0.path;

        //? Obtener nombre y extension en WINDOWS
        var file_split = file_path.split('\\');

        //! Obtener nombre y extension en LINUX o MAC
        // var file_split = file_path.split('/');

        //* Nombre del archivo
        var file_name = file_split[2];

        //* Separacion extension de archivo
        var extension_split = file_name.split('\.');

        //* Extension de archivo
        var file_ext = extension_split[1];

        //! Comprobar la extension solo imagenes, si es valida borrar el fichero
        if(file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'png' && file_ext != 'gif'){

            //! Eliminar el archivo subido
            fs.unlink(file_path, (err)=>{
                return res.status(200).send({
                    status: 'error',
                    message: 'La extension de la imagen no es correcta'
                });
            });

        }else{

            //* Obtenemos el Id del articulo a modificar
            var articleId = req.params.id;

            //* Actualizamos la imagen
            Article.findOneAndUpdate({_id: articleId}, {image: file_name}, {new: true}, (err, articleUpdated)=>{

                //! Obtenemos los errores
                if(err || !articleUpdated){
                    return res.status(200).send({
                        status: 'error',
                        message: 'Error al guardar la imagen del articulo!!'
                    });
                }

                //* Actualizamos
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
                
            });
        }
    },

    //? Obtner Imagen de Articulo
    getImage: (req, res) => {

        //* Asignamos la imagen
        var file = req.params.image;

        //* Asignamos la ruta de la imagen
        var path_file = './uploads/articles/' + file;

        //* Validamos que exista la imagen
        fs.exists(path_file, (exists) => {

            if(exists){
                
                return res.sendFile(path.resolve(path_file));

            }else{

                //! No existe la imagen
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

    //? Buscado de articulos
    search: (req, res) => {
        //* Articulo a buscar
        var searchString = req.params.search;

        //* Buscar articulo
        Article.find({ "$or": [
            { "title": { "$regex": searchString, "$options": "i"}},
            { "content": { "$regex": searchString, "$options": "i"}}
        ]})
        .sort([['data', 'descending']])
        .exec((err, articles) => {

            //! Obtenemos los errores
            if(err){
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la peticion'
                });
            }
            if(!articles || articles.length <= 0){
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos que coincidan con tu busqueda'
                });
            }

            //* Mostramos las coincidencias
            return res.status(200).send({
                status: 'success',
                articles
            });
        });
    }

}//!    FIN DEL CONTROLADOR

//? Exportar el controlador en archivos de rutas y el proyecto
module.exports = controller;