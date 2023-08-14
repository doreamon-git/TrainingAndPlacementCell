const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    rollNo: {
        type: Number
    },
    name: {
        type: String
    },
    content: {
        type: String
    },
    publishDate: {
        type: String
     }
})

const commentModel = mongoose.model('Comment', commentSchema)
module.exports = commentModel
