const express=require('express');
const route=express.Router();
const passport = require("passport");
const user=require('../../controllers/user/auth.js');
const googleOauth=require('../../controllers/user/googleOauth.js')
const { registerValidators, loginValidators, validate } = require('../../validators/auth.js');
const { authenticateToken } = require('../../middleware/auth.js');
route.post('/register', registerValidators, validate,user.Register);
route.post('/login',loginValidators, validate,user.Login);
route.get('/user', authenticateToken, user.getUser);
route.post('/verify-phone', user.verifyPhone);
route.post('/verify-email', user.verifyEmail);
route.get("/google",googleOauth.loginWithGoogle);
route.get("/google/callback",googleOauth.CallbackFromGoogle);
route.post("/resetRequest",user.requestPasswordReset);
route.post("/reset",user.resetPassword);
route.post("/updateProfile",authenticateToken,user.updateProfile);
module.exports=route;

