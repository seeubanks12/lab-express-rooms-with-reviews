const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: [true, "You must enter a username!"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "You must enter a password!"],
  },
  fullName: {
    type: String,
    required: true,
  },
});

const User = model("User", userSchema);

module.exports = User;
