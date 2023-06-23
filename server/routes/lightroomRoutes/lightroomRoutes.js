const express = require("express");
const lightroomRouter = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config({path: "../config.env"});
const crypto = require("crypto");



// Configuring the s3 client



// Initialize the model variable that will be filled when the module is required
let LightroomArticle;

module.exports = function(model) {
  // Set the model to the one passed as an argument
  LightroomArticle = model;

  lightroomRouter.post("/article/add", async(req, res) => {
    try {
      console.log("Route has started");
      const dePackage = req.body;
      const existingArticle = await LightroomArticle.findOne({ content: dePackage.content }).exec();

      if(existingArticle !== null) {
        return res.status(400).json({ message: "An article with that content already exists" });
      } else {
        const newArticle = new LightroomArticle({
          content: dePackage.contentHolderArray,
          title: dePackage.articleTitle,
          tag: dePackage.articleTag,
          thumbnailLink: dePackage.imageLink
        });

        newArticle.save()
        .then(() => res.status(201).json({ message: "Article created" }))
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


  //This route adds an image to aws bucket from lightroompreview
  

  lightroomRouter.get("/article/view/all", async (req, res) => {
    try {
      console.log("Get all lightroomarticles has started");
      const articles = await LightroomArticle.find({});
      res.send(articles);
    }
    catch (error) {
      console.log(error);
    }
  });

  lightroomRouter.get("/article/view/:id", async (req, res) => {
    try {
      console.log("Get specific lightroomarticle has started");
      const article = await LightroomArticle.findById(req.params.id).exec();
      if(!article) {
        res.status(404).json({message: "No current article found with this id"});
      } else {
        res.json(article);
        console.log("route successful");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({message: "Internal server Error"});
    }
    
  });


  // Return the router
  return lightroomRouter;


}
