const mongoose = require('mongoose');//per mongo
//per criptare le password
const bcrypt = require('bcryptjs');
//richiamo il mio Db
const config = require('../config/database');
// User Schema
var nodemailer = require('nodemailer'); // Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package

// Start Sendgrid Configuration Settings
	var options = {
		auth: {
			api_user: 'themeanstack', // Sendgrid username
			api_key: 'PAssword123!@#' // Sendgrid password
		}
	}
	var client = nodemailer.createTransport(sgTransport(options));
	// End Sendgrid Configuration Settings

const UserSchema = mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
	img: {
    data: Buffer, contentType: String
  },//set, tatto a false prima dell invio mail, appena clicco sul link diventa true
	active: { type: Boolean, required: true, default: false },
	//
 	temporarytoken: { type: String, required: true }//
});

//espsorto il mio Schema assegnando a User
const User = module.exports = mongoose.model('User', UserSchema);
//metodo per prendere un utente dall id
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}
//metodo per prendre un utente con la username
module.exports.getUserByUsername = function(username, callback){
  const query = {username: username}
  User.findOne(query, callback);
}
module.exports.sendMail = function(username,callback){
  const query = {username: username}
  User.findOne(query, callback);
}
//metodo che  restituisce un utente dalla mail
module.exports.getUserByEmail = function(email,callback){
  const query = {email:email}
  User.findOne(query,callback)
}
//metodo che aggiunge un utente
module.exports.addUser = function(newUser, callback){
//bcrypt chiamo genSalt che genera una password
  bcrypt.genSalt(10, (err, salt) => {//la passo ad hash
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;// e scovrascrivo la password con la stringa di hash
      newUser.save(callback);// salvo
    });
  });
}//creo un metodo per aggiornare i campi dell' utente
module.exports.upDateUser = function(user,callback){
  //bcrypt chiamo genSalt che genera una password
    bcrypt.genSalt(10, (err, salt) => {//la passo ad hash
      bcrypt.hash(user.password, salt, (err, hash) => {
        if(err) throw err;
        user.password = hash;// e scovrascrivo la password con la stringa di hash
        user.save(callback);// salvo
      });
    });
}
//modulo per il confronto della password
module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) throw err;
    callback(null, isMatch);
  });
}

//per criptare la password salvo il campo password in una variabile e la crypto
UserSchema.pre('save',function (next) {
    var user=this;
    bcrypt.hash(user.password,null,null,function (err,hash) {
        if(err) return next(err);
        user.password=hash;
        next();
    });
});
