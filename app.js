var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
var logger = require('morgan');
const userManagement = require('express-user-management');

const config = require('./config.json');

var detectorRouter = require('./routes/detector');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : config.imageUploadPath,
  limits: { fileSize: 50 * 1024 * 1024 }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

userManagement.init(app, 
  {
    activationRequired: false, 
    jwtSecret: 'fqPOqNPuPaZHkTC701kRTD0JxHSwBTdeKsGzXSy7UrRB0V0F22z0wkpCw2mWJC3',
    mongoUrl: 'mongodb://localhost:27017/cm_forenser'
  }
);
// TODO: "C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="E:\workspace\final_thesis\cm_forenser\mongo_db_dir"; add this to npm run and config

app.use('/detect', detectorRouter);

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
