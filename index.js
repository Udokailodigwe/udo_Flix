//Require necessary modules for server creation.
const express = require ('express');
const morgan = require ('morgan');
const mongoose = require('mongoose');
const cors =require('cors'); 
bodyParser = require ('body-parser');

app = express(); //Encapsulated the express function with variable, app.

const models = require('./models.js'); //module for mongoDB schema
const {check, validationResult} = require ('express-validator');

const movies = models.movies;
const users = models.users;

mongoose.connect(
  process.env.CONNECTION_URI,{ useNewUrlParser: true, useUnifiedTopology: true }
);

// mongoose.connect(
//   'mongodb://localhost:27017/udo_flixdb', {
//     useNewUrlParser: true, useUnifiedTopology: true 
//     }); //linking my REST API  to mongodb database

//Created middleware functions to ...
app.use (morgan('common')); //log all request on terminal
app.use(express.static('public')); // serve all static file in public folder
app.use(bodyParser.json()); //get json data from http request body inside req handlers using req.body
app.use(bodyParser.urlencoded({extended:true}));
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors({
  origin: (origin, callback) =>{
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1){// If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin '  + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

let auth = require ('./auth.js')(app); //appending express() into auth module using (app).

const passport = require ('passport');
require ('./passport');

//Get index page request/route
app.get('/', (req, res) =>{
  res.send('Welcome to the hub of movies !'); //respond to index route
});

//Get documentation request/route
app.get('/documentation', (req, res) => {
  res.sendFile ('public/documentation.html', {root: __dirname }); //respond through express.static
});

//Get all movies request/route
app.get('/movies', passport.authenticate ('jwt', {session: false}), (req, res) =>{
  movies.find()
    .then((movies) => {
      res.status(201).json(movies); 
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get single movie by title
app.get('/movies/:title', passport.authenticate ('jwt', {session: false}), (req, res)=> {
  movies.findOne()
    .then((movieTitle)=> {
      res.status(201).json(movieTitle);
    })
    .catch((err)=> {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });

//Get movies by genre
app.get('/movies/genre/:name', passport.authenticate ('jwt', {session: false}), (req, res)=> {
  movies.find({'genre.name': req.params.name})
  .then((genreName)=> {
    res.status(201).json(genreName)
  })
  .catch((err)=> {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//Get all users 
app.get('/users', passport.authenticate ('jwt', {session: false}), (req, res) =>{
  users.find()
    .then((users)=> {
      res.status(201).json(users);
    })
    .catch((err)=> {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get user by username
app.get('/users/:username', passport.authenticate ('jwt', {session: false}), (req, res) =>{
  users.findOne({username: req.params.username})
    .then((users)=> {
      res.status(201).json(users);
    })
    .catch((err)=> {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Get movies by directors name
app.get('/movies/directors/:name', passport.authenticate ('jwt', {session: false}), (req, res) =>{
  movies.find({'director.name': req.params.name})
    .then((directors)=> {
      res.status(201).json(directors);
    })
    .catch((err)=> {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Allow new user to create account
app.post('/users', 
  [ //employ express validator for checks
    check('username', 'Username is required.').isLength({min: 5}),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required.').not().isEmpty(),
    check('email', 'Email does not appear to be valid.').isEmail(),
    check('birthday', 'Birthday format is invalid.' ).isDate()
  ], (req, res)=> {
  let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()} );
    }
  let hashedPassword = users.hashPassword(req.body.password);
  users.findOne({username: req.body.username}) //search if user already exist
    .then((availableOldUser)=> {
      if(availableOldUser) {
        return res.status(400).send(req.body.username + ' ' + 'has an existing registered account');
      }else {
        users.create({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          birthday: req.body.birthday
        })
        .then((user) =>{res.status(201).json(user) })
        .catch((error)=> {
      console.error(error);
      res.status(500).send('Error: ' + error);
      })
    }
  })
  .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Allow users to update info
app.put('/users/:username', passport.authenticate ('jwt', {session: false}),
  [
    check(' username', 'Username is required.').isLength({min: 5}),
    check('username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('password', 'Password is required.').not().isEmpty(),
    check('email', 'Email does not appear to be valid.').isEmail(),
    check('birthday', 'Birthday format is invalid.' ).isDate()
  ], (req, res)=> {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array() });
    }
  users.findOneAndUpdate({username: req.params.username},
    {$set:
      {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        birthday: req.body.birthday
      }
    },
    {new: true}, //Ensures document is returned
    (err, userUpdated)=> {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      }else {
        res.json(userUpdated);
      }
    });
});

//Allow users to add favourite movies
app.post('/users/:username/movies/:Moviesid', passport.authenticate ('jwt', {session: false}), (req, res) => {
users.findOneAndUpdate({username: req.params.username}, 
  {$push:{
    favoriteMovies: req.params.Moviesid}
  },
  { new: true }, //Returns document
  (err, favoriteMovies) => {
    if (err){
      console.error(err);
      res.status(500).send('Error: ' + err);
    }else{
      res.json(favoriteMovies);
    }
  });
});

//Allow users to remove favourite movies
app.delete('/users/:username/movies/:Moviesid', passport.authenticate ('jwt', {session: false}), (req, res) => {
users.findOneAndUpdate({username: req.params.username}, 
  {$pull:{
    favoriteMovies: req.params.Moviesid}
  },
  { new: true }, //Returns document
  (err, removeFavorite) => {
    if (err){
      console.error(err);
      res.status(500).send('Error: ' + err);
    }else{
      res.json(removeFavorite);
    }
  });
});

//Allow clients to terminate account
app.delete('/users/:username', passport.authenticate ('jwt', {session: false}), (req, res) =>{
  users.findOneAndRemove({username: req.params.username})
    .then((user)=> {
      if(!user) {
        res.status(400).send(req.params.username + ' was not found');
      }else{
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
      .catch((err)=> {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//Created error handler
app.use((err, req, res, next) => {
  console.error(err.stack); //log all caught error to terminal
  res.status(500).send('An error has been found!');
  next();
});

//Listens to requests on port.
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () =>{
  console.log('Listening on port ' + port);
});