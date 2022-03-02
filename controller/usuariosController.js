const mongoose = require("mongoose");
const Usuarios = mongoose.model('Usuarios');
const { body, validationResult } = require('express-validator');
const multer = require("multer");
const shortid = require('shortid');


exports.formCrearCuenta = (req,res) => {
    res.render('crear-cuenta',{
        nombrePagina: 'Crea tu cuenta en DevJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}

exports.validarRegistro = async (req, res,next) => {

    const rules = [
        body('nombre').not().isEmpty().withMessage('El nombre es Obligatorio').escape(),
        body('email').isEmail().withMessage('El email debe ser valido').escape(),
        body('password').not().isEmpty().withMessage('El password no puede ir vacío').escape(),
        body('confirmar').not().isEmpty().withMessage('Confirmar password no puede ir vacío').escape(),
        body('confirmar').equals(req.body.password).withMessage('El password es diferente').escape()
    ];

    await Promise.all(rules.map( validation => validation.run(req)));

    const errores = validationResult(req);
 
    /* if(errores.isEmpty()){
        res.send('esta vacio');
    } else {
        res.send('tiene errores');
        console.log(errores.array())
    } */

    if(errores.isEmpty()){
        next();
    }

    req.flash('error', errores.array().map(error => error.msg));

    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
        mensajes: req.flash()
    });

    return;
}

exports.crearUsuarios = async (req,res) => {
    //Instaciar el usuario
    const usuario = new Usuarios(req.body);

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');

    } catch (error) {
        req.flash('error',error);
        res.redirect('/crear-cuenta');
    }

    /* const nuevoUsuario = await usuario.save();

    if(!nuevoUsuario) return next();

    res.redirect('/iniciar-sesion');
 */

}


exports.formIniciarSesion =  (req, res) => {
    res.render('iniciar-sesion',{
        nombrePagina:'Iniciar Sesión'   
    })
}

exports.formEditarPerfil = (req , res) => {
    res.render('editar-perfil',{
    nombrePagina: 'Edita tu perfil en DevJobs',
    usuario: req.user.toObject(),
    cerrarSesion:true,
    nombre: req.user.nombre,
    imagen: req.user.imagen
    })
}

exports.editarPerfil = async (req,res) => {

    const usuario = await Usuarios.findById(req.user._id);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password){
        usuario.password = req.body.password
    }

    if(req.file){
        usuario.imagen = req.file.filename;
    }


    req.flash('correcto','Cambios guardados correctamente.');
    await usuario.save();

    res.redirect('administracion');

}

exports.validarPerfil = async (req, res, next) => {
    const rules = [
        body("nombre")
        .not()
        .isEmpty()
        .withMessage("Agrega tu nombre")
        .escape(),
        body("email")
            .isEmail()
            .withMessage('Debe ingresar un email valido')
            .not()
            .isEmpty()
            .withMessage("Agrega tu email")
            .escape() 
      ];

      /* if(req.body.password){
          rules.push(body("password").escape());
      } */

      await Promise.all(rules.map((validation) => validation.run(req)))
      const errors = validationResult(req);
  
 
  if (errors) {
    // Recargar pagina con errores
    req.flash(
      "error",
      errors.array().map((error) => error.msg)
    );

    res.render("editar-perfil", {
      nombrePagina: "Editar perfil",
      tagline: "Edita tu perfil en DevJobs",
      usuario:req.user.toObject(),
      cerrarSesion: true,
      nombre: req.user.nombre,
      mensajes: req.flash()
    });
    return;
  }
  next();
};

exports.subirImagen = (req, res,next) => {
    upload(req,res, function(error){
        //console.log(error);
        if(error){
            if(error instanceof multer.MulterError){ //error de multer
                if(error.code === 'LIMIT_FILE_SIZE'){
                    req.flash('error','El archivo es muy grande: Maximo 100kb');
                } else {
                    req.flash('error',error.message);
                }
            
            } else { //error de expresss
                //console.log(error.message) 
                req.flash('error',error.message);
            }

            res.redirect('/administracion');
            return;

        } else {
            return next();
        }
        
    })

    next();
}

const configuracionMulter = {
    limits:{
        fileSize : 100000
    },
    storage: fileStorage = multer.diskStorage({ //
        destination: (req,file,cb) =>{
            cb(null,__dirname+'../../public/upload/perfiles') //primer parametro el error, se pone null
        },
        filename: (req, file, cb) =>{
            //console.log(file)
            const extension = file.mimetype.split('/')[1];
            cb(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ){
            //el callback se ejecuta como true o false: true cuando la imagen se acepta
            cb(null,true);
        } else {
            // si es otro tipo de archivo
            cb(new Error('Formato no valido'),false);
        }
    }
    

}

const upload = multer(configuracionMulter).single('imagen');// aca pasamos la imagen al metodo single 

