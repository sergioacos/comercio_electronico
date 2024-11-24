const fs = require("fs-extra");
const path = require("path");
const { leerUsuarios, guardarUsuarios } = require("./db-usuarios");
//datos de mongo
const Producto = require('../models/producto');
const Pedido = require('../models/pedido');
// Ruta del archivo JSON
const filePath = path.join(__dirname, "productos.json");
const filePathPedidos = path.join(__dirname, "pedidos.json");


// Leer productos desde el archivo JSON
async function leerProductos() {
  try {
    //const data = await fs.readFile(filePath, "utf-8");
    //return JSON.parse(data);
    const data= await Producto.find();
    return data
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return [];
  }
}
async function editarProducto(id, body){
  try {
    
    const productoActualizado= await Producto.findByIdAndUpdate({_id:id}, body,{useFindAndModify: false});
    
    if (!productoActualizado) {
      console.error(`Producto con id ${id} no encontrado.`);
      throw new Error('Producto no encontrado.');
    }

    return productoActualizado; // Devolver el producto actualizado
  } catch (error) {
    console.error('Error al actualizar el producto en la base de datos:', error);
    throw error;
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
// buscra 1 producto
async function buscarProducto(id) {
 // console.log("Buscar producto:", id);
  try {
    const productoBd = await Producto.findOne({ _id: id })
    return productoBd
} catch (error) {
  return console.error("No se encontro el producto", error);
  
}
}
// Guardar productos en el archivo JSON
async function guardarProductos(productos) {
  try {
    //await fs.writeFile(filePath, JSON.stringify(productos, null, 2), "utf-8");
    
    const productoBd= new Producto(productos);
    await productoBd.save();
  } catch (error) {
    console.error("Error al guardar en el archivo:", error);
  }
}
async function eliminarProducto(id) {
  try {
   
    const productoBd= await Producto.findByIdAndDelete({_id:id});
    
  } catch (error) {
    console.error("Error al guardar en el archivo:", error);
  }
}

let carrito = [];

function agregarProductoAlCarrito(productoM) {
  const producto = productoM.toObject();
    console.log("bd",producto.id)
    const existeEnCarrito = carrito.find(p => p._id === producto._id);
    if(carrito.length > 0){
      console.log("prod",carrito[0]);}
    if (existeEnCarrito) {
      //console.log("Agrego un producto cant:cantidad + 1");
        // Si el producto ya está en el carrito, incrementar la cantidad
        existeEnCarrito.cantidad += 1;
       // console.log(`/La cantidad es :${existeEnCarrito.cantidad}`);
    } else {
        // Si no está, agregar el producto al carrito con cantidad inicial 1
        carrito.push({ ...producto, cantidad: 1 });
        //console.log("Agrego un producto cant:1");
        console.log(`Producto agregado: ${carrito.length}`);
        console.log(`Producto agregado: ${carrito[0].cantidad}`);
    }
}

function obtenerCarrito() {
  return carrito;
}

// Leer el usuario desde el archivo JSON
/*async function leerUsuario() {
  try {
    const data = await fs.readFile(userFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al leer el archivo del usuario:', error);
    return { name: "usuario", pedidos: [] };
  }
}*/

// Guardar los pedidos del usuario en el archivo JSON
/*async function guardarUsuario(usuario) {
  try {
    await fs.writeFile(userFilePath, JSON.stringify(usuario, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error al guardar el archivo del usuario:', error);
  }
}*/

// Guardar un pedido en el carrito del único usuario
async function guardarPedido(carrito,usuario) {
  //let usuario = await leerUsuarios();

  const pedido = new Pedido({
    usuario: usuario.id,
    fecha: new Date(),
    producto: carrito
  });
 
  const pedidoGuardado = await pedido.save();
   // Agregar el carrito actual a la lista de pedidos del usuario
  usuario.pedido= usuario.concat(pedidoGuardado._id);
  await usuario.save();
/*  usuario.pedidos.push({
    fecha: new Date(),
    productos: carrito
  });

  await guardarUsuarios(usuario);*/
}

module.exports = {
  leerProductos,
  leerPedidos,
  guardarProductos,
  agregarProductoAlCarrito,
  obtenerCarrito,
  guardarPedido,
  eliminarProducto,
  editarProducto, 
  buscarProducto,
  //leerUsuario
};
