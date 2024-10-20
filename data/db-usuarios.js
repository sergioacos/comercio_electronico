const fs = require('fs-extra');
const path = require('path');

// Ruta del archivo JSON de usuarios
const filePath = path.join(__dirname, 'usuarios.json');

// Leer usuarios desde el archivo JSON
async function leerUsuarios() {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al leer el archivo:', error);
        return [];
    }
}


// Guardar usuarios en el archivo JSON
async function guardarUsuarios(usuarios) {
    try {
        await fs.writeFile(filePath, JSON.stringify(usuarios, null, 0), 'utf-8');
    } catch (error) {
        console.error('Error al guardar en el archivo:', error);
    }
}

module.exports = {
    leerUsuarios,
    guardarUsuarios
};