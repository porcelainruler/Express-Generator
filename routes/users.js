var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport')

var router = express.Router();

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),
     req.body.password , (err , user) => {
     if(err) {
      res.statusCode = 500 ;
      res.setHeader('Content-Type' , 'application/json');
      res.json({err : err});      
     }
     else {
       passport.authenticate('local')(req, res, () => {
        res.statusCode = 200 ;
        res.setHeader('Content-Type' , 'application/json');
        res.json({sucess: true, status : 'Registration Successfull!'});  
       });
     }
   })
});

router.post('/login' , passport.authenticate('local') , (req, res) => {
  res.statusCode = 200 ;
  res.setHeader('Content-Type' , 'application/json');
  res.json({sucess: true, status : 'You are successfully logged in!'});
})

/*  Without passport login route
router.post('/login' , (req, res, next) => {

  if(!req.session.user) {
    console.log(req.headers.authorization);
    var authHeader = req.headers.authorization;
  
    if(!authHeader){
        var err = new Error('You are not Authenticated!');
        res.setHeader('WWW-Authenticate' , 'Basic');
        err.status = 401 ;                  // Not Authenicated Error Status Code
        return next(err);                   // Call to Error handler defined in Express-Generator 
    }

    // ** First split to separate Basic and base64 encoded code and second split
    //    to separate username and password  **
    var auth = new Buffer(authHeader.split(' ')[1] , 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    User.findOne({username: username})
      .then((user) => {
        if(user.username === username  &&  user.password === password){
          req.session.user = 'authenticated'
          res.statusCode = 200 ;
          res.setHeader('Content-Type' , 'plain/text');
          res.end('You are authenticated !');
        }
        else if(user.password != password){
          var err = new Error('Your password is incorrect');
          err.status = 403 ;                  // Username or Pasword not matched error
          return next(err);                   // Call to Error handler defined in Express-Generator 
        }
        else if(user === null) {
            var err = new Error('User ' + username + ' does not exist');
            err.status = 403 ;                  // Username or Pasword not matched error
            return next(err);                   // Call to Error handler defined in Express-Generator 
        }
      })
      .catch((err) => next(err));
    
  }
  else {
    res.statusCode = 200 ;
    res.setHeader('Content-Type' , 'plain/text') ;
    res.end('You are already authenticated!')
  }

})
*/

router.get('/logout' , (req , res) => {
  if(req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in');
    err.status = 403;
    next(err);
  }
})

module.exports = router;
