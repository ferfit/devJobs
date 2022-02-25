const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');

exports.autenticarUsuario = passport.authenticate('local',{
    //successRedirect: '/ok',
    //failureRedirect: '/mal'
    successRedirect: '/administracion',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true, //habilitar los msj flash
    badRequestMessage: 'Ambos campos son obligatorio' //validacion de passport, sino sale en ingles por defecto
})

//revisar si el usuario esta autenticado
exports.verificarUsuario = (req, res,next) =>{
    if(req.isAuthenticated()){ //metodo de passport que verifica si esta utenticado el usuario
        return next(); //esta, pasa al middleware siguiente
    }

    res.redirect('/iniciar-sesion');
}

exports.mostrarPanel = async (req,res) =>{
    //consultar el usuario autenticado
    const vacantes = await Vacante.find({autor: req.user._id}).lean();

    res.render('administracion',{
        nombrePagina: 'Panel de administración',
        tagline: 'Crea y administra tus vacantes desde aqui',
        cerrarSesion:true,
        nombre : req.user.nombre,
        vacantes

    })
}

exports.cerrarSesion = (req,res)=>{
    req.logout();

    req.flash('correcto','Cerraste tu sesion con exito');
    return res.redirect('/iniciar-sesion');
}