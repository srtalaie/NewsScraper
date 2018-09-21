let mongoose = require("mongoose");

let Schema =  mongoose.Schema;

//Create article schema
let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    comment: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    saved: {
        type: Boolean,
        default: false
    }
});
let Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;