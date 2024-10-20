const express = require('express');
const router = express.Router();

// Verificar si el usuario es admin
function verificarAdmin(req, res, next) {
    const esAdmin = req.headers['admin']; 

    if (esAdmin) {
        next(); 
    } else {
        res.status(401).render('errores/401'); 
    }
}

// Ruta para análisis de ventas
router.get('/', verificarAdmin, (req, res) => {
    res.send('Bienvenido al análisis de ventas');
});

// Ruta para simular un error 500
router.get('/error', (req, res) => {
    throw new Error('Simulación de error 500'); 
});

module.exports = router;
