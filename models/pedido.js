const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pedidoSchema = new Schema({
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

// Crear el modelo
const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;