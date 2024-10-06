const mongoose = require("mongoose");
const category = mongoose.Schema({
    PropertyType: {
        type: String,
        required: true
    },
});
module.exports = mongoose.model("category", category);
