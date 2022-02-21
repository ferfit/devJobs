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

const app = express();

//Habilitar handlebars como views
app.engine('handlebars',
    exphbs.engine({
        defaultLayout:'layout'
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

//Ruteo
app.use('/',router());

//Escucha en puerto
app.listen(process.env.PUERTO);