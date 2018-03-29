const http = require('http'),
      path = require('path'),
      methods = require('methods'),
      express = require('express'),
      bodyParser = require('body-parser'),
      passport = require('passport'),
      mongoose = require('mongoose'),
      morgan = require('morgan'),
      session = require('exress-session'),
      fs = require('fs'),
      errorHandler = require('errorhandler')

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'pomodoro', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if (!isProduction) {
  app.use(errorHandler());
}

if (isProduction) {
  mongoose.connect(process.env.MONGODB_URI);
} else {
  mongoose.connect('mongodb://localhost/pomotimer');
  mongoose.set('debug', true);
}

require('./models/User');

app.use(require('./routes'));

// catch 404 and forward to error handler
app.use( (req, res, next) => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
})

// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use( (err, req, res, next) => {
    console.log(err.stack);
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
        error: err
      }
    });
  });
}

// production error handler
// no stack traces leaked to user
app.use( (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
});

const server = app.listen( process.env.PORT || 3000, function() {
  console.log('Listening on port ' + sercer.address().port);
});
