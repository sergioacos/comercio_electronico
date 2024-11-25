const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productoSchema = new Schema({
  nombre:  String,
  precio:  Number,
  categoria: String,
  descripcion: String,
  stock: Number
 
}, {
  toObject: {
      transform: function(doc, ret) {
          // Renombrar _id a id
          ret.id = ret._id;
          delete ret._id; // Eliminar la propiedad _id si no la necesitas
          delete ret.__v; // Eliminar la versión del documento si no la necesitas
          return ret;
      }
  },
  toJSON: {
      transform: function(doc, ret) {
          // Renombrar _id a id
          ret.id = ret._id;
          delete ret._id; // Eliminar la propiedad _id si no la necesitas
          delete ret.__v; // Eliminar la versión del documento si no la necesitas
          return ret;
      }
  }
});

// Crear el modelo
const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;