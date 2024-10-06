const User = require("../models/user/auth.js");
const product = require("../models/admin/product.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const ejs = require("ejs");

const products= async (req,res)=>{
    const products = await product.find();
    res.json(products);
}
const addProduct = async (req, res) => {
    try {
        console.log('File received:', req.file);
        const { name, salary, available } = req.body;
        const userId = req.user.userid; 
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const newProduct = new product({
            name,
            salary,
            available,
            img: {
                data: `http://localhost:3000/img/${req.file.path}`,
                contentType: req.file.mimetype,
            },
        });
        user.ads.push(newProduct)
        await newProduct.save();
        res.status(201).json({ message: 'Product added successfully', product: newProduct });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
const GetOwnProducts= async (req,res)=>{
    try{
        
    }catch (err) {
        console.error('Error get own products:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    products,
    addProduct,
    GetOwnProducts
};