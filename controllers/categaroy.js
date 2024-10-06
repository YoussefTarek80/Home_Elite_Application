const Admin = require("../models/admin/admins");
const category = require("../models/admin/categaroy");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const ejs = require("ejs");

const addCategory = async (req, res) => {
    try {
        const { PropertyType } = req.body;
        const existingCategory = await category.findOne({ PropertyType });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists." });
        }
        const newCategory = new category({ PropertyType });
        await newCategory.save();
        res.status(201).json({ message: "Category added successfully", category: newCategory });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
const GetCategories= async (req,res)=>{
    try{
        const categories=await category.find();
        res.json(categories)
    }catch(err){
        res.status(500).json({ message: "Server error", error: err.message });
    }
}



module.exports = {
    addCategory,
    GetCategories
};