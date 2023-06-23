const mongoose = require("mongoose");

const betaAccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 24,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 200,
    lowercase: true,
  },
  age: {
    type: Number,
    required: true,
  },
});



module.exports = betaAccountSchema;
