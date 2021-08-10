const express = require('express');
const routes = express.Router();
const ProductController = require('./app/controllers/ProductController')


routes.get('/', function (req, res) {
});





routes.get('/products/create', ProductController.create)
routes.post('/products', ProductController.post)


//Alias
routes.get('/ads/create', function (req, res) {
});



module.exports = routes;