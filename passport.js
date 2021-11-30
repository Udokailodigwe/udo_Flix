const passport = require('passport'),
   LocalStrategy = require('passport-local').Strategy,
   Models = require('./models.js'),
   passportJWT = require('passport-jwt');

let users = Models.users,
   JWTStrategy = passportJWT.Strategy,
   ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({ //Create local strategy that authenticates username and password.
   usernameField: 'username',
   passwordField: 'password'
}, (username, password, callback) =>{
   console.log(username + ' ' + password);
   users.findOne({username: username}, (error, user) => {
      if (error){
         console.log(error);
         return callback(error);
      }
      if(!user) {
         console.log('incorrect username');
         return callback(null, false, {message: 'Incorrect username or password.'});
      }
      console.log('finished');
      return callback(null, user);
   });
}));

passport.use(new JWTStrategy({// Create JWTStrategy to authenticate user using JSON tokens.
   jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
   secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
   return users.findById(jwtPayload._id)
      .then((users) =>{
         return callback(null, users);
      })
      .catch((error) => {
         return callback(error)
      });
}));