var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var helmet = require('helmet');
var session = require('express-session');
var passport = require('passport');

var GitHubStrategy = require('passport-github2').Strategy;
var GITHUB_CLIENT_ID = '9fe2dcc3d90d7f19ad39';
var GITHUB_CLIENT_SECRET = 'b99567e8985600f691f3df6e5d36d2661b357901';

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});


passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:8000/auth/github/callback'
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

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
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/top',ensureAuthenticated,topPageRouter);
app.use('/oekaki',ensureAuthenticated,oekakiRouter);
app.use('/posts',postsRouter);

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }),
  function (req, res) {
});

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function (req, res) {
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
