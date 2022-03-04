const passport = require('passport');
const mongoose = require('mongoose');
const { crearUsuarios } = require('./usuariosController');
const Vacante = mongoose.model('Vacante');
const Usuarios = mongoose.model('Usuarios');
const crypto = require('crypto');
//const enviarEmail = require('../handlers/email');

const emailConfig = require('../config/email'); 
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
//const util = require('util');

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
        imagen : req.user.imagen,
        vacantes

    })
}

exports.cerrarSesion = (req,res)=>{
    req.logout();

    req.flash('correcto','Cerraste tu sesion con exito');
    return res.redirect('/iniciar-sesion');
}


exports.formReestablecerPassword = (req,res)=>{
    
    res.render('reestablecer-password',{
        nombrePagina: 'Reestablece tu contraseña',
        tagline : 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
    })
}

//Genera el token en la tabla del usuario
exports.enviarToken = async (req, res) => {

    const usuario = await Usuarios.findOne({email:req.body.email});

    if(!usuario){
        req.flash('error','No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    //Genera token - usamos crypto que viene en node yexpress
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now()+3600000;

    //guardamos
    await usuario.save();

    //arma la url
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`; //console.log(resetUrl);




    //envia email
    /* await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo:'reset'
    }) */





    let transport = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        auth:{
            user: emailConfig.user,
            pass: emailConfig.pass
        }
    });

    transport.use('compile', hbs({
        viewEngine: {
          extName: 'handlebars',
          partialsDir: __dirname + '/../views/layouts',
          layoutsDir: __dirname + '/../views/layouts',
          defaultLayout  : 'layout',
        },
        viewPath: __dirname + '/../views/emails',
        extName: '.handlebars'
      }));

    //send mail with options
    var mail = {
    from: 'devJobs <noreply@devjobs.com',
    to:  usuario.email,
    subject: 'Reestablecer contraseña',
    template: 'reset',
    context: {
        resetUrl
    }

    }
    transport.sendMail(mail);

    //redireccion
    req.flash('correcto','Revisa tu email para reestablecer la contraseña');
    res.redirect('/iniciar-sesion');

    }


    //Valida si el token es valido y el usuario existe mustra vista
    exports.reestablecerPassword = async (req,res) =>{

        
        const usuario = await Usuarios.findOne({
            token: req.params.token,
            expira:{
                $gt:Date.now() 
            } 
        })

        if(!usuario){
            req.flash('error','El formulario ya no es valido, intentalo den nuevo');
            return res.redirect('/reestablecer-password');
        }

        
        //si el token es valido y no expiro
        res.render('nuevo-password',{
            nombrePagina: 'Nueva password'
        })
    }


    exports.guardarPassword = async (req,res) =>{

        const usuario = await Usuarios.findOne({
            token: req.params.token,
            expira:{
                $gt:Date.now() 
            } 
        })

        
        if(!usuario){
            req.flash('error','El formulario ya no es valido, intentalo den nuevo');
            return res.redirect('/reestablecer-password');
        }
        
        //Si esta todo ok
        usuario.password = req.body.password;
        usuario.token = undefined;
        usuario.expira = undefined;
        await usuario.save();

        //redirige
        req.flash('correcto','Password modificada correctamente');
        res.redirect('/iniciar-sesion');
    }
