const mongoose = require("mongoose");
const Vacante = mongoose.model('Vacante');
const { body, validationResult } = require('express-validator');


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