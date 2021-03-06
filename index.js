const mongoose = require('mongoose');
require('./config/db');

const express = require('express');
const router = require('./router');
const exphbs = require('express-handlebars');
const path = require('path');
require('dotenv').config({path: 'variables.env'}); // path nos permite endicar el directorio y llamoas a las variables meidante process.env.VARIABLE
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser'); //viene con express
const flash = require('connect-flash');
const passport = require('./config/passport');
const createError = require('http-errors');


const app = express();

//Habilitar bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Habilitar handlebars como views
app.engine('handlebars',
    exphbs.engine({
        defaultLayout:'layout',
        helpers: require('./helpers/handlebars')
    })
);

app.set('view engine','handlebars');

//Archivos esticos - precisa requerir path - utilidad incluida en nodejs
app.use(express.static(path.join(__dirname,'public')));
//CookieParser
app.use(cookieParser());
//Express-session
app.use(session({
    secret:process.env.SECRETO,
    key:process.env.KEY,
    resave:false,
    saveUninitialized:false,
    store: MongoStore.create({mongoUrl: process.env.DATABASE})
}));
// habilita passport   
app.use(passport.initialize());
app.use(passport.session());

//hablita flah y crea un middleware
app.use(flash());

app.use((req,res,next) => {
    res.locals.mensajes = req.flash();
    next();
});

//Ruteo
app.use('/',router());

//404 pagina no existe
app.use((req,res,next)=>{
    next(createError(404,'No encontrado'))
})

//Administracion de los errores
app.use((error,req,res,next)=>{
    res.locals.mensaje = error.message;
    const status = error.status || 500; //si no existe el error o no lo pasa, por defecto 500
    res.locals.status = status;
    res.status(status)
    res.render('error');
})

//Escucha en puerto
app.listen(process.env.PUERTO);