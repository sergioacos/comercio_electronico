const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  user:  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fecha:  Date,
  producto:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto'
    }
  ]
});
pedidoSchema.set('toJSON', {
  transform: (document, returnedObject) => {
  returnedObject.id = returnedObject._id.toString();
  delete returnedObject._id;
  delete returnedObject.__v;
  delete returnedObject.passwordHash;
  }
 });

// Crear el modelo
const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;