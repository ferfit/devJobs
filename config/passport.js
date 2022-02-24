const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');

passport.use(new LocalStrategy({
    //Definimos los campos con lo cuales se va a autenticar
    usernameField:'email',
    passwordField:'password'

    },async(email,password,done)=>{ //pasa los parametros email pass y done que seria como el next
        const usuario = await Usuarios.findOne({email});

        if(!usuario) return done(null,false,{ //1° mensaje de error, 2° usuaario, 3° opciones
            message: 'Usuario no existente'
        })

        //El usuario existe, vamos a verificar la pass
        const verificarPass = usuario.compararPassword(password);

        if(!verificarPass) return done(null,false,{
            message: ' Contraseña incorrecta.'
        })

        //Usuario existe
        return done(null, usuario);
    }));

passport.serializeUser((usuario,done)=> done(null,usuario._id));

passport.deserializeUser(async(id,done)=>{
    const usuario = await Usuarios.findById(id);
    return done(null, usuario);
})

module.exports = passport;





