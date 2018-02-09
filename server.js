var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/newsScraperdb", {
  //useMongoClient: true
});

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./controllers/controllers.js")(app);

// app.get("/", function(req, res){
//     res.render("index");
// });

// app.get("/scrape", function(req, res){
//     request("https://www.theonion.com/c/news-in-brief", function(error, response, html) {
        
//         var $ = cheerio.load(html);
    
//         $("article").each(function(i, element){

//             var result = {};

//             result.title = $(element).children("div").children("div").children("h1").children("a").text();
//             result.link = $(element).children("div").children("div").children("h1").children("a").attr("href");
//             result.sum = $(element).children("div").children("div").children(".excerpt").children("p").text();
            
//             if(result.title && result.link && result.sum){
//                 db.Article
//                     .create(result)
//                     .then(function(dbArticle) {
//                         console.log(dbArticle);
//                     })
//                     .catch(function(err) {
//                 return res.json(err);
//                 });
//             }
//         })
//     });
//     res.send("worked");
// });

app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});