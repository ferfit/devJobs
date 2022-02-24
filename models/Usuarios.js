const mongoose = require('mongoose');
mongoose.Promise = global.Promise; 
const bcrypt = require('bcrypt');

const usuariosSchema = new mongoose.Schema({
    email:{
        type: String,
        unique:true,
        lowercase:true,
        trim:true
    },
    nombre: {
        type:String,
        required: true

    },
    password:{
        type:String,
        required: true,
        trim: true
    },
    token: String, 
    expira: Date
})


//Metodo para hashear el password
usuariosSchema.pre('save',async function(next){
    //si el password ya esta hasheado
    if(!this.isModified('password')){
        return next();
    }

    //si no esta hasheado
    const hash = await bcrypt.hash(this.password,12);
    this.password = hash;
    next();
})

//envia alerta si el email ya esta registrado
usuariosSchema.post('save',function(error, doc, next){
    
    if(error.name === 'MongoServerError' && error.code === 11000){
        next('Ese correo ya esta registrado');
    } else {
        next(error); 
    }
})

//autentica usuario
usuariosSchema.methods = {
    compararPassword: function(password){
        return bcrypt.compareSync(password, this.password) //compara el pasword del form con el de la bd
    }
}

module.exports = mongoose.model('Usuarios',usuariosSchema);
