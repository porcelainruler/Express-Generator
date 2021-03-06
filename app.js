var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoriteRouter = require('./routes/favoriteRouter');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');

const url = config.mongoUrl;
const connect = mongoose.connect(url , {
  useMongoClient: true
});

connect.then((db) => {
  console.log('Connected correctly to the Server');
} , (err) => { console.log(err); });

var app = express();

app.all('*' , (req , res , next) => {
  if(req.secure) {
    return next();
  }
  else {
    res.redirect(307 , 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// app.use(cookieParser('12345-67890-09876-54321'));        // Signed Cookie
/*
app.use(session({
  name: 'session-id' ,
  secret: '12345-67890-09876-54321' ,
  saveUninitialized: false ,
  resave: false ,
  store: new FileStore()
}))
*/

app.use(passport.initialize());
// app.use(passport.session());        // Adds user method in req  ** Now we are using tokens not session **

app.use('/', indexRouter);
app.use('/users', usersRouter);


/*   *** Now in tokens we require auth on only certain routes which is implemented diff. ***
function auth(req , res , next) {
    if(!req.user) {
          var err = new Error('You are not Authenticated!');
          err.status = 403 ;                  // Forbidden
          return next(err);                   // Call to Error handler defined in Express-Generator 
    }
    else {
        next();
    }
}

app.use(auth);                               // To Authenticate before accessing static resources
                                             // and various routes
*/

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
app.use('/promos', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);
app.use('/favorites', favoriteRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

/* Cookie Part
function auth(req , res , next) {
  console.log(req.signedCookies);

  if(!req.signedCookies.reguser) {
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

    if(username === 'admin'  &&  password === 'password'){
        res.cookie('reguser' , 'admin' , {signed : true});
        next();                             // Existing User is allowed to passthrough to next middleware
    }
    else {
        var err = new Error('You are not Authenticated!');
        res.setHeader('WWW-Authenticate' , 'Basic');
        err.status = 401 ;                  // Username or Pasword not matched error
        return next(err);                   // Call to Error handler defined in Express-Generator 
    }
  }
  else {
    if(req.signedCookies.reguser === 'admin'){
      next();
    }
    else {
      var err = new Error('You are not Authenticated!');
      err.status = 401 ;                  // Username or Pasword not matched error
      return next(err);                   // Call to Error handler defined in Express-Generator     
    }
  }


  
}
*/
