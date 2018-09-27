var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var users = require('./routes/users');
var session = require("express-session");
var MongoStore=require('connect-mongo')(session);
var db = require('./db');
var app = express();
var ueditor = require("ueditor")

var ejs=require('ejs');
app.engine('html',ejs.__express);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json());
app.use("/ueditor/ue", ueditor(path.join(__dirname, 'public'), function(req, res, next) {
// ueditor 客户发起上传图片请求
    if(req.query.action === 'uploadimage'){
        var foo = req.ueditor;
        var date = new Date();
        var imgname = req.ueditor.filename;
        var img_url = '/images/ueditor/';
        res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }
//  客户端发起图片列表请求
    else if (req.query.action === 'listimage'){
        var dir_url = '/images/ueditor/';
        res.ue_list(dir_url);  // 客户端会列出 dir_url 目录下的所有图片
    }
// 客户端发起其它请求
    else {
         res.setHeader('Content-Type', 'application/json');
         res.redirect('/ueditor/ueditor.config.json')
    }})); 

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
 app.use(logger('dev'));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    useNewUrlParser: true,
    resave: false, 
    saveUninitialized: true, 
    secret:"zhoujie",
    store:new MongoStore({
    mongooseConnection:db.dbCon
    })
}));
// error handlers
app.use(function(req,res,next){
//    res.locals.user=req.session.user;
    var err=req.session.error;
    var success=req.session.success;
    var user=req.session.user;
    var mess=req.session.message;
    delete req.session.success;
    delete  req.session.error;
    delete  req.session.message;
    if(err){
        res.locals.message="*"+err;
    }
    if(mess){
        res.locals.message="*"+mess;
    }
    if(success){
        res.locals.success=success;
    }
    if(user){
        res.locals.user=user.name;
    }
    next();
});
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



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
