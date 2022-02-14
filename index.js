const express = require('express');
const router = require('./router');
const exphbs = require('express-handlebars');
const path = require('path');

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

//Ruteo
app.use('/',router());

//Escucha en puerto
app.listen(5000);