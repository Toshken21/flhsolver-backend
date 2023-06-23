const mongoose = require("mongoose");
const lightroomArticleSchema = new mongoose.Schema({
    content: {
        type: Array,
        
        required: true,
        unique: true,
        minlength: 0,
        maxlength: 1000
    },
    title: {
        type: String,
        required: true,
        unique: false,
        minlength: 2,
        maxlength: 100
    },
    tag: {
        type: String,
        required: true,
        unique: false,
        minlength: 2,
        maxlength: 24
    },
    thumbnailLink: {
        type: String,
        required: true,
        unique: false,
        minlength: 2,
        maxlength: 1000
    }
});


module.exports = lightroomArticleSchema;

