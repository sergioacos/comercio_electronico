const express = require('express');
const router = express.Router();
const { leerProductos, guardarProductos } = require('../data/db');

// Mostrar todos los productos
router.get('/', async (req, res) => {
    const productos = await leerProductos();
    res.render('productos/usuario', { productos });
});

// Mostrar formulario para crear un nuevo producto
router.get('/nuevo', (req, res) => {
    res.render('productos/nuevo');
});
// Mostrar productos al usuario
router.get('/admin', async (req, res) => {
    const productos = await leerProductos();
    res.render('productos/index', { productos });
});


// Añadir un nuevo producto 
router.post('/nuevo', async (req, res) => {
    const { nombre, precio, categoria, descripcion, stock } = req.body;
    let productos = await leerProductos();
    
    // Crear nuevo producto con un ID único
    const nuevoProducto = {
        id: productos.length > 0 ? productos[productos.length - 1].id + 1 : 1,
        nombre,
        precio,
        categoria,
        descripcion,
        stock
    };
    
    productos.push(nuevoProducto);
    await guardarProductos(productos);

    res.redirect('/productos');
});

// Eliminar un producto
router.post('/:id/eliminar', async (req, res) => {
    const { id } = req.params;
    let productos = await leerProductos();
    
    // Filtrar el producto que será eliminado
    productos = productos.filter(producto => producto.id !== parseInt(id));
    
    await guardarProductos(productos);
    res.redirect('/productos');
});

// Mostrar formulario de edición de un producto
router.get('/:id/editar', async (req, res) => {
    const { id } = req.params;
    const productos = await leerProductos();
    const producto = productos.find(p => p.id === parseInt(id));

    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }

    // Renderizar la vista de editar con los datos del producto
    res.render('productos/editar', { producto });
});

// Actualizar un producto existente
router.post('/:id/editar', async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, categoria, descripcion, stock } = req.body;
    
    let productos = await leerProductos();
    const productoIndex = productos.findIndex(producto => producto.id === parseInt(id));
    
    if (productoIndex !== -1) {
        productos[productoIndex] = {
            id: parseInt(id),
            nombre,
            precio,
            categoria,
            descripcion,
            stock
        };
        await guardarProductos(productos);
    }
   

    res.redirect('/productos');
});

module.exports = router;