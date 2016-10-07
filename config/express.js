
/**
 * Express 관련 설정.
 */

var session = require('express-session');
var compression = require('compression'); //압축모듈
var morgan = require('morgan');
var path = require('path');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

/*var swig = require('swig');
var csrf = require('csurf'); //csrf 토큰 모듈*/
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var MongoStore  = require('connect-mongo')(session);
var winston = require('winston');
var config = require('./config');
var pkg = require('../package.json');
var env = process.env.NODE_ENV || 'development';
var expressValidator = require('express-validator');
var options = [{
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
},{
  customValidators: {
    isArray: function(value) {
      return Array.isArray(value);
    },
    gte: function(param, num) {
      return param >= num;
    },
    isDate:function(d){
      console.log('data ' , d);
      if ( Object.prototype.toString.call(d) === "[object Date]" ) {
        // it is a date
        if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
          return false
        }
        else {
          return true
        }
      }
      else {
        return false;
      }
    }
  }
}];
/**
 * Expose
 */

module.exports = function (app, passport) {

  //압축모듈사용
  app.use(compression({
    threshold: 512
  }));

  //winston use
  var log;
  if (env !== 'development') {
    log = {
      stream: {
        write: function (message, encoding) {
          winston.info(message);
        }
      }
    };
  } else {
    log = 'dev';
  }

  app.set('views', path.join(appRoot, 'views'));
  app.set('view engine', 'jade');
  var myMorgan = morgan('combined', {
    skip : function(req, res) { return res.statusCode < 100 }
  });
  app.use(myMorgan);

// bodyParser should be above methodOverride
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false}));
  app.use(expressValidator([options]));
  app.use(cookieParser());
  app.use(cookieSession({ secret: pkg.name }));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: pkg.name,
    store: new MongoStore({
      url: config.db,
      "clear_interval": 3600
    })
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  // expose package.json to views
  app.use(function (req, res, next) {
    res.locals.pkg = pkg;
    res.locals.env = env;
    next();
  });


  app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  }));

  // 쿠키파서, 세션 사용



  //passport session



/*
  app.use(csrf()); // csrf 사용..
  //app.use(express.csrf())
  app.use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    next();
   });*/

};
