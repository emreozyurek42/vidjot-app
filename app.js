const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() => console.log ('MongoDB connected'))
.catch((err) => console.log(err));

require('./models/Idea');
const Idea = mongoose.model('ideas');

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    const title = 'Welcome';
   res.render('index', {title});
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/ideas', (req, res) => {
    Idea.find({})
      .sort({date: 'desc'})
      .then(ideas => {
        res.render('ideas/index', {ideas});
      });
    
});

app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        res.render('ideas/edit', {idea});
    });
    
});

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

app.post('/ideas', (req, res) => {
   let errors = [];

   if(!req.body.title) {
       errors.push({text: 'Please add a title'});
   }
   if(!req.body.details) {
       errors.push({text: 'Please add some details'});
   }

   if(errors.length > 0) {
       res.render('ideas/add', {
           errors: errors,
           title: req.body.title,
           details: req.body.details
       });
   } else {
       const newUser = {
           title: req.body.title,
           details: req.body.details
       }
       new Idea(newUser)
        .save()
        .then((idea) => {
            res.redirect('/ideas');
        })
   }
});

const port = 5000;


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});