const express = require('express');

const path = require('path');

const {obtenerCarrito} = require('./data/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('static'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar motor de plantillas
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Rutas
app.use((req, res, next) => {
    const carrito = obtenerCarrito();
    // Sumar todas las cantidades de los productos en el carrito
    const totalProductos = carrito.reduce((total, producto) => total + producto.cantidad, 0);
    res.locals.totalCarrito = totalProductos; // Total de productos en el carrito
    next()
  });

const productoRoutes = require("./routes/productos");
const usuarioRoutes = require("./routes/usuarios");
const carritoRoutes = require("./routes/carrito");
const adminRoutes = require("./routes/admin");
const ventasRoutes = require('./routes/ventas');
app.use("/productos", productoRoutes);
app.use("/carrito", carritoRoutes);
app.use("/admin", adminRoutes);
app.use("/", usuarioRoutes);
app.use('/ventas', ventasRoutes);



// Página principal
app.get("/", (req, res) => {
  res.render("index", { titulo: "Comercio Electrónico" });
});


//Manejo error 404
app.use((req, res) => {
    res.status(404).render('errores/404', { titulo: 'Página no encontrada' }); 
});

//Manejo error 500
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).render('errores/500', { titulo: 'Error Interno' });
});


//Manejo error 404
app.use((req, res) => {
    res.status(404).render('errores/404', { titulo: 'Página no encontrada' }); 
});

//Manejo error 500
app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).render('errores/500', { titulo: 'Error Interno' });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
