
const Producto = require('../models/producto');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database', {
  serverSelectionTimeoutMS: 30000 // 30 segundos
});

async function cargarProductos() {
    // Lista de productos a insertar
    const productos = [
      {
        nombre: 'Botines de Cuero',
        precio: 120,
        categoria: 'Calzado',
        descripcion: 'Botines elegantes de cuero genuino',
        stock: 10
      },
      {
        nombre: 'Camisa de Algodón',
        precio: 50,
        categoria: 'Ropa',
        descripcion: 'Camisa cómoda de algodón para el verano',
        stock: 20
      },
      {
        nombre: 'Pantalones Jeans',
        precio: 80,
        categoria: 'Ropa',
        descripcion: 'Pantalones jeans clásicos para uso diario',
        stock: 15
      },
      {
        nombre: 'Zapatos Deportivos',
        precio: 90,
        categoria: 'Calzado',
        descripcion: 'Zapatos deportivos cómodos para correr',
        stock: 25
      },
      {
        nombre: 'Cartera de Cuero',
        precio: 200,
        categoria: 'Accesorios',
        descripcion: 'Cartera de cuero genuino con diseño elegante',
        stock: 5
      }
    ];
  
    try {
      // Insertar productos en la base de datos
      await Producto.insertMany(productos);
      console.log('Productos cargados exitosamente a la base de datos');
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } 
  }
  async function main() {
   await cargarProductos();}
  main();