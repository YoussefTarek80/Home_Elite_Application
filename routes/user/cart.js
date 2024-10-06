const express=require('express');
const route=express.Router();
const cart=require('../../controllers/user/cart.js');
const { authenticateToken, admin_authenticateToken } = require('../../middleware/auth.js');
const upload = require('../../middleware/upload.js');

// const { registerValidators, loginValidators, validate } = require('../validators/auth.js');

route.post('/add_to_Cart', authenticateToken, cart.addToCart);

module.exports=route;