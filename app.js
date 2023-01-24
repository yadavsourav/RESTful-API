const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));


app.use(express.static("public"));

main().catch(err => console.log(err));
 
async function main() {
    
  await mongoose.connect('mongodb://localhost:27017/wikiDB');
  //mongoose.set('strictQuery', false);
  console.log("Connected");

  const articleSchema = {
    title: String,
    content: String
  };

  const Article = mongoose.model("Article", articleSchema);
  

  /* Request targeting all articles */

  app.route("/articles")
  
  .get(function(req, res){
    Article.find(function(err, foundArticles){
        if(!err){
            res.send(foundArticles);
        } else {
            res.send(err);
        }
    });
  })
  
  .post(function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if(!err){
            res.send("Successfully added a new article");
        } else {
            res.send(err);
        }
    });
  })
  
  .delete(function(req, res){
    Article.deleteMany(function(err){            // it will delete everything
        if(!err){
            res.send("Deleted successfully");
        } else {
            res.send(err);
        }
    });
  });

/* Request targeting a single article */

app.route("/articles/:articleTitle")

.get(function(req, res){
 
    Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No article found");
        }

    });
})

.put(function(req, res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},  // the values for update are coming from server and put replaces whole document
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Successfully updated");
            }
        }
    );
})

.patch(function(req, res){
    /* req.body = {       // send by server, it can contain either or both of title and content
        title: "test"
    } */
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},   // relate from above, remaining parameters will not change
        function(err){
            if(!err){
                res.send("Successfully updated")
            } else {
                res.send(err);
            }
        }
        );   
})

.delete(function(req, res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Successfully deleted");
            } else {
                res.send(err);
            }

        }
    );
});

app.listen(3000, function(){
    console.log("Server started on 3000");
});

}