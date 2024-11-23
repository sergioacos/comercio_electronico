const mongoose = require('mongoose');
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

module.exports = Usuario;