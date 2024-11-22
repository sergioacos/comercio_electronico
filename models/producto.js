const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  nombre:  String,
  precio:  Number,
  categoria: String,
  descripcion: String,
  stock: Number
 
});

// Crear el modelo
const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;