const express = require('express');
const bcrypt = require('bcryptjs'); // Para hashear contraseñas
const router = express.Router();
const { leerUsuarios } = require('../data/db-usuarios'); // Simula un archivo JSON para usuarios

// Mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('usuarios/login');
});

// Procesar inicio de sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usuarios = await leerUsuarios();

    // Buscar el usuario por email
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
        return res.status(400).send('Usuario no encontrado');
    }

    // Verificar la contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
        return res.status(400).send('Contraseña incorrecta');
    }

    // Aquí podrías guardar la sesión del usuario o generar un token JWT
    res.redirect('/');
});