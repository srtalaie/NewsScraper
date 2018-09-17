//Dependencies
let express = require("express");
let bodyParser = require("body-parser");
let mongoose = require("mongoose");
let cheerio = require("cheerio");
let request = require("request");

const PORT = process.env.PORT || 8080;

// Initialize Express
let app = express();

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

//Set Handlebars
let handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Routes

// Make connection.
app.listen(PORT, function () {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
});  