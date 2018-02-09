var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Set mongoose to leverage built in JavaScript ES6 Promises
// mongoose.Promise = Promise;

var db = require("../models/");

module.exports = function(app){
    
    app.get("/", function(req, res) {
      res.render("index");
    });

    app.get("/scrape", function(req, res){
        request("https://www.theonion.com/c/news-in-brief", function(error, response, html) {
            
            var $ = cheerio.load(html);
            var scrapedArticles = {};
            
            $("article").each(function(i, element){
                
                var result = {};
                
                result.title = $(element).children("div").children("div").children("h1").children("a").text();
                result.link = $(element).children("div").children("div").children("h1").children("a").attr("href");
                result.sum = $(element).children("div").children("div").children(".excerpt").children("p").text();
                scrapedArticles[i] = result;
                if(result.title && result.link && result.sum){
                    db.Article
                        .create(result)
                        .then(function(dbArticle) {
                            console.log(dbArticle);
                        })
                        .catch(function(err) {
                    return res.json(err);
                    });
                }
            })
            var obj = {
                articles: scrapedArticles
            };
            console.log(obj);
            res.render("index", obj);
        });
    });
};