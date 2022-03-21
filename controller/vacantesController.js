const mongoose = require("mongoose");
const Vacante = mongoose.model('Vacante');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const shortid = require('shortid');


exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante',{
        nombrePagina: 'Nueva vacante',
        tagline: 'LLena el formulario y publica tu vacante',
        cerrarSesion:true,
        nombre: req.user.nombre,
        imagen : req.user.imagen,
    })
}

//Agregar vacante
exports.agregarVacante = async (req,res) =>{
    //Creamos la instancia 
    const vacante = new Vacante(req.body);

    //Usuario autor de la vacante
    vacante.autor = req.user._id;

    //Crear arreglo de skills
    vacante.skills = req.body.skills.split(','); //split crea el arreglo, separa cada elemento por el caracter ','

    //almacenamos en bd
    const nuevaVacante = await vacante.save();

    //redireccion
    res.redirect(`/`);

}

//Mostrar vacante por url, no id, entonces utilizamos findOne
exports.mostrarVacante = async (req, res, next)=>{
    const vacante = await Vacante.findOne({url: req.params.url}).lean().populate('autor');
    
    
    
    //si no hay resultado
    if(!vacante) return next();

    //Retorno
    res.render('vacante',{
        vacante,
        nombrePagina : vacante.titulo,
        barra:true
    });
}

//Form editar vacante
exports.formEditarVacante = async (req, res, next) =>{
    const vacante = await Vacante.findOne({url: req.params.url}).lean();

    //si no hay resultado
    if(!vacante) return next();

    //Retorno
    res.render('editar-vacante',{
        vacante,
        nombrePagina : `Editar - ${vacante.titulo}`,
        cerrarSesion:true,
        nombre: req.user.nombre,
        imagen : req.user.imagen,

    });
}

//editar vacante
exports.editarVacante = async ( req , res ) => {
    const vacanteActualizada = req.body;

    vacanteActualizada.skills = req.body.skills.split(',');

    const vacante = await Vacante.findOneAndUpdate({url: req.params.url},
                    vacanteActualizada, {
                        new:true, //trae el nuevo registro actualizado
                        runValidators:true
                    });
    
    res.redirect(`/vacantes/${vacante.url}`);
}

exports.validarVacante = async (req, res, next) => {
    const rules = [
        body("titulo")
            .not()
            .isEmpty()
            .withMessage("Agrega un titulo a la Vacante")
            .escape(),
        body("empresa")
            .not()
            .isEmpty()
            .withMessage("Agrega una empresa")
            .escape(),
        body("ubicacion")
            .not()
            .isEmpty()
            .withMessage("Agrega una ubicación")
            .escape(),
        body("contrato")
            .not()
            .isEmpty()
            .withMessage("Selecciona un tipo de contrato")
             .escape(),
        body("skills")
            .not()
            .isEmpty()
            .withMessage("Agrega las skills para la vacante")
            .escape(),
      ];

      await Promise.all(rules.map((validation) => validation.run(req)));
      const errors = validationResult(req);
  
 
  if (errors) {
    // Recargar pagina con errores
    req.flash(
      "error",
      errors.array().map((error) => error.msg)
    );

    res.render("nueva-vacante", {
      nombrePagina: "Nueva Vacante",
      tagline: "Llena el formulario y publica tu vacante",
      cerrarSesion: true,
      nombre: req.user.nombre,
      mensajes: req.flash()
    });
    return;
  }
  next();
};


exports.eliminarVacante = async (req,res) => {
    const {id} = req.params;

    const vacante = await Vacante.findById(id);

    //revisamos que el autor sea el mismo que esta logeado
    if(verificarAutor(vacante, req.user)){
        // es el usuario
        vacante.remove();
        res.status(200).send('Vacante eliminada exitosamente.');
    } else {
        //no es el usuario
        res.status(403).send('Error.');
    }


    //console.log(id);

    

}

const verificarAutor = ( vacante = {}, usuario = {} ) => {
    if(!vacante.autor.equals(usuario._id)){
        return false;
    }

    return true;
}


exports.subirCv = (req,res,next) => {

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

            res.redirect('back'); //back, retorna al a misma pagina
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
            cb(null,__dirname+'../../public/upload/cv') //primer parametro el error, se pone null
        },
        filename: (req, file, cb) =>{
            //console.log(file)
            const extension = file.mimetype.split('/')[1];
            cb(null,`${shortid.generate()}.${extension}`);
        }
    }),
    fileFilter(req,file,cb){
        if(file.mimetype === 'application/pdf' ){
            //el callback se ejecuta como true o false: true cuando la imagen se acepta
            cb(null,true);
        } else {
            // si es otro tipo de archivo
            cb(new Error('Formato no valido'),false);
        }
    }
    

}

const upload = multer(configuracionMulter).single('cv');// aca pasamos el finput file al metodo single 


//almacena los candidatos en al bd
exports.contactar = async (req, res,next) =>{

    //console.log(req.params.url)
    const vacante = await Vacante.findOne({url: req.params.url}).lean();

    if(!vacante) return next();

    const nuevoCandidato = {
        nombre: req.body.nombre,
        email:req.body.email,
        cv:req.file.filename //este lo geners multer
    }

    //alacenamos en bd
    vacante.candidatos.push(nuevoCandidato);
    await vacante.save();

    //redireccion
    req.flash('correcto','Se envio tu cv correctamente.');
    res.redirect('/');

}


exports.mostrarCandidatos = async (req,res,next) =>{
    //console.log(req.params.id)

    const vacante = await Vacante.findById(req.params.id).lean();

    if(!vacante){
        return next();
    }

    if(vacante.autor != req.user._id.toString()){
        return next();
    } 

    res.render('candidatos',{
        nombrePagina: `Candidatos vacante - ${vacante.titulo}`,
        cerrarSesion:true,
        nombre: req.user.imagen,
        nombre: req.user.nombre,
        candidatos: vacante.candidatos
    })

    
}

exports.buscarVacantes = async (req,res) =>{

    console.log(req.body.q)

    const vacantes = await Vacante.find({
        $text: {
            $search: req.body.q
        }
    });

    console.log(vacantes)

    

    //Mostrar vacantes
    res.render('home',{
        nombrePagina: `Resultados para la busquda ${req.body.q}`,
        barra:true,
        vacantes
    })

}

exports.descargarPdf = (req,res) =>{
    
}
