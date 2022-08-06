//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");


const homeStartingContent = "";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');
const uri = 'mongodb://localhost:27017/blogDB';

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}

mongoose.connect(uri, options);

const blogSchema = {
  title: String,
  body: String
}

const Blog = mongoose.model("Blog", blogSchema);

const blog = new Blog({
  title: "mongoDB Blog!!",
  body: "This is my first mongoDB blog"
});

// blog.save();

app.get('/', function(req, res) {
  Blog.find(function(err, posts){
    res.render("home", {posts:posts});
  });


});

app.get('/posts/:postName', function(req, res) {

  let requestedTitle = _.lowerCase(req.params.postName);
  Blog.find(function(err, posts){
    posts.forEach(function(post){

      if(requestedTitle===_.lowerCase((post.title))){
        res.render("post",{postTitle: post.title, postContent: post.body});
      }
    });
  });



});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post('/compose', function(req, res) {

  const post = new Blog({
    title: req.body.postTitle,
    body: req.body.postBody
  });

  Blog.findOne({title: req.body.postTitle}, function(err, found){
    postFound = "";
    if(!err){
      if(!found){
        post.save();
      }
      else{
        console.log("Post with same title already exists");
          res.redirect("/");
      }
    }
  })
  // posts.push(post);
  res.redirect("/");

});









app.listen(3000, function() {
  console.log("Server started on port 3000");
});
