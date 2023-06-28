const express = require("express");
const newsletterRouter = express.Router();


require("dotenv").config({path: "../config.env"});
const crypto = require("crypto");

let newsLetter;

module.exports = function(model) {
    newsLetter = model;
    // This route adds a new subscriber to the newsletter
    newsletterRouter.post("/add", async (req, res) => {
        try {
            console.log("Newsletter route that adds subscribers has started");
            const dePackage = req.body;
            const existingEmail = await newsLetter.findOne({email: dePackage.email}).exec();

            if(existingEmail !== null) {
                return res.status(400).json({message: "this email is already subscribed to the newsletter"});
            } else {
                const newsletterSubscription = new newsLetter({
                    email: dePackage.email
                });

                newsletterSubscription.save()
                .then(() => res.status(201).json({message: "New subscriber added to the newsletter"}))
                .catch((err) => {
                    console.log(err);
                    return res.status(500).json({message: "Internal server error."});
                });
            }
        } catch(err) {
            console.log(err);
            return res.status(500).json({message: "Internal server error."});            
        }
    });



    // Return the router
    return newsletterRouter;
}