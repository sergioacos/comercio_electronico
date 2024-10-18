const express = require('express');
const bcrypt = require('bcryptjs'); // Para hashear contraseñas
const router = express.Router();
//const { leerUsuarios } = require('../data/db-usuarios'); // Simula un archivo JSON para usuarios

// Mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('usuarios/login');
});

// Procesar inicio de sesión
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;
//     const usuarios = await leerUsuarios();

//     // Buscar el usuario por email
//     const usuario = usuarios.find(u => u.email === email);
//     if (!usuario) {
//         return res.status(400).send('Usuario no encontrado');
//     }

//     // Verificar la contraseña
//     const passwordValida = await bcrypt.compare(password, usuario.password);
//     if (!passwordValida) {
//         return res.status(400).send('Contraseña incorrecta');
//     }

    
//     res.redirect('/');
// });

router.post('/login',async (req, res) => {
    const { email, password } = req.body;
    // Simular autenticación
  if (email === 'admin@mail.com' && password === 'adminpass') { // Verificamos si son las credenciales del admin
    res.redirect('/productos/admin'); // Redirigimos al panel de administración
  } else if (email === 'user@mail.com' && password === 'userpass') { // Verificamos si son las credenciales del usuario
    res.redirect('/productos'); // Redirigimos al panel de usuario
  } else {
    res.send('Credenciales incorrectas'); // Si las credenciales son incorrectas, enviamos un mensaje
  }
})

module.exports = router;