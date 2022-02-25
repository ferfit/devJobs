const express = require('express');
const { route } = require('express/lib/application');
const router = express.Router();
const homeController = require('../controller/homeController');
const vacantesController = require('../controller/vacantesController');
const usuariosController = require('../controller/usuariosController');
const authController = require('../controller/authController');

module.exports = () =>{

    router.get('/', homeController.mostrarTrabajos);


    /*------------Vacantes-----------*/
    router.get('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.agregarVacante);
    router.get('/vacantes/:url',vacantesController.mostrarVacante);
    router.get('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.formEditarVacante);
    router.post('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.editarVacante);
    router.delete('/vacantes/eliminar/:id', vacantesController.eliminarVacante)

    /*------------Usuarios-----------*/
    router.get('/crear-cuenta',usuariosController.formCrearCuenta);
    router.post('/crear-cuenta',
    usuariosController.validarRegistro,
    usuariosController.crearUsuarios);

    /*------------Autenticar Usuarios-----------*/
    router.get('/iniciar-sesion',usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion',authController.autenticarUsuario);
    router.get('/cerrar-sesion',
        authController.verificarUsuario,
        authController.cerrarSesion);

    /*------------Panel de administracion-----------*/
    router.get('/administracion',
        authController.verificarUsuario,
        authController.mostrarPanel);
    
    /*------------Editar perfil-----------*/
    router.get('/editar-perfil',
        authController.verificarUsuario,
        usuariosController.formEditarPerfil);
    router.post('/editar-perfil',
        authController.verificarUsuario,
        //usuariosController.validarPerfil,
        usuariosController.editarPerfil);
    
    
    

    
    




    return router;
}

