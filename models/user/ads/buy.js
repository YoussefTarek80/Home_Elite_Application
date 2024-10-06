const ads=require('./ads')
const mongoose = require("mongoose");

const BuyAds = mongoose.Schema({
    FinalTotal: {
        type: Number,

    },
});
module.exports = ads.discriminator("buy", BuyAds);
