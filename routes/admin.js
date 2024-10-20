const express = require("express");
const bcrypt = require("bcryptjs"); // Para hashear contraseñas
const router = express.Router();

const { leerProductos, leerPedidos } = require("../data/db");
const { leerUsuarios, guardarUsuarios } = require("../data/db-usuarios");

router.get("/", async (req, res) => {
  try {
    const productos = await leerProductos();
    const pedidosAgrupados = await leerPedidos();
    const usuarios = await leerUsuarios();
    res.render("admin/index", { productos, pedidosAgrupados, usuarios });
  } catch (error) {
    console.error("Error al cargar la gestión:", error);
    res.status(500).send("Error al cargar la gestión");
  }
});

// Mostrar formulario de edición de un usuario
router.get("/:id/editar", async (req, res) => {
  const { id } = req.params;
  const usuarios = await leerUsuarios();
  const usuario = usuarios.find((p) => p.id === parseInt(id));

  if (!usuario) {
    return res.status(404).send("Usuario no encontrado");
  }

  // Renderizar la vista de editar con los datos del producto
  res.render("admin/editar", { usuario });
});

router.post("/:id/editar", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  // Validación básica
  if (!name || !email) {
    return res.status(400).send("Nombre y email son requeridos");
  }

  let usuarios = await leerUsuarios();
  const usuarioIndex = usuarios.findIndex(
    (usuario) => usuario.id === parseInt(id)
  );

  if (usuarioIndex === -1) {
    return res.status(404).send("Usuario no encontrado");
  }

  // Actualizar información del usuario
  usuarios[usuarioIndex] = {
    id: parseInt(id),
    name,
    email,
    password: usuarios[usuarioIndex].password, // Retener la contraseña existente
  };

  await guardarUsuarios(usuarios);
  res.redirect("/admin"); // Considera agregar un mensaje de éxito
});

router.post("/:id/eliminar", async (req, res) => {
  const { id } = req.params;
  let usuarios = await leerUsuarios();

  // Filtrar el usuario que será eliminado
  usuarios = usuarios.filter((usuario) => usuario.id !== parseInt(id));

  await guardarUsuarios(usuarios);
  res.redirect("/admin");
});

//module.exports ={router,carrito} ;
module.exports =router;