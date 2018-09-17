let mongoose = require("mongoose");

let Schema =  mongoose.Schema;

//Create comment schema
let CommentSchema = new Schema({
    Author: {
        type: String,
        required: true
    },
    Body: {
        type: String,
        required: true
      }
});

let Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;