const mongoose = require("mongoose")

const LightroomNewsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 2,
        maxlength: 100
    }



})

module.exports = LightroomNewsletterSchema;