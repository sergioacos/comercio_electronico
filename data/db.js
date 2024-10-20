const fs = require("fs-extra");
const path = require("path");

// Ruta del archivo JSON
const filePath = path.join(__dirname, "productos.json");
const filePathPedidos = path.join(__dirname, "pedidos.json");

// Leer productos desde el archivo JSON
async function leerProductos() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return [];
  }
}

// Leer pedidos desde el archivo JSON
async function leerPedidos() {
  try {
    const data = await fs.readFile(filePathPedidos, "utf-8");
    const datos = JSON.parse(data).pedidos;

    // Aplanar la lista de productos y ordenar por id
    let productosOrdenados = [];

    datos.forEach((element) => {
      productosOrdenados = productosOrdenados.concat(element.productos);
    });

    // Ordenar los productos por id
    productosOrdenados.sort((a, b) => a.id - b.id);

    return productosOrdenados;
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return [];
  }
}

// Guardar productos en el archivo JSON
async function guardarProductos(productos) {
  try {
    await fs.writeFile(filePath, JSON.stringify(productos, null, 2), "utf-8");
  } catch (error) {
    console.error("Error al guardar en el archivo:", error);
  }
}

let carrito = [];

function agregarProductoAlCarrito(producto) {
  const existeEnCarrito = carrito.find((p) => p.id === producto.id);

  if (existeEnCarrito) {
    console.log("Agrego un producto cant:cantidad + 1");
    // Si el producto ya está en el carrito, incrementar la cantidad
    existeEnCarrito.cantidad += 1;
    console.log(`/La cantidad es :${existeEnCarrito.cantidad}`);
  } else {
    // Si no está, agregar el producto al carrito con cantidad inicial 1
    carrito.push({ ...producto, cantidad: 1 });
    console.log("Agrego un producto cant:1");
    console.log(`Producto agregado: ${carrito.length}`);
  }
}

function obtenerCarrito() {
  return carrito;
}

module.exports = {
  leerProductos,
  leerPedidos,
  guardarProductos,
  agregarProductoAlCarrito,
  obtenerCarrito,
};
