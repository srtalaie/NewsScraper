let mongoose = require("mongoose");

let Schema =  mongoose.Schema;

//Create comment schema
let CommentSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

let Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;