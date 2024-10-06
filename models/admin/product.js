const mongoose = require("mongoose");

const products = mongoose.Schema({
    img: {
        data: String,
        contentType: String
    },
    name: {
        type: String,
        require: true,
    },
    salary:{
        type: Number,
        require: true,
    },
    available: {
        type: Boolean,
        default: false,
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        default: null,
    },
    // propertyType:{
    //     type: String,
    //     require: true,
    // },
    // phone:{
    //     type: String,
    //     require: true,
    // },
    // email:{
    //     type: String,
    //     require: true,
    // },
    // Area:{
    //     type: String,
    //     require: true,
    // },
    // Bedrooms:{
    //     type: Number,
    //     require: true,
    // },
    // Bathrooms:{
    //     type: Number,
    //     require: true,
    // },
    // title:{
    //     type: String,
    //     require: true,
    // },
    // Description:{
    //     type: String,
    //     require: true, 
    // },
    // Address:{
    //     type: String,
    //     require: true, 
    // },
    // Payment_option:{
    //     type: String,
    //     require: true, 
    // }
});
module.exports = mongoose.model("product", products);
