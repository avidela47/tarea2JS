class Producto {
    sku;
    nombre;
    categoria;
    precio;
    stock;

    constructor(sku, nombre, precio, categoria, stock) {
        this.sku = sku;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;

        if (stock) {
            this.stock = stock;
        } else {
            this.stock = 10;
        }
    }
}

const queso = new Producto('KS944RUR', 'Queso', 10, 'lacteos', 4);
const gaseosa = new Producto('FN312PPE', 'Gaseosa', 5, 'bebidas');
const cerveza = new Producto('PV332MJ', 'Cerveza', 20, 'bebidas');
const arroz = new Producto('XX92LKI', 'Arroz', 7, 'alimentos', 20);
const fideos = new Producto('UI999TY', 'Fideos', 5, 'alimentos');
const lavandina = new Producto('RT324GD', 'Lavandina', 9, 'limpieza');
const shampoo = new Producto('OL883YE', 'Shampoo', 3, 'higiene', 50);
const jabon = new Producto('WE328NJ', 'Jabon', 4, 'higiene', 3);

const productosDelSuper = [queso, gaseosa, cerveza, arroz, fideos, lavandina, shampoo, jabon];
console.log(productosDelSuper)

class Carrito {
    productos;
    categorias;
    precioTotal;

    constructor() {
        this.precioTotal = 0;
        this.productos = [];
        this.categorias = [];
    }
    async agregarProducto(sku, cantidad) {
        console.log(`Agregando ${cantidad} ${sku}`);
        try {

            // Busco el producto en la "base de datos"
            const producto = await findProductBySku(sku);

            console.log("Producto encontrado", producto);

            // Check if the product already exists in the cart
            const index = this.productos.findIndex(prod => prod.sku === sku);
            if (index !== -1) {
                this.productos[index].cantidad += cantidad;
            } else {
                // Creo un producto nuevo
                const nuevoProducto = new ProductoEnCarrito(sku, producto.nombre, cantidad);
                this.productos.push(nuevoProducto);
                this.categorias.push(producto.categoria);
            }
            this.precioTotal = this.precioTotal + (producto.precio * cantidad);
            console.log(this.productos)

        } catch (error) {
            console.log("Producto No encontrado");
        }
    }
    async eliminarProducto(sku, cantidad) {
        console.log(`Eliminando ${cantidad} de ${sku}`);
        try {

            const index = this.productos.findIndex(p => p.sku === sku);
            if (index === -1) {
                return Promise.reject(`Product ${sku} not found`);
            }
            const product = this.productos[index];

            if (cantidad < product.cantidad) {
                product.cantidad -= cantidad;
            }

            else {
                this.productos.splice(index, 1);
            }
            const producto = await findProductBySku(sku);
            this.precioTotal -= cantidad * producto.precio;
           
            return Promise.resolve(this.productos);
        } catch (error) {
            console.log("Error eliminando producto", error);
            return Promise.reject(error);
        }
    }
    
    async mostrarCarrito(){
        console.log(this.precioTotal);
         

        
    }
}
class ProductoEnCarrito {
    sku;       // Identificador único del producto
    nombre;    // Su nombre
    cantidad;  // Cantidad de este producto en el carrito

    constructor(sku, nombre, cantidad) {
        this.sku = sku;
        this.nombre = nombre;
        this.cantidad = cantidad;
    }

}

// Función que busca un producto por su sku en "la base de datos"
function findProductBySku(sku) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const foundProduct = productosDelSuper.find(product => product.sku === sku);
            if (foundProduct) {
                resolve(foundProduct);
            } else {
                reject(`Product ${sku} not found`);
            }
        }, 1500);
    });
}

async function main() {
    let carrito = new Carrito();
    await carrito.agregarProducto("FN312PPE", 7);
    await carrito.agregarProducto("FN312PP7", 2);
    console.log(carrito.productos); // [ProductoEnCarrito {sku: "FN312PPE", nombre: "Gaseosa", cantidad: 3}]
   await carrito.eliminarProducto("FN312PPE", 1);
    console.log(carrito.productos); // [ProductoEnCarrito {sku: "FN312PPE", nombre: "Gaseosa", cantidad: 1}]
    await carrito.mostrarCarrito();
    setTimeout(() => {
        console.log(carrito);
        }, 2000 )
    }
main();



