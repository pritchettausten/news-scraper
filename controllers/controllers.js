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
            res.redirect("/saved");
            // var obj = {
            //     articles: scrapedArticles
            // };
            // console.log(obj);
            // res.render("index", obj);
        });
    });

    app.get("/saved", function(req, res){
        db.Article.find({}, function(error, doc) {
            
            if (error) {
              console.log(error);
            }
            else {
              var obj = {
                articles: doc
              };
        
              res.render("saved", obj);
            }
        });
    });

    // app.get("/populateNote/:id", function(req, res){
    //     db.Article.find({_id:})
    // });

    app.post("/note/:id", function(req, res){
        
        //var id = req.params.id;
        var note = req.body.note;

        db.Note.create(note)
            .then(function(dbNote) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
            })
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
        });

        // console.log("Note: " + req.body.note);

        // db.Article.findOneAndUpdate({"_id": id}, {$push: {"note": note}}, function(err, doc){
        //     if (err){
        //         console.log(err)
        //     }else{
        //         //console.log(doc);
                
        //     }
        // })
        // res.redirect("/");
    })

    // app.get("/comment")
};