const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
var nodemailer = require('nodemailer'); // Import Nodemailer Package
var sgTransport = require('nodemailer-sendgrid-transport'); // Import Nodemailer Sengrid Transport Package
// Start Sendgrid Configuration Settings (Use only if using sendgrid)
    // var options = {
    //     auth: {
    //         api_user: 'dbrian332', // Sendgrid username
    //         api_key: 'PAssword123!@#' // Sendgrid password
    //     }
    // };
    // Nodemailer options (use with g-mail or SMTP)


    var client = nodemailer.createTransport( {

        host: "smtp.gmail.com", // hostname
        secureConnection: true, // use SSL
        port: 465 , // port for secure SMTP
        auth: {
            user: "andrealunetta1@gmail.com",
            pass: "itsstevejobs2012"
        }
    });

// Register è la routes di registrazione utente
router.post('/register', (req, res, next) => {

  let newUser = new User({//oggetto tipo User dal models
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,// Create a token for activating account through e-mail
    temporarytoken : jwt.sign({username: req.body.username, email: req.body.email },
      config.secret, { expiresIn: '24h' })
  });
//Metodo controllo se la username esiste gia
User.getUserByUsername(newUser.username, (err, user) => {
  if(err) throw err;
  if(user){
      return res.json({success: false, msg: 'Username gia esistente !'});
  }
  //controllo se la mail esiste gia
  User.getUserByEmail(newUser.email, (err, user) => {
      if(err) throw err;
      if(user){
          return res.json({success: false, msg: 'Email already exist !'});
      }
//aggiungo un utente
      User.addUser(newUser, (err,user) => {
          if(err){
              res.json({success: false, msg: 'Failed to register user'});
          } else {
            var email = {
                        from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                        to: [user.email, 'gugui3z24@gmail.com'],
                        subject: 'Your Activation Link',
                        text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:3000/users/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href=" http://localhost:3000/users/activate/' + user.temporarytoken + '"> http://localhost:3000/users/activate/</a>'
                    };
  					// Function to send e-mail to user
  					client.sendMail(email, function(err, info) {
  						if (err) console.log(err); // If error in sending e-mail, log to console/terminal
              else{
                console.log('messaggio iviato ')
              }
  					});
              res.json({success: true, msg: 'User registered'});
          }
      });
    });
  });
});

// Authenticate e l routes di autenticazione dell utente
router.post('/authenticate', (req, res, next) => {
  // memorizzo password e username inserite
  const username = req.body.username;
  const password = req.body.password;
// con questo metodo controllo la username
  User.getUserByUsername(username, (err, user) => {
    if(err) throw err;
    if(!user){
      return res.json({success: false, msg: 'User not found'});
    }
// con questo metodo controllo la password
    User.comparePassword(password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch){
        const token = jwt.sign(user, config.secret, {
          expiresIn: 604800 // tempo espresso in secondi == 1week
        });
// invio un json di risposta se vanno bene
        res.json({
          success: true,
          token: 'JWT '+token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
          }
        });
        // invio un sjon di risposta se vanno male
      } else {
        return res.json({success: false, msg: 'Wrong password'});
      }
    });
  });
});

// Profile è la routes per il conrollo del token che viene passato come secondo parametro con passport.authenticate
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
  res.json({user: req.user});//rispondo con tutto l'oggetto utente
});
router.put('/:id',passport.authenticate('jwt', {session:false}), (req, res, next) => {
    User.findOne({_id: req.params.id})
        .exec(function(err, user) {
            if(err) return res.status(500).json({error:err});
            if(!user) return res.status(404).json({message: 'Utente non trovato'})
            //faccio un for per ciclare tutti i campi dell' utente
            for(key in req.body) {
                user[key] = req.body[key];
            }
            //metodo che chiamo per aggiornare i campi dell utente
              User.upDateUser(user, (err, user) => {
                if(err){
                  res.json({success: false, msg:'hai sbagliato ad  aggiornare'});
                } else {
                  res.json({success: true, msg:'Utente aggiornato'});
                }
              });

        })
})

router.delete('/:id', function(req, res, next) {
    User.remove({_id: req.params.id}, function(err) {
        if(err) return res.status(500).json({error: err})
        res.json({message: 'Utente eliminato correttamente'})
    })
})

//Route di attivazione account

// Route to activate the user's account
   router.put('/activate/:token',passport.authenticate('jwt', {session:false}), (req, res, next) =>  {
       User.findOne({ temporarytoken: req.params.token }, function(err, user) {
           if (err) {
               // Create an e-mail object that contains the error. Set to automatically send it to myself for troubleshooting.
               var email = {
                   from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                   to: user.email,
                   subject: 'Error Logged',
                   text: 'The following error has been reported in the MEAN Stack Application: ' + err,
                   html: 'The following error has been reported in the MEAN Stack Application:<br><br>' + err
               };
               // Function to send e-mail to myself
               client.sendMail(email, function(err, info) {
                   if (err) {
                       console.log(err); // If error with sending e-mail, log to console/terminal
                   } else {
                       console.log(info); // Log success message to console if sent
                       console.log(user.email); // Display e-mail that it was sent to
                   }
               });
               res.json({ success: false, message: 'Something went wrong. This error has been logged and will be addressed by our staff. We apologize for this inconvenience!' });
           } else {
               var token = req.params.token; // Save the token from URL for verification
               // verifico se il token è valido
               jwt.verify(token, config.secret, function(err, decoded) {
                   if (err) {
                       res.json({ success: false, message: 'Activation link has expired.' }); // Token is expired
                   } else if (!user) {
                       res.json({ success: false, message: 'Activation link has expired.' }); // Token may be valid but does not match any user in the database
                   } else {
                       user.temporarytoken = false; // rimuovo il token temporaneo
                       user.active = true; // cambio actve dello schema in true
                       // salvo l'utente sul database
                       user.save(function(err) {
                           if (err) {
                               console.log(err); // If unable to save user, log error info to console/terminal
                           } else {
                               // se il salvataggio è andato a buon fine invio una mail
                               var email = {
                                   from: 'MEAN Stack Staff, cruiserweights@zoho.com',
                                   to: user.email,
                                   subject: 'Account Activated',
                                   text: 'Hello ' + user.name + ', Your account has been successfully activated!',
                                   html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Your account has been successfully activated!'
                               };
                               // Send e-mail object to user
                               client.sendMail(email, function(err, info) {
                                   if (err) console.log(err); // If unable to send e-mail, log error info to console/terminal
                               });
                               res.json({ success: true, message: 'Account activated!' }); // Return success message to controller
                           }
                       });
                   }
               });
           }
       });
   });

// Route to send user's username to e-mail
	router.get('/resetusername/:email', function(req, res) {
		User.findOne({ email: req.params.email }).select('email name username').exec(function(err, user) {
			if (err) {
				res.json({ success: false, message: err }); // Error if cannot connect
			} else {
				if (!user) {
					res.json({ success: false, message: 'La tua mail non è stata trovata' }); // Return error if e-mail cannot be found in database
				} else {
					// If e-mail found in database, create e-mail object
					var email = {
						from: 'Localhost Staff, staff@localhost.com',
						to: user.email,
						subject: 'Richiesta recupero UserName',
						text: 'Hello ' + user.name + ', recentemente hai fatto richiesta del recupero della tua username, per evitare di dimenticarla salvala in un file di testo: ' + user.username,
						html: 'Hello<strong> ' + user.name + '</strong>,<br><br>recentemente hai fatto richiesta del recupero della tua username, per evitare di dimenticarla salvala in un file di testo: ' + user.username
					};

					// Function to send e-mail to user
					client.sendMail(email, function(err, info) {
						if (err) console.log(err); // If error in sending e-mail, log to console/terminal
					});
					res.json({ success: true, message: 'La tua Username è stata inviata tramite e-mail ' }); // Return success message once e-mail has been sent
				}
			}
		});
	});



module.exports = router;
