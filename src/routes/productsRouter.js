import express from'express';

const router = express.Router();

let products = [];

router.get('/', (req, res) => {
    res.render('home', { products });
});

// Ruta GET para mostrar el formulario para agregar un producto
router.get('/addProduct', (req, res) => {
    res.render('index');
});


router.get('/', (req, res) => {
    res.json(products);
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

router.post('/addProduct', (req, res) => {

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

    res.send('¡Producto registrado exitosamente!');
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

    res.json(producto);
});

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);

    const index = products.findIndex(producto => producto.id === productId);

    if (index === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    products.splice(index, 1);

    res.json({ message: 'Producto eliminado correctamente' });
});

export default router;