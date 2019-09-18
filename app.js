var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//routes
var learnMoreRouter = require('./routes/learnMore');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var confirmationRouter = require('./routes/confirmation');
var confirmationFailRouter = require('./routes/confirmationFail');

var app = express();


// //Mongoose promise
mongoose.Promise = global.Promise;
//connecting to local db
mongoose.connect("mongodb://localhost:27017/sandbox");

//schema for the user
var parentSchema = new mongoose.Schema({
  parentName: String,
  email: String,
  kidsName: String,
  kidsAge: String,
  kidsSchool: String
});

//schema for time
var timeSchema = new mongoose.Schema({
  date:String,
  time: String
});

//mongoose model parameters are (collecitonName, schemaName)
//note that collectionName automatically gets an 's' added on to it unless specified not to
var Information = mongoose.model("informaton", parentSchema);

var dateInformation = mongoose.model("date",timeSchema);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/learnMore', learnMoreRouter);
app.use('/confirmationPage', confirmationRouter);
app.use('/confirmationFail', confirmationFailRouter);

app.post("/informationAPI", (req,res) => {
  var lessonDate = new Information(req.body);
  lessonDate.save().then( item => {
   console.log("Information is SUCCESSFULLY saved in the database.")
 // res.status(200).send("Information is SUCCESSFULLY saved in the database.");

  }).catch( err => {
    res.status(400).send("There is an issue with sending this information to the database.")
  })

  });

app.post("/dateAPI", (req,res) => {
  var dateVar = new dateInformation(req.body);
  dateVar.save().then( item => {
    res.redirect('/confirmationPage');
  }).catch( err => {
    res.status(400).res.redirect('/confirmationFail');
  })
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(req,res,next) {
  next(createError(504));
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
