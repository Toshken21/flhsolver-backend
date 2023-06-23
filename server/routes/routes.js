const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Connected to MongoDb");
})
.catch(err => {
  console.log(err);
});

app.use(cors());
app.use(express.json());

// Define a schema for the data in the "accounts" collection
const accountSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 30,
  },
});

// Define a model for the "accounts" collection using the schema
const Account = mongoose.model('Account', accountSchema);

// This route adds a new account
app.post("/accounts/add", async (req, res) => {
  try {
    console.log("Route has started");
    const dePackage = req.body;
    // Checks if there's an account with the same email address
    const existingAccount = await Account.findOne({ email: dePackage.email });

    if (existingAccount) {
      return res.status(400).json({ message: "An account with that email already exists" });
    }

    const newAccount = new Account({
      email: dePackage.email,
      name: dePackage.name,
      password: dePackage.password
    });

    await newAccount.save();
    res.status(201).json({ message: "Account created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" })
  }
});

// Start the server
const server = app.listen(4000, () => {
  console.log('Server started on port 4000');
});

server.on("listening", () => {
  console.log("Server is listening");
});

server.on("error", (error) => {
  console.error("Error starting server", error.message);
});

module.exports = Account;

console.log("Account has been changed");