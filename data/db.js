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

module.exports = {
  leerProductos,
  guardarProductos
};