const mongoose = require('mongoose');
mongoose.Promise = global.Promise; //definimos que las respuestas sean una promesa
const slug = require('slug');
const shortid = require('shortid');

const vacantesSchema = new mongoose.Schema({
    titulo:{
        type:String,
        required: 'El nombr de vacantes es obligatorio',
        trim: true //quita espacio al inicio y final
    },
    empresa:{
        type:String,
        trim:true
    },
    ubicacion:{
        type:String,
        trim:true,
        required:'La ubicación es obligatoria'
    },
    salario:{
        type:String,
        default:0,
        trim:true
    },
    contrato:{
        type:String,
        trim:true
    },
    descripcion: {
        type:String,
        trim:true
    },
    url:{
        type:String,
        lowercase:true
    },
    skills:[String], //lo ponemos entre corchetes para especificar que sera un arreglo
    candidatos:[{ //sera un arreglo con objetos adentro
        nombre: String,
        email:String,
        cv:String
    }]
})


//creamos un middeleware antes de que s guarde un registro
vacantesSchema.pre('save',function(next){
    //Crear la url
    const url = slug(this.titulo);
    this.url = `${url}-${shortid.generate()}`;

    next();
})

module.exports = mongoose.model('Vacante',vacantesSchema);