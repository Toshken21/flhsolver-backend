const express = require('express');
const app = express();
const cors = require("cors");

// Import the schemas
const betaAccountSchema = require("./betaAccountsModel");
const lightroomArticleSchema = require("./lightroomArticleModel");
const lightroomImageSchema = require("./lightroomImagesModel");
const newsletterSchema = require("./newsletterModel");

const corsOptions = {
  origin: 'https://flhsolver-frontend-25f045ddd5f7.herokuapp.com',
  optionsSuccessStatus: 200 // For legacy browser support
};

const PORT = process.env.PORT || 4000;
app.use(cors(corsOptions));
app.use(express.json());

// enforce https

/*app.use(function(req, res, next) {
  if (req.headers["x-forwarded-proto"] !== "https") {
    console.log("redirected to https");
    res.redirect("https://" + req.headers.host + req.url);
  } else {
    console.log("not redirected to https")
    next();
  }
});

*/




require("dotenv").config({path: "./config.env"});
const mongoose = require('mongoose');

//URI keys
const mongoURI1 = process.env.ATLAS_URI1;
const mongoURI2 = process.env.ATLAS_URI2;

// Connect to the databases
const conn1 = mongoose.createConnection(mongoURI1, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const conn2 = mongoose.createConnection(mongoURI2, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create models with specific connections
const BetaAccount = conn1.model('BetaAccount', betaAccountSchema);
const LightRoomArticle = conn2.model('LightRoomArticle', lightroomArticleSchema);
const LightroomImage = conn2.model("LightRoomImage", lightroomImageSchema);
const Newsletter = conn2.model("Newsletter", newsletterSchema);

// Import routes and pass in models
  const betaAccountRoutes = require("./routes/betaAccountsRoutes")(BetaAccount);
  app.use("/beta", betaAccountRoutes);

const lightRoomArticleRoutes = require("../server/routes/lightroomRoutes/lightroomRoutes")(LightRoomArticle);
app.use("/lightroom", lightRoomArticleRoutes);

const lightRoomImageRoutes = require("../server/routes/lightroomRoutes/lightroomImageRoutes")(LightroomImage);
app.use("/lightroomimage", lightRoomImageRoutes);

const newsletterRoutes = require("../server/routes/lightroomRoutes/newsletterRoutes")(Newsletter);
app.use("/newsletter", newsletterRoutes);

// Start the server
const server = app.listen(PORT, () => {
    console.log('Server started on port 4000');
});

server.on("listening", () => {
    console.log("Server is listening");
});

server.on("error", (error) => {
    console.error("Error starting server", error.message);
});
