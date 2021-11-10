//Require necessary modules for server creation.
const express = require ('express');
const morgan = require ('morgan');
app = express(); //Encapsulated the express function with variable, app.

//Created JSON object to carry movie data.
let myMovies = [
  {
    title: 'Lupin',
    director: ['Louis Leterrier',  'Marcela Said'],
    genre: ['Crime', 'Thriller', 'Mystery', 'Drama'],
    releaseYear: 2021
  },
  {
    title: 'Acrimony',
    director: 'Tyler Perry',
    genre: ['Thriller', 'Psychological Thriller'],
    releasedYear: 2018
  },
  {
    title: 'Grey\'s Anatomy',
    director: 'Shonda Rhimes', 
    genre:['Medical drama', 'Romance', 'Drama', 'Soap opera', 'Dark comedy', 'Medical fiction'],
    releasedYear: 2005
  },
  {
    title: 'How To Get Away With Murder',
    director: ['Bill D\'Elia', 'Shonda Rhimes'],
    genre:['Thriller', 'Mystery', 'Drama', 'Legal'],
    releasedYear: 2014
  },
  {
    title: 'Squid Game',
    director: 'Hwang Dong-hyuk',
    genre: ['Survival', 'Thriller', 'Horror','Drama'],
    releasedYear: 2021
  },
  {
    title: 'Power',
    director: ['Courtney Kemp', 'Gary Lennon', 'David Knoller', 'Curtis Jackson', 'Mark Canton', 'Randall Emmett'],
    genre: ['Drama', 'Crime'],
    releasedYear: 2014
  },
  {
    title: 'i, Robot',
    director: 'Alex Proyas',
    genre: ['Sci-Fi', 'Thriller', 'Action', 'Mystery', 'Drama'],
    releasedYear: 2004
  },
  {
    title: 'Salt',
    director: 'Phillip Noyce',
    genre: ['Action', 'Thriller'],
    releasedYear: 2010
  },
  {
    title: 'Mr and Mrs Smith',
    director: 'Doug Liman',
    genre: ['Action', 'Comedy'],
    releasedYear: 2005
  },
  {
    title: 'Like A Boss',
    director: 'Miguel Arteta',
    genre: 'Comedy',
    releasedYear: 2020
  }
];

//Created middleware functions to ...
app.use (morgan('common')); //log all request on terminal
app.use(express.static('public')); // serve all static file in public folder

//Get index request/route
app.get('/', (req, res) =>{
  res.send('Welcome to the hub of movies !'); //respond to index route
});

//Get documentation request/route
app.get('/documentation', (req, res) => {
  res.sendFile ('public/documentation.html', {root: __dirname }); //respond through express.static
});

//Get movies request/route
app.get('/movies', (req, res) =>{
res.json(myMovies); //return json object containing movies
});

//Created error handler
app.use((err, req, res, next) => {
  console.error(err.stack); //log all caught error to terminal
  res.status(500).send('An error has been found!');
  next();
});

//Listens to requests on port.
app.listen(8080, () =>{
  console.log('This app is listening on port 8080.');
});
