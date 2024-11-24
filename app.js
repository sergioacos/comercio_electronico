const express = require('express');
const flash = require('connect-flash');
const path = require('path');
//base de datos
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
//configuración de passport:
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require("./models/user")

const bodyParser = require('body-parser')
const app = express();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use(flash());

const usuario = "comercio"
const password = "1234"
const dbName = "comercio"

/*const usuario = "usuario1"
const password = "LyioIXwtQLwnFz5e"
const dbName = "comercioMayorista"*/

const uri = `mongodb+srv://${usuario}:${password}@mongodb.1vvkx.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=MongoDB`;

mongoose.connect(uri)
  .then(()=> console.log('conectado a mongodb')) 
  .catch(e => console.log('error de conexión', e))

const {obtenerCarrito} = require('./data/db');


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

// Middleware para sesiones
app.use(session({
  secret: 'tu_secreto',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());





// Configurar estrategia local
passport.use(new LocalStrategy(async (username, password, done) => {
try {
  const user = await User.findOne({ username });
  if (!user) {
    return done(null, false, { message: 'Usuario no encontrado' });
  }
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return done(null, false, { message: 'Contraseña incorrecta' });
  }
  console.log(user.name);
  return done(null, user);
} catch (err) {
  return done(err);
}
}));

// Serialización y deserialización de usuarios
passport.serializeUser((user, done) => {
done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
try {
    const user = await User.findById(id);
    console.log("1 Usuario deserializado:", user); // Verifica que se obtiene el usuario completo
    done(null, user); // Aquí se pasa el usuario a req.user
} catch (err) {
    done(err);
}
});

app.use((req, res, next) => {
  res.locals.user = req.user; // `req.user` es establecido por Passport si el usuario está autenticado
  next();
});

const productoRoutes = require("./routes/productos");
const usuarioRoutes = require("./routes/users");
const carritoRoutes = require("./routes/carrito");
const adminRoutes = require("./routes/admin");
const ventasRoutes = require('./routes/ventas');
const loginRoutes = require('./routes/login')
app.use("/productos", productoRoutes);
app.use("/carrito", carritoRoutes);
app.use("/admin", adminRoutes);
app.use("/user", usuarioRoutes);
app.use('/ventas', ventasRoutes);
app.use("/login", loginRoutes)



// Página principal
app.get("/", (req, res) => {
  res.render("index", { titulo: "Comercio Electrónico" });
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/');
  });
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
