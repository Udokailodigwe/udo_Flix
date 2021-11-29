const jwtSecret = 'your_jwt_secret'; //similar key used in the JWTStrategy
const jwt = require ('jsonwebtoken'),
   passport = require ('passport');

   require ('./passport'); //my local passport file

   let generateJWTToken = (users) => {
      return jwt.sign(users, jwtSecret, {
         subject: users.username, //Encoding username in JWT
         expiresIn: '7d', // Specifying the number of days the token will expire
         algorithm: 'HS256' // Algorithm used to 'sign' or encode the values of the JWT
      });
   }

   /* POST login. */
   module.exports = (router) => {
      router.post('/login', (req, res) => {
         passport.authenticate('local', {session: false}, (error, users, info) => {
            if (error || !users){
               return res.status(400).json({
                  message: 'Something is not right',
                  users: users
               });
            }
            req.login(users, {session: false}, (error) => {
               if (error){
                  res.send(error);
               }
               let token = generateJWTToken(users.toJSON());
               return res.json({users, token}); //returns the token
            });
         })(req, res);
      });
   }