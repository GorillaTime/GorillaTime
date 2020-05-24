var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var config = require('./config');
var fs = require('fs');

passport.use(new Strategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(token,tokenSecret,profile,cb) {
    process.nextTick(function() {
      return cb(null,profile);
    });
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});



var indexRouter = require('./routes/index');
var topPageRouter = require('./routes/top');
var oekakiRouter = require('./routes/oekaki');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var postsRouter = require('./routes/posts');

var app = express();
app.use(helmet());
app.use(express.static('public/images'));
app.use('/favicon.ico', express.static('public/images/gorilla_favicon.png'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: '1041da8f21682e99', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/',indexRouter);
//app.use('/login', loginRouter);
//app.use('/logout', logoutRouter);
app.use('/top',ensureAuthenticated,topPageRouter);
app.use('/oekaki',ensureAuthenticated,oekakiRouter);
app.use('/posts',postsRouter);

app.get('/login/twitter',
  passport.authenticate('twitter')
);

app.get('/oauth_callback',
  passport.authenticate('twitter', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  }
);
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}


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
