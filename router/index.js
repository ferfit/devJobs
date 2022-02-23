const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const homeController = require('../controller/homeController');
const vacantesController = require('../controller/vacantesController');

module.exports = () =>{

    router.get('/', homeController.mostrarTrabajos);


    /*------------Vacantes-----------*/
    router.get('/vacantes/nueva',vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva',vacantesController.agregarVacante);
    router.get('/vacantes/:url',vacantesController.mostrarVacante);

    return router;
}

