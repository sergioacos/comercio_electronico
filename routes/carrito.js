const express = require('express');
const router = express.Router();
const { leerProductos} = require('../data/db');

// Añadir un producto al carrito
router.post('/:id/agregar-carrito', async (req, res) => {
    const { id } = req.params;
    const productos = await leerProductos();
    const producto = productos.find(p => p.id === parseInt(id));

    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }

    // Agregar el producto al carrito
    agregarProductoAlCarrito(producto);

    res.redirect('/carrito');  // Redirigir a la vista del carrito o a donde prefieras
});

// Mostrar el carrito
router.get('/carrito', (req, res) => {
    const carrito = obtenerCarrito();
    res.render('carrito/carrito', { carrito });
});

module.exports = router;