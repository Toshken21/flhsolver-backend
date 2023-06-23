const mongoose = require("mongoose")

const LightroomImageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 0,
        maxlength: 100
    },

    caption: {
        type: String,
        required: true,
        unique: false,
        minlength: 0,
        maxlength: 200
    }


})

module.exports = LightroomImageSchema;