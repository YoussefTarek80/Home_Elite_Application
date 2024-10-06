const ads=require('./ads')
const mongoose = require("mongoose");

const RentAds = mongoose.Schema({
    rentDuration: {
        type: String,

    },
    DownPayment:{
        type: Number,

    },
    Insurance:{
        type: Number,

    },

});
module.exports = ads.discriminator("rent", RentAds);