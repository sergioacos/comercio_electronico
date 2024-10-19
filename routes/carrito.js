const express = require('express');
const router = express.Router();
const { leerProductos, obtenerCarrito, agregarProductoAlCarrito, guardarPedido, leerUsuario} = require('../data/db');

// Añadir un producto al carrito
router.post('/productos/:id/agregar-carrito', async (req, res) => {
    const { id } = req.params;
    const productos = await leerProductos();
    const producto = productos.find(p => p.id === parseInt(id));

    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }

    // Agregar el producto al carrito
    agregarProductoAlCarrito(producto);

    res.redirect('/productos');  // Redirigir a la vista del carrito o a donde prefieras
});
//const carrito=[];
// Mostrar el carrito
router.get('/', (req, res) => {
    const carrito = obtenerCarrito();
    res.render('carrito/carritoActual', { carrito });
});

// Finalizar el pedido y guardarlo para el único usuario
router.post('/finalizar-pedido', async (req, res) => {
    const carrito = obtenerCarrito();

    if (!carrito.length) {
        return res.status(400).send('El carrito está vacío.');
    }

    // Guardar el pedido del usuario único
    await guardarPedido(carrito);

    // Limpiar el carrito después de finalizar el pedido
    carrito.length = 0; // Esto vacía el carrito

    res.redirect('/carrito');
});

// Mostrar los pedidos del usuario
router.get('/pedidos', async (req, res) => {
    const usuario = await leerUsuario();

    if (!usuario.pedidos.length) {
        return res.render('pedidos/pedidos', { pedidos: [], mensaje: "No hay pedidos realizados." });
    }

    res.render('pedidos/pedidos', { pedidos: usuario.pedidos });
});

//module.exports ={router,carrito} ;
module.exports =router ;