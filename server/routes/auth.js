const express = require('express');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const crypto = require('crypto')
const connection = require('../connection')
const router = express.Router();
// const salt = '10'
const salt = 10
var hashed_password = null
var hashedPassword = null
 
 
passport.use(new LocalStrategy(function verify(username, password, cb) {
  query = 'SELECT * FROM clients WHERE username = ?' 
  connection.query(query, [ username, ], function(err, row) {
  // db.get('SELECT * FROM clients WHERE username = ?', [ username ], function(err, row) {

   if (err) { return cb(err); }
   if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

   crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
     if (err) { return cb(err); }
     if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
       return cb(null, false, { message: 'Incorrect username or password.' });
     }
     return cb(null, row);
   });
 });
}));

passport.serializeUser(function(client, cb) {
 process.nextTick(function() {
   cb(null, { id: client.client_id, username: client.username });
 });
});

passport.deserializeUser(function(client, cb) {
 process.nextTick(function() {
   return cb(null, client);
 });
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login/password', passport.authenticate('local', {
 successRedirect: '/',
 failureRedirect: '/login'
}));

module.exports = router;


// passport.use(new LocalStrategy(function verify(username, password, cb) {
//   query = 'SELECT * FROM drivers WHERE username = ?' 
//   connection.query(query, [ username ], function(err, row) {
//     if (err) { 
//       // return cb(err);
//       res.send({err : err}) 
//     }
//     // if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
//     if (!row) { res.send({message: "Wrong username or password"})}

//     crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//       if (err) { 
//         // return cb(err);
//         res.send({err : err}) 
//        }
//       if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
//         // return cb(null, false, { message: 'Incorrect username or password.' });
//         res.send({message: "Wrong username or password"})
//       }
//       return cb(null, row);
//     });
//   });
// }));

// router.post('/login/password', passport.authenticate('local', {
//  successRedirect: '/',
//  failureRedirect: '/login'
// }));