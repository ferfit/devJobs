const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const homeController = require('../controller/homeController');
const vacantesController = require('../controller/vacantesController');
const usuariosController = require('../controller/usuariosController');

module.exports = () =>{

    router.get('/', homeController.mostrarTrabajos);


    /*------------Vacantes-----------*/
    router.get('/vacantes/nueva',vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva',vacantesController.agregarVacante);
    router.get('/vacantes/:url',vacantesController.mostrarVacante);
    router.get('/vacantes/editar/:url',vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url',vacantesController.editarVacante);

    /*------------Usuarios-----------*/
    router.get('/crear-cuenta',usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',usuariosController.crearUsuarios);

    return router;
}

