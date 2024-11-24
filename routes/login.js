const express = require('express');
const passport = require('passport');
//const jwt = require('jsonwebtoken');
//const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

// Mostrar formulario de inicio de sesión


loginRouter.get('/', (req, res) => {
    res.render('login', { error: req.flash('error') });
  });




//Manejar inicio de sesión
// loginRouter.post('/', passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login',
//     failureFlash: true // Requiere instalar connect-flash si deseas mensajes
//   }));

loginRouter.post('/', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ message: 'Error interno del servidor', error: err });
      }
      if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas', info });
      }
      // Iniciar sesión manualmente
      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ message: 'Error al iniciar sesión', error: loginErr });
        }
        // Devolver mensaje de éxito
        return res.status(200).json({ message: 'Inicio de sesión exitoso', user });
      });
    })(req, res, next);
  });
  
  // Cerrar sesión
  loginRouter.get('/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/login');
    });
  });


module.exports = loginRouter;