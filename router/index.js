const express = require('express');
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
        //vacantesController.validarVacante,
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

    router.get('/vacantes/pdf/:id',
        authController.verificarUsuario,
        vacantesController.descargarPdf
    );

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

    /*------------Reestablecer password-----------*/
    router.get('/reestablecer-password',
        authController.formReestablecerPassword);
    router.post('/reestablecer-password',
        authController.enviarToken);
    router.get('/reestablecer-password/:token',
    authController.reestablecerPassword);
    router.post('/reestablecer-password/:token',
    authController.guardarPassword);
    


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
        usuariosController.subirImagen,
        usuariosController.editarPerfil);

    /*------------Recibir mensajes de candidatos-----------*/
    router.post('/vacantes/:url',
        vacantesController.subirCv, //validaciones
        vacantesController.contactar); //carga en bd

    /*-----------Muestra los candidatos------------*/
    router.get('/candidatos/:id',
    authController.verificarUsuario,
    vacantesController.mostrarCandidatos);
    
    /*-----------Buscador ------------*/
    router.post('/buscador',vacantesController.buscarVacantes);
    


    return router;
}

