const fs = require('fs-extra');
const path = require('path');

// Ruta del archivo JSON
const filePath = path.join(__dirname, 'productos.json');

// Leer productos desde el archivo JSON
async function leerProductos() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo:', error);
    return [];
  }
}

// Guardar productos en el archivo JSON
async function guardarProductos(productos) {
  try {
    await fs.writeFile(filePath, JSON.stringify(productos, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar en el archivo:', error);
  }
}

let carrito = [];

function agregarProductoAlCarrito(producto) {
    const existeEnCarrito = carrito.find(p => p.id === producto.id);
    
    if (existeEnCarrito) {
      console.log("Agrego un producto cant:cantidad + 1");
        // Si el producto ya está en el carrito, incrementar la cantidad
        existeEnCarrito.cantidad += 1;
    } else {
        // Si no está, agregar el producto al carrito con cantidad inicial 1
        carrito.push({ ...producto, cantidad: 1 });
        console.log("Agrego un producto cant:1");
    }
}

function obtenerCarrito() {
    return carrito;
}

module.exports = {
  leerProductos,
  guardarProductos,
  agregarProductoAlCarrito,
  obtenerCarrito
};