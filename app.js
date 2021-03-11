// call our dependancies (NPM packages)
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const twig = require ('twig');
 // we're declaring our app
const app = express();

// lets import our model
const Post = require('./models/post'); 

// set the view engine
app.set('view engine', 'html');
app.engine('html', twig.__express);
app.set('views','views');

// declease a variable which stores our Mongo database URL
const MONGODB_URL = 'mongodb+srv://Test:test123@cluster0.xvqtg.mongodb.net/cTest?retryWrites=true&w=majority';

//we need to make the public accessible to our backend application (images,styling)
app.use(express.static(__dirname + '/public'));

// Use body parser
app.use(bodyParser.urlencoded({extended:false}));
 
mongoose.connect(MONGODB_URL, {useNewUrlParser: true})
 .then(result =>{
 app.listen(3000);
 console.log("database is connected");
 }).catch(err => {
 if (err) throw err;
});
 
// use app.get to get the view for our default page
// app.get('/', (req, res) => {
//  res.sendFile(__dirname + '/views/home.html');
// });

app.post('/', (req, res) => {
    new Post({
        title:req.body.title,
        content:req.body.content,
        author_name:req.body.author
    })
    .save()
    .then(result => {
        console.log(result);
        res.redirect('/');
    })
    .catch(err => {
        if (err) throw err;
    });
});

app.get('/', (req, res) => {
    // FETCH ALL POSTS FROM DATABASE
    Post.find()
    // sort by most recent
    .sort({createdAt: 'descending'})
    .then(result => {
        if(result){
            // RENDERING HOME VIEW WITH ALL POSTS
            res.render('home',{
                allpost:result
            });
        }
    })
    .catch(err => {
        if (err) throw err;
    }); 
});

// if we want to use a GET function which will send the /hello page to a view
// app.get('/hello', (req, res) => {
//  res.sendFile(__dirname + '/views/hello.html');
// });