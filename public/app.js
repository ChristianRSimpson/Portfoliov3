/// reference path="_reference.ts" />
(function () {
    var mainModuleName = "app";
    var app = angular.module(mainModuleName, ['ngRoute', 'ngResource']);
    //wait until the document loads
    angular.element(document).ready(function () {
        // manually boostrap angular 
        angular.bootstrap(document, [mainModuleName]);
    });
    // Todos Service +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    app.factory('Todos', ['$resource', function ($resource) {
            return $resource('/todos/:id', null, {
                'update': { method: 'PUT' }
            });
        }]);
    // Controllers ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    app.controller('TodoController', ['$scope', 'Todos', function ($scope, Todos) {
            $scope.editing = [];
            $scope.username = '';
            $scope.userTodos = [];
            $scope.setUserName = function (userName) {
                $scope.username = userName; //get the username
                $scope.todos = Todos.query(function () {
                    $scope.userTodos = []; // reset the userTodos array
                    $scope.todos.forEach(function (todo) {
                        if (todo.username == $scope.username) {
                            $scope.userTodos.push(todo);
                        }
                    });
                    $scope.todos = $scope.userTodos;
                });
            };
            $scope.save = function () {
                if (!$scope.newTodo || $scope.newTodo.length < 1) {
                    return;
                }
                var todo = new Todos({ name: $scope.newTodo, username: $scope.username, completed: false });
                todo.$save(function () {
                    $scope.todos.push(todo);
                    $scope.newTodo = ''; // clear textbox
                });
            };
            $scope.update = function (index) {
                var todo = $scope.todos[index];
                Todos.update({ id: todo._id }, todo);
                $scope.editing[index] = false;
            };
            $scope.edit = function (index) {
                $scope.editing[index] = angular.copy($scope.todos[index]);
            };
            $scope.cancel = function (index) {
                $scope.todos[index] = angular.copy($scope.editing[index]);
                $scope.editing[index] = false;
            };
            $scope.remove = function (index) {
                var todo = $scope.todos[index];
                Todos.remove({ id: todo._id }, function () {
                    $scope.todos.splice(index, 1);
                });
                $scope.editing[index] = false;
            };
            $scope.remainingTodos = function () {
                var count = 0;
                angular.forEach($scope.todos, function (todo) {
                    if ($scope.username == todo.username) {
                        count += todo.completed ? 0 : 1;
                    }
                });
                return count;
            };
            $scope.totalTodos = function () {
                var count = 0;
                angular.forEach($scope.todos, function (todo) {
                    if ($scope.username == todo.username) {
                        count++;
                    }
                });
                return count;
            };
        }]);
    app.controller('TodoDetailCtrl', ['$scope', '$routeParams', 'Todos', '$location',
        function ($scope, $routeParams, Todos, $location) {
            $scope.todo = Todos.get({ id: $routeParams.id });
            $scope.update = function () {
                Todos.update({ id: $scope.todo._id }, $scope.todo, function () {
                    $location.url('/');
                });
            };
            $scope.remove = function () {
                Todos.remove({ id: $scope.todo._id }, function () {
                    $location.url('/');
                });
            };
            $scope.cancel = function () {
                $location.url('/');
            };
        }]);
    // Routes ++++++++++++++++++++++++++++++++++++++++++++++++++++++
    app.config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', {
                templateUrl: '/todos.html',
                controller: 'TodoController'
            })
                .when('/:id', {
                templateUrl: '/todoDetails.html',
                controller: 'TodoDetailCtrl'
            });
        }]);
})();
//# sourceMappingURL=app.js.map
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
var DB = require('./config/db.js');
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


var app = express();

// passport configuration
require('./server/config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
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
