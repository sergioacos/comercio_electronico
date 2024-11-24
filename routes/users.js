const express = require('express');
const bcrypt = require('bcrypt');
const usersRouter = express.Router();
const User = require('../models/User');

usersRouter.get('/register', (req, res) => {
    res.render('register'); 
});

usersRouter.post('/register', async (req, res) => {
    const { username, name, password } = req.body;

    if (!username || !name || !password || password.length < 6) {
        return res.render('register', { error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.render('register', { error: 'El nombre de usuario ya está en uso. Intenta con otro.' });
        }

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
        res.render('register', { error: 'Error al registrar el usuario. Intenta de nuevo.' });
    }
});

module.exports = usersRouter;
