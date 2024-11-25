const express = require("express");
const bcrypt = require("bcryptjs"); // Para hashear contraseñas
const router = express.Router();
const User = require("../models/User");  // Importa el modelo de usuario

const { leerProductos, leerPedidos } = require("../data/db");  // Asumiendo que estos aún usan archivos JSON o alguna fuente de datos

// Mostrar lista de usuarios y otros datos
router.get("/", async (req, res) => {
  try {
    const productos = await leerProductos();
    const pedidosAgrupados = await leerPedidos();
    const usuarios = await User.find({});  // Usando Mongoose para obtener los usuarios desde MongoDB
    res.render("admin/index", { productos, pedidosAgrupados, usuarios });
  } catch (error) {
    console.error("Error al cargar la gestión:", error);
    res.status(500).send("Error al cargar la gestión");
  }
});

// Mostrar formulario de edición de un usuario
router.get("/:id/editar", async (req, res) => {
  const { id } = req.params;
  try {
    const usuario = await User.findById(id);  // Buscar el usuario por su ID
    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    // Renderizar la vista de editar con los datos del usuario
    res.render("admin/editar", { usuario });
  } catch (error) {
    console.error("Error al editar el usuario:", error);
    res.status(500).send("Error al editar el usuario");
  }
});

// Actualizar el nombre de usuario y otros datos
router.post("/:id/editar", async (req, res) => {
  const { id } = req.params;
  const { username, name, email, password } = req.body;

  // Validación básica
  if (!username || !name) {
    return res.status(400).send("Nombre de usuario y nombre son requeridos");
  }

  try {
    // Buscar el usuario por su ID
    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).send("Usuario no encontrado");
    }

    // Actualizar la información del usuario
    usuario.username = username;  // Cambiar el nombre de usuario
    usuario.name = name;
    usuario.email = email;

    // Si hay nueva contraseña, la encriptamos
    if (password) {
      usuario.passwordHash = await bcrypt.hash(password, 10);  // Hasheamos la nueva contraseña
    }

    // Guardar los cambios
    await usuario.save();
    res.redirect("/admin"); // Redirigir al panel de administración
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).send("Error al actualizar el usuario");
  }
});

// Eliminar usuario
router.post("/:id/eliminar", async (req, res) => {
  const { id } = req.params;
  try {
    // Eliminar el usuario por su ID
    await User.findByIdAndDelete(id);
    res.redirect("/admin"); // Redirigir al panel de administración
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).send("Error al eliminar el usuario");
  }
});

module.exports = router;
