const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect To Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});
const app = express();
//con cors permetto a tutti i domini di raggiungere le mie routes
app.use(cors());

// Set Static Folder mi serve per creare ANgular 2
app.use(express.static(path.join(__dirname, 'public')));

//alla costante users inserisco il percorso delle mie routes
const users = require('./routes/users');

//body-parser mi parsa i dati in entrata tipo json
app.use(bodyParser.json());

// Passport Middleware è una libreria che mi crea il token con una strategia
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

const port=3000;
//richiamo le routes create
app.use('/users', users);


//index routes
app.get('/',(req,res)=>{
  res.send('invalid end point');
})
//tutte le route passanno da index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

//start serve
app.listen(port ,()=>{
  console.log('server listening on port '+port);
})
