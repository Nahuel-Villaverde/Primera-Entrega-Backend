const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

let products = [];

function guardarProductosEnArchivo() {
    const directory = path.join(__dirname, '..', 'data'); // Retroceder un nivel y luego entrar en la carpeta data



    const filePath = path.join(directory, 'products.json');
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
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

router.get('/', (req, res) => {
    const productsData = cargarProductosDesdeArchivo();
    res.json(productsData);
});

router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const productsData = cargarProductosDesdeArchivo();

    const producto = productsData.find(producto => producto.id === productId);

    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
});

router.post('/', (req, res) => {

    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails.' });
    }

    const id = products.length + 1;

    const newProduct = {
        id,
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };

    products.push(newProduct);

    guardarProductosEnArchivo();

    res.status(201).json(newProduct);
});

router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    const producto = products.find(producto => producto.id === productId);

    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }


    const { title, description, code, price, stock, category, thumbnails } = req.body;


    producto.title = title || producto.title;
    producto.description = description || producto.description;
    producto.code = code || producto.code;
    producto.price = price || producto.price;
    producto.stock = stock || producto.stock;
    producto.category = category || producto.category;
    producto.thumbnails = thumbnails || producto.thumbnails;

    guardarProductosEnArchivo();

    res.json(producto);
});

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    const index = products.findIndex(producto => producto.id === productId);

    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    products.splice(index, 1);

    guardarProductosEnArchivo();

    res.json({ message: 'Producto eliminado correctamente' });
});

module.exports = router;