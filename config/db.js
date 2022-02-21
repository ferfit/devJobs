const mongoose = require('mongoose');
require('dotenv').config({path:'variables.env'});
//conectamos a la bd
mongoose.connect(process.env.DATABASE,{useNewUrlParser:true});
//Linea que nos permite sabe si hay al error en la conexion
mongoose.connection.on('error',error =>{
    console.log(error)
});

//Importamos los modelos
require('../models/Vacantes');