const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
//const User = require('../models/User');

// Mostrar formulario de inicio de sesión
loginRouter.get('/', (req, res) => {
    res.render('login', { error: req.flash('error') });
  });


// Manejar inicio de sesión y devolver el JWT
loginRouter.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'Error interno del servidor', error: err });
    }
    if (!user) {
      return res.render('login', { error: 'Credenciales incorrectas. Intente nuevamente' });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return res.status(500).json({ message: 'Error al iniciar sesión', error: loginErr });
      }
      
      // Generar el JWT
      const token = jwt.sign(
        { id: user.id, username: user.username }, 
        process.env.SECRET, 
        { expiresIn: '1h' }
      );

      // Guardar el token en una cookie
      res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

      // Redirigir a la vista de productos
      //return res.redirect('/');

      // Redirigir a la vista de productos o al panel del admin
      if (user.username == "admin") {
        res.redirect('/admin');
      }
      else {
        return res.redirect('/');
      }
    });
  })(req, res, next);
});

  
  // Cerrar sesión
  // loginRouter.get('/logout', (req, res) => {
  //   req.logout((err) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     res.redirect('/login');
  //   });
  // });

  
  


module.exports = loginRouter;