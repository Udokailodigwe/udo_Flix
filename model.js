const mongoose = require('mongoose');

let moviesSchema = mongoose.Schema({
   title :{type: String, required: true},
   description:{type: String, required:true},
   genre:{
      name: String,
      description: String,
   },
   director: {
      name: String,
      bio: String,
   },
   actors:[String],
   imagepath: String,
   releasedyear: Number
});

let usersSchema = mongoose.Schema({
   username: {type: String, required: true},
   password: {type: String, required: true},
   email: {type: String, required: true},
   birthday: Date,
   favoriteMovies: [{type: moongose.Schema.Types.ObjectId, ref: 'movies'}]
});

let movies = mongoose.model('movies', moviesSchema);
let users = mongoose.model('users', usersSchema);

module.exports.movies = movies;
module.exports.users  = users;