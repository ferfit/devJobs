const passport = require('passport');

exports.autenticarUsuario = passport.authenticate('local',{
    //successRedirect: '/ok',
    //failureRedirect: '/mal'
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true, //habilitar los msj flash
    badRequestMessage: 'Ambos campos son obligatorio' //validacion de passport, sino sale en ingles por defecto
})