const express = require("express");
const lightroomImageRouter = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const { S3Client, PutObjectCommand, GetObjectCommand} = require("@aws-sdk/client-s3");
const {getSignedUrl} = require("@aws-sdk/s3-request-presigner");
require("dotenv").config({path: "../config.env"});
const crypto = require("crypto");


const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
let LightroomImage;

const s3 = new S3Client({
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretAccessKey,
    },
    region: bucketRegion
  })

  module.exports = function(model) {

    LightroomImage = model;

    lightroomImageRouter.post("/add", upload.single("image"), async (req, res) => {
        try {



            
            const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");
            console.log("req.body", req.body);
            
    
            const imageName = randomImageName();
            const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }
    
        const command = new PutObjectCommand(params);
    
        await s3.send(command);

        // save the referemce to the image database 
        const newImage = new LightroomImage({
            name: imageName,
            caption: req.body.caption,

        });
        
        const savedImage = await newImage.save();
        res.status(201).json({message: "Image successfully stored", name: savedImage.name});
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
})
        

   
    lightroomImageRouter.get("/view/:id", async (req, res) => {
        // check if there exists a name for the image in the mongodb database
        console.log("req.params.id", req.params.id);
        const existingImage = await LightroomImage.findOne({name: req.params.id}).exec();
        if(!existingImage) {
            return res.status(404).json({ message: "An image doesn't exist" });
        } else {
            
            const params = {
                Bucket: bucketName,
                Key: existingImage.name,
                Expires: 24000, 
            };

            try{
                const command = new GetObjectCommand(params);
                const url = await getSignedUrl(s3, command, {expiresIn: params.Expires});

                //return the url
                return res.status(200).json({
                    message: "Success",
                    url: url,
                    image: existingImage
                });
            } catch (err) {
                console.log(err)
                return res.status(500).json({message: "Error generating url"});
            }
        }
    })

    return lightroomImageRouter;
  }