const mongoose = require("mongoose");
const Usuarios = mongoose.model('Usuarios');


exports.formCrearCuenta = (req,res) => {
    res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta en DevJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}

exports.crearUsuarios = async (req,res) => {
    //Instaciar el usuario
    const usuario = new Usuarios(req.body);

    const nuevoUsuario = await usuario.save();

    if(!nuevoUsuario) return next();

    res.redirect('/iniciar-sesion');


}