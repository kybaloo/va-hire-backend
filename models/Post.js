const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: false
    },
    post_image_url: {
        type: String,
        required: false
    },
    slug: {
        type: String,
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    },
});

module.exports = mongoose.model('Post', PostSchema);