import express from 'express';
import fs from 'fs';
import path from 'path';
const router = express.Router();

let carts = [];

function guardarCarritosEnArchivo() {
    const directory = path.join(__dirname, '..', 'data'); // Retroceder un nivel y luego entrar en la carpeta data
    const filePath = path.join(directory, 'carts.json');
    fs.writeFileSync(filePath, JSON.stringify(carts, null, 2), 'utf-8');
}

function cargarProductosDesdeArchivo() {
    try {
        const filePath = path.join(__dirname, '..', 'data', 'products.json');
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error al cargar productos desde el archivo:', error);
        return [];
    }
}

router.post('/', (req, res) => {
    const id = carts.length + 1;

    const nuevoCarrito = {
        id: id,
        products: []
    };

    carts.push(nuevoCarrito);

    guardarCarritosEnArchivo();

    res.status(201).json([nuevoCarrito]);
});

router.get('/:cid', (req, res) => {
    const cartId = parseInt(req.params.cid);

    const cart = carts.find(carrito => carrito.id === cartId);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart.products);
});

router.post('/:cid/product/:pid', (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);

    const productos = cargarProductosDesdeArchivo();

    const cart = carts.find(carrito => carrito.id === cartId);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    const productoExistente = productos.find(producto => producto.id === productId);

    if (!productoExistente) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const productInCart = cart.products.find(product => product.id === productId);

    if (productInCart) {
        productInCart.quantity++;
    } else {
        cart.products.push({ id: productId, quantity: 1 });
    }

    guardarCarritosEnArchivo();

    res.json(cart.products);
});

export default router;