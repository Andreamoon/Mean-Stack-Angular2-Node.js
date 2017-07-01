//importo jwt Strategy
const JwtStrategy = require('passport-jwt').Strategy;
//importo ExtractJwt
const ExtractJwt = require('passport-jwt').ExtractJwt;
//importo il modello
const User = require('../models/user');
//importo il database config
const config = require('../config/database');
//esporto il modulo per richiederelo nelle routes
module.exports = function(passport){
  let opts = {};//oggetto json vuoto
  //Autorizzazione per passare il token
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  // gli passo il secret del database
  opts.secretOrKey = config.secret;
  // setto la strategia e gli passo opt e una callback
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
      console.log(jwt_payload);
//che controlla l id dell utente
  User.getUserById(jwt_payload._doc._id, (err, user) => {
// se errroe ritorna errore e utente false
      if(err){
        return done(err, false);
      }
//ritorna null e user
      if(user){
        return done(null, user);
      } else {
        // null e falses
        return done(null, false);
      }
    });
  }));
}
