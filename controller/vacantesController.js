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
    res.redirect(`/vacante/${nuevaVacante.url}`);

}