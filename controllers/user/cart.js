const User = require("../../models/user/auth"); 
const Product = require("../../models/admin/product"); 

const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.userid; 
        console.log(userId);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        const existProduct=await user.cart.some((items)=>items.product.toString()===productId)
        if (existProduct) {
            return res.status(400).json({ message: "Product already added to cart" });
        }
        user.cart.push({
            product: productId,
            name: product.name,
            img: product.img,
            salary: product.salary
        });
        await user.save();
        res.status(200).json({ message: "Product added to cart" });     
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" }); 
    }
};

module.exports = {
    addToCart,
};
