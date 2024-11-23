const express = require('express');
const router = express.Router();
const { leerProductos, guardarProductos,eliminarProducto, editarProducto,buscarProducto } = require('../data/db');
const Producto = require('../models/producto');

// Mostrar todos los productos
router.get('/', async (req, res) => {
    const { categoria } = req.query; // Obtener la categoría del query string
   let productos = await leerProductos();
 

    // Filtrar por categoría si se seleccionó una
    if (categoria) {
        productos = productos.filter(producto => producto.categoria === categoria);
    }

    // Filtrar por categoría si se seleccionó una
    if (categoria) {
        productos = productos.filter(producto => producto.categoria === categoria);
    }

    res.render('productos/usuario', { productos, categoria }); 
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
    //const { nombre, precio, categoria, descripcion, stock } = req.body;
    const productos= req.body;
  
    await guardarProductos(productos);

    res.redirect('/productos');
});

// Eliminar un producto
router.delete('/:id/eliminar', async (req, res) => {
    const { id } = req.params;
   /*let productos = await leerProductos();
    
    // Filtrar el producto que será eliminado
    productos = productos.filter(producto => producto.id !== parseInt(id));
    
    await guardarProductos(productos);*/
    await eliminarProducto(id)
    //res.redirect('/productos/admin');
    return res.status(200).json({ message: 'Producto eliminado correctamente.' })
});

// Mostrar formulario de edición de un producto
router.get('/:id/editar', async (req, res) => {
    const { id } = req.params;
   const producto = await buscarProducto(id);
/*
   // const productos = await leerProductos();
    const producto = productos.find(p => p.id === parseInt(id));

    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }
*/

    // Renderizar la vista de editar con los datos del producto
    res.render('productos/editar', { producto });
});

// Actualizar un producto existente
/*router.patch('/:id/editar', async (req, res) => {
    const { id } = req.params;
    const body  = req.body;
    console.log(id)
    console.log('body', body);

    editarProducto(id, body)
    /*
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
   

    //res.redirect('/productos');
    return res.status(200).json({ message: 'Producto actualizado correctamente.' });
});*/

router.patch('/:id/editar', async (req, res) => {
    const { id } = req.params;  // Corrección: Obtener correctamente el `id` de `req.params`
    const body = req.body;  
    console.log(body)     // Cuerpo de la solicitud con los datos actualizados
  
    try {
      // Llamar a la función para editar el producto
      const productoActualizado = await editarProducto(id, body);
  
      if (productoActualizado) {
        // Si se actualizó correctamente, responder con un mensaje de éxito
        return res.status(200).json({ message: 'Producto actualizado correctamente.' });
      } else {
        // Si no se encuentra el producto, devolver un error 404
        return res.status(404).json({ message: 'Producto no encontrado.' });
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      // Responder con un mensaje de error en caso de fallo
      return res.status(500).json({ message: 'Error al actualizar el producto.' });
    }
  });
// Mostrar todos los productos con opción de filtrar por categoría
router.get('/', async (req, res) => {
    const productos = await leerProductos();
    const { categoria } = req.query; // Obtener la categoría del query

    // Filtrar productos si se especifica una categoría
    const productosFiltrados = categoria ? 
        productos.filter(producto => producto.categoria === categoria) : 
        productos;

    res.render('productos/usuario', { productos: productosFiltrados });
});

module.exports = router;