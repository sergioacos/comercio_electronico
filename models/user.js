// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const usuarioSchema = new Schema({
//   nombre:  String,
//   password:  String,
//   rol: String,
//   pedidos: [
//     {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'pedido'
//     }
//   ]
// });
// usuarioSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//     delete returnedObject.password;
//   }
// });

// // Crear el modelo
// const Usuario = mongoose.model('Usuario', usuarioSchema);

// module.exports = Usuario;

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Pedido = require('./pedido');

// Definimos el esquema de usuario
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    name: String,
    passwordHash: String,
    pedidos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Pedido'
        }
    ]
});

// Definimos cómo se devolverán los datos del modelo al hacer `toJSON`
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    }
});

// Aplicamos el validador de unicidad en el campo 'username'
userSchema.plugin(uniqueValidator);

// Aseguramos que el modelo solo se cree una vez
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
