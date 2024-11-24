// const express = require('express');
// const bcrypt = require('bcryptjs'); // Para hashear contraseñas
// const router = express.Router();


// // Mostrar el formulario de login
// router.get('/login', (req, res) => {
//     res.render('usuarios/login');
// });

// router.get('/registro',async (req, res) => {
//   res.render('usuarios/registro'); // Redirigimos al panel de usuario
// })

// router.post('/login',async (req, res) => {
//     const { email, password } = req.body;
//     // Simular autenticación
//   if (email === 'admin@mail.com' && password === 'adminpass') { // Verificamos si son las credenciales del admin
//     res.redirect('/admin'); // Redirigimos al panel de administración
//   } else if (email === 'user@mail.com' && password === 'userpass') { // Verificamos si son las credenciales del usuario
//     res.redirect('/productos'); // Redirigimos al panel de usuario
//   } else {
//     res.send('Credenciales incorrectas'); // Si las credenciales son incorrectas, enviamos un mensaje
//   }
// });

// module.exports = router;

const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

// usersRouter.post('/', async (request, response) => {
//  const body = request.body;
//  const saltRounds = 10;
//  const passwordHash = await bcrypt.hash(body.password, saltRounds);
//  const user = new User({
//  username: body.username,
//  name: body.name,
//  passwordHash
//  });
//  const savedUser = await user.save();
//  response.json(savedUser);
// });

usersRouter.post('/register', async (req, res) => {
    const { username, name, password } = req.body;

    if (!username || !name || !password || password.length < 6) {
        req.flash('error', 'Todos los campos son obligatorios y la contraseña debe tener al menos 6 caracteres.');
        return res.redirect('/register');
    }

    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const user = new User({
            username,
            name,
            passwordHash
        });

        const savedUser = await user.save();
        console.log("Usuario registrado:", savedUser);

        res.redirect('/login');
    } catch (error) {
        console.error("Error al registrar usuario:", error.message);
        req.flash('error', 'Error al registrar usuario. Intenta con otro nombre de usuario.');
        res.redirect('/register');
    }
});


usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('pedidos');
    response.json(users);
   });

   usersRouter.get('/register', (req, res) => {
    res.render('register');
});


module.exports = usersRouter;