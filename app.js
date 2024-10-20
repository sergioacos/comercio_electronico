const express = require('express');
//const mongoose = require('mongoose');
const path = require('path');
//const { router: carritoRoutes, carrito } = require('./routes/carrito');
const {obtenerCarrito} = require('./data/db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar motor de plantillas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// Rutas
app.use((req, res, next) => {
    const carrito = obtenerCarrito();
    // Sumar todas las cantidades de los productos en el carrito
    const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    res.locals.totalCarrito = totalProductos; // Total de productos en el carrito
    console.log(`Total de productos en el carrito: ${res.locals.totalCarrito}`); // Para verificar
    next()
  });

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