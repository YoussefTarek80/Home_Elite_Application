const express=require('express');
const route=express.Router();
const product=require('../../controllers/products.js');
const { authenticateToken, admin_authenticateToken } = require('../../middleware/auth.js');
const upload = require('../../middleware/upload.js');

// const { registerValidators, loginValidators, validate } = require('../validators/auth.js');

route.get('/products', authenticateToken,product.products);
route.post('/AddProduct', authenticateToken, upload.single('img'), product.addProduct);
route.get('/ownProducts', authenticateToken, upload.single('img'), product.GetOwnProducts);
module.exports=route;