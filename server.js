//Dependencies
let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let cheerio = require("cheerio");
let request = require("request");
let path = require("path");

const PORT = process.env.PORT || 8080;

// Initialize Express
let app = express();

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Set Handlebars
let handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Set up DB
let db = require("./models/index.js");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//Routes
//Scrape article's titles and links
app.get("/scrape", function(req, res){
    request("https://old.reddit.com/r/news/", function(error, response, html){
        let $ = cheerio.load(html);
        
        $("p.title").each(function(i = 0, element){
            //Grab 20 articles
            if (i < 20){
                let title = $(element).text();
                let link = $(element).children().attr("href");
    
                let article = {
                    title: title,
                    link: `${link}`
                };

                db.Article.create(article)
                .then(function(response){
                })
                .catch(function(err){
                    console.log(err);
                });
                i++;
            }
        });
        res.redirect('/');
    });
});

//Get articles from db and populate index page
app.get("/", function(req, res){
    db.Article.find({}, function(err, results){
        let data = {
            articles: results
        };
        res.render('index', data);
    });
});

//Target article by id and set articles saved property to true
app.post("/saved/:id", function(req, res){
    db.Article.findOneAndUpdate({ _id: req.params.id }, { $set: { saved: true }}, function(err, response){
        if (err) throw err;
    });
});

//Get only the saved articles
app.get("/saved", function(req, res){
    db.Article.find({saved: true}, function(err, results){
        let data = {
            articles: results
        };
        res.render('index', data);
    });
});

//Post Note on Article
app.post("/addComment/:id", function(req, res){
    let newComment = {
        author: req.body.author,
        body: req.body.body
    };
    db.Comment.create(newComment).then(function(comment){
        return db.Article.findByIdAndUpdate({ _id: req.params.id }, { $push: { comment: comment._id } }, { new: true });
    }).then(function(response){
        res.json(response);
    }).catch(function(err) {
        res.json(err);
    });
});

//Get Comment
app.get("/getComment/:id", function(req, res){
    db.Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(article) {
        res.json(article);
      })
    .catch(function(err) {
        res.json(err);
      });
});

//Delete a Comment
app.get("/deleteComment/:id", function(req, res){
    db.Comment.find({ _id: req.params.id }).remove(function(err, results){
        if (err) throw err;

        res.json(results);
    });
});

// Make connection.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});  