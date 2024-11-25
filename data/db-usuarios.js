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
        console.error('Error al leer el archivo del usuario:', error);
        return []; // Retornar un array vacío si hay un error
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

// Agregar un nuevo usuario
async function agregarUsuario(usuario) {
    try {
        let usuarios = await leerUsuarios();
        usuarios.push(usuario); // Agregar el nuevo usuario al array
        await guardarUsuarios(usuarios);
    } catch (error) {
        console.error('Error al agregar el usuario:', error);
    }
}

// Editar un usuario existente
async function editarUsuario(id, nuevoUsuario) {
    try {
        let usuarios = await leerUsuarios();
        let index = usuarios.findIndex(usuario => usuario.id === id);

        if (index !== -1) {
            usuarios[index] = { ...usuarios[index], ...nuevoUsuario }; // Actualizar los datos del usuario
            await guardarUsuarios(usuarios);
        } else {
            console.error('Usuario no encontrado');
        }
    } catch (error) {
        console.error('Error al editar el usuario:', error);
    }
}

// Eliminar un usuario
async function eliminarUsuario(id) {
    try {
        let usuarios = await leerUsuarios();
        usuarios = usuarios.filter(usuario => usuario.id !== id); // Filtrar el usuario por id
        await guardarUsuarios(usuarios);
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
    }
}

module.exports = {
    leerUsuarios,
    guardarUsuarios,
    agregarUsuario,
    editarUsuario,
    eliminarUsuario
};
