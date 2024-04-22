# API de Gestión de Productos y Carritos

## Descripción

Este repositorio contiene una API diseñada para gestionar productos y carritos de compra. La API permite realizar operaciones como agregar productos, actualizar cantidades y obtener información sobre los productos y carritos.

## Tecnologías Utilizadas

- Node.js
- Express.js
- File System (fs)

## Uso

- Iniciar el servidor ejecutando `npm start`.
- Acceder a la API a través de la URL base `http://localhost:8080/api`.

### Rutas de Productos

GET /products

#### Obtener un producto por su ID

GET /products/:pid

#### Agregar un nuevo producto

POST /products

Enviar un objeto JSON con los siguientes campos:

- title: String
- description: String
- code: String
- price: Number
- stock: Number
- category: String
- thumbnails: Array de Strings

#### Actualizar un producto por su ID

PUT /products/:pid

Enviar un objeto JSON con los campos que se desean actualizar.

#### Eliminar un producto por su ID

DELETE /products/:pid

### Rutas de Carritos

GET /carts

#### Crear un nuevo carrito

POST /carts

Devuelve un objeto JSON con el ID del carrito creado y un array vacío de productos.

#### Obtener los productos de un carrito por su ID

GET /carts/:cid

#### Agregar un producto al carrito

POST /carts/:cid/product/:pid

Agregar un producto al carrito especificado por su ID (`cid`). El producto se especifica por su ID (`pid`). Si el producto ya existe en el carrito, se incrementa la cantidad.

### Persistencia de Datos

La información sobre productos y carritos se guarda en archivos JSON (`products.json` y `carts.json`). Los archivos se actualizan automáticamente cada vez que se realiza una operación de creación, actualización o eliminación.