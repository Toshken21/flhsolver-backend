const express = require("express");
const router = express.Router();

// Initialize the model variable that will be filled when the module is required
let BetaAccount;

module.exports = function(model) {
  // Set the model to the one passed as an argument
  BetaAccount = model;

  router.post("/accounts/add", async (req, res) => {
    try {
      console.log("Route has started");
      const dePackage = req.body;
      console.log(dePackage);

      const existingAccount = await BetaAccount.findOne({ email: dePackage.email }).exec();
      console.log(existingAccount);

      if (existingAccount != null) {
        return res.status(400).json({ message: "An account with that email already exists" });
      } else {
        const newAccount = new BetaAccount({
          name: dePackage.name,
          age: dePackage.age,
          email: dePackage.email,
        });

        newAccount.save()
          .then(() => res.status(201).json({ message: "Account created" }))
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "Internal server error" });
          });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Return the router
  return router;
}
 