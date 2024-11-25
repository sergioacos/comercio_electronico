const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { leerProductos, obtenerCarrito, agregarProductoAlCarrito, guardarPedido, guardarProductos,buscarProducto} = require('../data/db');
const { leerUsuarios, guardarUsuarios} = require('../data/db-usuarios');
const User = require('../models/user');

// const getTokenFrom = (request) => {
//     const authorization = request.get('authorization');
//     if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
//     return authorization.substring(7);
//     }
//     return null;
//    };

const getTokenFrom = (request) => {
    // Si estás usando cookies
    if (request.cookies && request.cookies.jwt) {
      return request.cookies.jwt;
    }
    
    // Si todavía usas el header de autorización como fallback
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      return authorization.substring(7);
    }
    
    return null; // Si no hay token
  };

// Añadir un producto al carrito
router.post('/productos/:id/agregar-carrito', async (req, res) => {
    const { id } = req.params;
    //const productos = await leerProductos();
    //const producto = productos.find(p => p.id === id);
    console.log('Authorization header:', req.headers.authorization);
    const producto= await buscarProducto(id);
    console.log(`hola ${producto.nombre}`);
    if (!producto) {
        return res.status(404).send('Producto no encontrado');
    }

    // Agregar el producto al carrito
    agregarProductoAlCarrito(producto);

    res.redirect('/productos');  // Redirigir a la vista del carrito
});
//const carrito=[];
// Mostrar el carrito
router.get('/', (req, res) => {
    const carrito = obtenerCarrito();
    res.render('carrito/carritoActual', { carrito});
});

// Finalizar el pedido y guardarlo para el único usuario
// router.post('/finalizar-pedido', async (req, res) => {
//     const id = '67439a8b85b214f9e31410d2'; 
//     const carrito = obtenerCarrito();
//    // const {id}=req.params;
//     if (!carrito.length) {
//         return res.status(400).send('El carrito está vacío.');
//     }

//     // Guardar el pedido del usuario único
//     await guardarPedido(carrito, id);  
//     const productos = await leerProductos();
//     carrito.forEach((productoSeleccionado) => {
//         const producto = productos.find(p => p.id.toString() === productoSeleccionado.id.toString() );
        
//         if (!producto) {
//             return res.status(404).send(`Producto con ID ${productoSeleccionado.id} no encontrado.`);
//         }

//         // Verificar que haya suficiente stock
//         if (producto.stock < 1) {
//             return res.status(400).send(`Stock insuficiente para ${producto.nombre}.`);
//         }

//         // Restar uno del stock
//         producto.stock -= productoSeleccionado.cantidad;
        
//     });
//     //await guardarProductos(productos);
//     // Limpiar el carrito después de finalizar el pedido
//     carrito.length = 0; // Esto vacía el carrito

//     res.redirect('/productos');
// });

// router.post(
//  '/finalizar-pedido',
//     passport.authenticate('jwt', { session: false }), // Middleware de autenticación
//     async (req, res) => {
//         console.log('Authorization header:', req.headers.authorization);
//         res.status(200).send('Encabezado recibido.');
//       try {
//         const user = req.user; // Usuario autenticado
//         const carrito = obtenerCarrito(); // Obtén el carrito (suponiendo que es una función)
  
//         if (!carrito.length) {
//           return res.status(400).send('El carrito está vacío.');
//         }
  
//         // Guardar el pedido del usuario autenticado
//         await guardarPedido(carrito, user._id);  
  
//         const productos = await leerProductos();
  
//         // Actualizar el stock de los productos seleccionados
//         carrito.forEach((productoSeleccionado) => {
//           const producto = productos.find(p => p.id.toString() === productoSeleccionado.id.toString());
  
//           if (!producto) {
//             throw new Error(`Producto con ID ${productoSeleccionado.id} no encontrado.`);
//           }
  
//           // Verificar que haya suficiente stock
//           if (producto.stock < productoSeleccionado.cantidad) {
//             throw new Error(`Stock insuficiente para ${producto.nombre}.`);
//           }
  
//           // Restar la cantidad seleccionada del stock
//           producto.stock -= productoSeleccionado.cantidad;
//         });
  
//         // Guardar los cambios en los productos (asegúrate de implementar `guardarProductos`)
//         await guardarProductos(productos);
  
//         // Limpiar el carrito después de finalizar el pedido
//         carrito.length = 0; // Vacía el carrito
  
//         res.redirect('/productos');
//       } catch (error) {
//         console.error('Error al finalizar el pedido:', error);
//         res.status(500).json({ error: error.message });
//       }
//     }
//   );

  router.post('/finalizar-pedido', async (request, response) => {
    const body = request.body;
    const token = getTokenFrom(request); // Obtén el token de la solicitud
   
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' });
    }
   try{
   //  const user = await User.findById(body.userId);
    const user = await User.findById(decodedToken.id);

    const carrito = obtenerCarrito(); // Obtén el carrito (suponiendo que es una función)
  
        if (!carrito.length) {
          return res.status(400).send('El carrito está vacío.');
        }
  
        // Guardar el pedido del usuario autenticado
        await guardarPedido(carrito, user._id);  
  
        const productos = await leerProductos();
  
        // Actualizar el stock de los productos seleccionados
        carrito.forEach((productoSeleccionado) => {
          const producto = productos.find(p => p.id.toString() === productoSeleccionado.id.toString());
  
          if (!producto) {
            throw new Error(`Producto con ID ${productoSeleccionado.id} no encontrado.`);
          }
  
          // Verificar que haya suficiente stock
          if (producto.stock < productoSeleccionado.cantidad) {
            throw new Error(`Stock insuficiente para ${producto.nombre}.`);
          }
  
          // Restar la cantidad seleccionada del stock
          producto.stock -= productoSeleccionado.cantidad;
        });
  
        // Guardar los cambios en los productos (asegúrate de implementar `guardarProductos`)
        await guardarProductos(productos);
  
        // Limpiar el carrito después de finalizar el pedido
        carrito.length = 0; // Vacía el carrito
   
    
    // const savedPost = await post.save();
    // user.posts = user.posts.concat(savedPost._id);
    // await user.save();
    // response.status(201).json(savedPost);
        response.redirect('/productos');
      } catch (error) {
        console.error('Error al finalizar el pedido:', error);
        response.status(500).json({ error: error.message });
      }
   });

// Mostrar los pedidos del usuario
/*router.get('/pedidos', async (req, res) => {
    const usuario = await leerUsuarios();

    if (!usuario.pedidos.length) {
        return res.render('pedidos/pedidos', { pedidos: [], mensaje: "No hay pedidos realizados." });
    }

    res.render('pedidos/pedidos', { pedidos: usuario.pedidos });
});*/router.get('/pedidos', async (req, res) => {
    try {
        // Obtener todos los usuarios con sus pedidos asociados, incluyendo los productos de cada pedido
        const users = await User.find({})
            .populate({
                path: 'pedidos',
                populate: [
                    {
                        path: 'producto', // Poblamos los productos dentro del pedido
                        model: 'Producto'
                    },
                    {
                        path: 'user', // Poblamos la información del usuario
                        model: 'User'
                    }
                ]
            });

        // Verificar si hay usuarios en la base de datos
        if (users.length === 0) {
            return res.render('pedidos/pedidos', { pedidos: [], mensaje: "No hay pedidos realizados." });
        }

        // Extraer todos los pedidos de todos los usuarios
        const allPedidos = users.reduce((acc, user) => {
            if (user.pedidos && user.pedidos.length > 0) {
                acc.push(...user.pedidos);
            }
            return acc;
        }, []);
    

        // Si no hay pedidos en general
        if (allPedidos.length === 0) {
            return res.render('pedidos/pedidos', { pedidos: [], mensaje: "No hay pedidos realizados." });
        }

        // Renderizar la vista con todos los pedidos encontrados
        res.render('pedidos/pedidos', { pedidos: allPedidos, mensaje: null });
    } catch (error) {
        console.error('Error al obtener los pedidos:', error);
        res.render('pedidos/pedidos', { pedidos: [], mensaje: "Error al cargar los pedidos." });
    }
}); 


//module.exports ={router,carrito} ;
module.exports = router;