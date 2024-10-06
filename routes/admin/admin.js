const express=require('express');
const route=express.Router();
const admins=require('../../controllers/admins.js');
const categaroy=require('../../controllers/categaroy.js');
const {  loginValidators, validate } = require('../../validators/auth.js');
const { authenticateToken, admin_authenticateToken } = require('../../middleware/auth.js');
route.post('/login', loginValidators,validate,admins.Login);
route.post('/register',admins.Register);
route.post('/AddCategoray',admin_authenticateToken,categaroy.addCategory);
route.get('/GetCategories',admin_authenticateToken,categaroy.GetCategories);

module.exports=route;