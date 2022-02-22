var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var logs = require('./models/logs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var fileUpload = require('express-fileupload');


var app = express();


var body = require('body-parser');
var jsonParser = body.json();
var urlencoded = body.urlencoded({extended:false});

var sessions = require('express-session');
app.use(sessions({
  saveUninitialized:true,
  secret:process.env.SECRET,
  resave:false
}));

app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:'/tmp/'
}));



var secuencesRouter = require('./routes/secuences');
var secuencePageRouter = require('./routes/secuencePage');
var createUserRouter = require('./routes/createUser');
var adminLogsRouter = require('./routes/admin/logs');
var adminConnectedRouter = require('./routes/admin/connected');
var createSecuenceRouter = require('./routes/user/createSecuence');
var makeAdminRouter = require('./routes/admin/makeAdmin');


adminSecured = async(req, res, next)=>{
  try{
    if (req.session.admin) {
      next();
    }else{
      logs.createLog(req, 'unknown', 'insecure admin log')
      res.redirect('/')
    }
  }catch (error){
    console.log(error);
  }
}

userSecured = async(req, res, next)=>{
  try {
    if(req.session.username){
      next();
    }else{
      logs.createLog(req, 'unknown', 'insecure user log')
      res.redirect('/');
    }
  }catch (error){
    console.log(error);
  }
}



//handlebars registerHelpers

var hbs = require('hbs');


hbs.registerHelper('if_exists', function(a, b){
  if (a != null && a != ''){
    return b.fn(this);
  }else{
    return b.inverse(this);
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/secuences',secuencesRouter);
app.use('/secuencePage', secuencePageRouter);
app.use('/createUser', createUserRouter);
app.use('/index', indexRouter);
app.use('/admin/logs', adminSecured, adminLogsRouter);
app.use('/admin/connected', adminSecured, adminConnectedRouter);
app.use('/user/createSecuence', userSecured, createSecuenceRouter)
app.use('/admin/makeAdmin', adminSecured, makeAdminRouter);
app.use('/logout', userSecured)

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
