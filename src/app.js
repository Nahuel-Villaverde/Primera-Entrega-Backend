import express from 'express';
import http from 'http';
import __dirname from './utils.js'
import handlebars from 'express-handlebars'
import path from 'path';
import { Server } from 'socket.io'
import productsRouter from './routes/productsRouter.js';
import cartsRouter from './routes/cartsRouter.js';;
import viewsRouter from './routes/views.router.js'

const PORT = 8080;

const app = express();
const httpServer = app.listen(PORT, console.log(`Server running on port ${PORT}`)) 

let products = [];

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const socketServer = new Server(httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.use('/realTimeProducts', viewsRouter)


let nextProductId = 1;

socketServer.on('connection', socket => {
    console.log("Nuevo cliente conectado");

    socket.emit('productLogs', products);

    socket.on("addProduct", productData => {
        const id = nextProductId++;
        productData.id = id;
        products.push(productData);
        console.log("Producto agregado:", productData);
        socketServer.emit("productLogs", products);
    });

    socket.on("deleteProduct", id => {
        console.log("Intentando eliminar producto con ID:", id);
        products = products.filter(product => product.id !== id);
        console.log("Productos después de la eliminación:", products);
        socketServer.emit("productLogs", products);
    });
});


