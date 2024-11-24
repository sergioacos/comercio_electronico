/*const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
  nombre:  String,
  password:  String,
  rol: String,
  pedidos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'pedido'
    }
  ]
});
usuarioSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  }
});

// Crear el modelo
const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;*/

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Pedido = require('./pedido');  //https://chatgpt.com/c/6726b2dd-e450-8012-b5fd-b96017d5f4b9
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
userSchema.set('toJSON', {
 transform: (document, returnedObject) => {
 returnedObject.id = returnedObject._id.toString();
 delete returnedObject._id;
 delete returnedObject.__v;
 delete returnedObject.passwordHash;
 }
});
userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
module.exports = User;