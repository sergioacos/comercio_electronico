const express = require('express');
//const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Rutas
const productoRoutes = require('./routes/productos');
const usuarioRoutes = require('./routes/usuarios');
const carritoRoutes = require('./routes/carrito')
app.use('/productos', productoRoutes);
app.use('/carrito', carritoRoutes)
app.use('/', usuarioRoutes)

// Página principal
app.get('/', (req, res) => {
    res.render('index', { titulo: 'Comercio Electrónico' });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});