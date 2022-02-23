const mongoose = require("mongoose");
const Vacante = mongoose.model('Vacante');


exports.formularioNuevaVacante = (req, res) => {
    res.render('nueva-vacante',{
        nombrePagina: 'Nueva vacante',
        tagline: 'LLena el formulario y publica tu vacante'
    })
}

//Agregar vacante
exports.agregarVacante = async (req,res) =>{
    //Creamos la instancia 
    const vacante = new Vacante(req.body);

    //Crear arreglo de skills
    vacante.skills = req.body.skills.split(','); //split crea el arreglo, separa cada elemento por el caracter ','

    //almacenamos en bd
    const nuevaVacante = await vacante.save();

    //redireccion
    res.redirect(`/vacantes/`);

}

//Mostrar vacante por url, no id, entonces utilizamos findOne
exports.mostrarVacante = async (req, res, next)=>{
    const vacante = await Vacante.findOne({url: req.params.url}).lean();
    
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
        nombrePagina : `Editar - ${vacante.titulo}`

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