const mongoose = require('mongoose');
const bcrypt = require ('bcrypt');

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
   releasedyear: String
});

let usersSchema = mongoose.Schema({
   username: {type: String, required: true},
   password: {type: String, required: true},
   email: {type: String, required: true},
   birthday: Date,
   favoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'movies'}]
});

usersSchema.statics.hashPassword =  (password)=>{ //hashing submitted password
   return bcrypt.hashSync(password, 10);
};

usersSchema.methods.validatePassword = function(password){ //compares submitted hashed password with the hashed password stored in database.
   return bcrypt.compareSync(password, this.password);
};

let movies = mongoose.model('movies', moviesSchema);
let users = mongoose.model('users', usersSchema);

module.exports.movies = movies;
module.exports.users  = users;