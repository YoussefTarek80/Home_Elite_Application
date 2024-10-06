const mongoose = require("mongoose");

const users = mongoose.Schema({
  email: {
    type: String,
    require: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  confpassword: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  cart: [
    {
      type: mongoose.Schema.Types.Mixed,
      ref: "cart",
    },
  ],
  messages:[
    {
      type: mongoose.Schema.Types.Mixed,
      ref: "Messages",
    },
  ],
  isPhoneVerified: { 
    type: Boolean, 
    default: false 
  },
  ads: [
    {
      type: mongoose.Schema.Types.Mixed,
      ref: "ads", 
    },
  ],
  favorite: [
    {
      ad: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "ads",
      },
      isFavorite: { 
        type: Boolean,
        default: false, 
      }
    }
  ],
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
});
module.exports = mongoose.model("user", users);
