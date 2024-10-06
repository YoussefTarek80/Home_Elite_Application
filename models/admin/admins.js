const mongoose = require("mongoose");

const admins = mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
  },
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  confpassword: {
    type: String,
    require: true,
  },
});
module.exports = mongoose.model("admin", admins);
