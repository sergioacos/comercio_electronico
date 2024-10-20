const express = require('express');
const bcrypt = require('bcryptjs'); // Para hashear contraseñas
const router = express.Router();


// Mostrar el formulario de login
router.get('/login', (req, res) => {
    res.render('usuarios/login');
});

router.get('/registro',async (req, res) => {
  res.render('usuarios/registro'); // Redirigimos al panel de usuario
})

router.post('/login',async (req, res) => {
    const { email, password } = req.body;
    // Simular autenticación
  if (email === 'admin@mail.com' && password === 'adminpass') { // Verificamos si son las credenciales del admin
    res.redirect('/admin'); // Redirigimos al panel de administración
  } else if (email === 'user@mail.com' && password === 'userpass') { // Verificamos si son las credenciales del usuario
    res.redirect('/productos'); // Redirigimos al panel de usuario
  } else {
    res.send('Credenciales incorrectas'); // Si las credenciales son incorrectas, enviamos un mensaje
  }
});

module.exports = router;