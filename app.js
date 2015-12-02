// Registering npm modules
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//additions for authentication
var mongoose = require('mongoose');
var flash = require('connect-flash');
var passport = require('passport');

//DB Setup 
var DB = require('./server/config/db.js');
mongoose.connect(DB.url);
mongoose.connection.on('error', function(){
  console.error('MongoDB Connection Error');
});

var routes = require('./server/routes/index');
var users = require('./server/routes/users');
var projects = require('./server/routes/projects');
var about = require('./server/routes/about');
var contact = require('./server/routes/contact');
var services = require('./server/routes/services');
var todos = require('./server/routes/todos');

var app = express();

// passport configuration
require('./server/config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, './server/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'someSecret',
  saveUninitialized: true,
  resave: true
})
);

// more authentication configuration
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/users', users);
app.use('/', projects);
app.use('/', about);
app.use('/', contact);
app.use('/', services);
app.use('/todoList', todos);

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
