const mongoose = require("mongoose");

const ads = mongoose.Schema({
    img:[ 
        {
            data: String,
            contentType: String
        }
    ],
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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    propertyType:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true,
    },
    phone:{
        type: String,
        require: true,
    },
    email:{
        type: String,
        require: true,
    },
    Area:{
        type: String,
        require: true,
    },
    Bedrooms:{
        type: Number,
        require: true,
    },
    Bathrooms:{
        type: Number,
        require: true,
    },
    title:{
        type: String,
        require: true,
    },
    Description:{
        type: String,
        require: true, 
    },
    Address:{
        type: String,
        require: true, 
    },
    Payment_option:{
        type: String,
        require: true, 
    },
    views: {
        type: Number,
        default: 0,
    },
    viewedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
        }
    ]
}, { discriminatorKey: 'adType', timestamps: true });
module.exports = mongoose.model("ads", ads);
