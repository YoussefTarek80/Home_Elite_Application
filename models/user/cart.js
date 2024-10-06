const mongoose = require("mongoose");
const cartItem = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.Mixed,
        ref: 'product',
        required: true
    },
});
module.exports = mongoose.model("cart", cartItem);
