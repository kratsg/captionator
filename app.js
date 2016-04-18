var config = require('./config');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var yaml = require('js-yaml');
var fs = require('fs');

var app = express();


// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
var sessionConfigs = config.services.session.express;
if(app.get('env') === 'production') {
    var FirebaseStore = require('connect-firebase')(expressSession);
    sessionConfigs.store = new FirebaseStore(config.services.session.firebase);
    sessionConfigs.resave = true;
    sessionConfigs.saveUninitialized = true;
}
app.use(expressSession(sessionConfigs));
app.use(passport.initialize());
app.use(passport.session());
require('./services/passport')(passport);

var Firebase = require('firebase');
var firebaseRef = new Firebase(config.services.firebase.project);
require('./config/firebase')(firebaseRef, function(playName, text){
    console.log('Writing a play: ', playName);
    fs.writeFileSync('./data/'+playName+'.yml',text);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
    req.yaml = yaml;
    req.fs = fs;
    res.locals = {user: req.user, url: req.url};
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.locals.pretty = true;
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
