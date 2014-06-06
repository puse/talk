// Loading dependencies
// --------------------

// Express
var express = require('express');

// Middleware
var morgan          = require('morgan'),
    bodyParser      = require('body-parser'),
    methodOverride  = require('method-override'),
    cookieParser    = require('cookie-parser'),
    flash           = require('connect-flash'),
    csrf            = require('csurf'),
    session         = require('express-session');

// Session store
var RedisStore      = require('connect-redis')(session);

// Configuration
var config = require('./config.js');

// ....
// ----

// Instantiate application
var app = express();

// Setup middleware
// ----------------

// #### Logging to stdout ####

// Add logging support, with `'dev'` for colors
app.use(morgan('dev'));

// #### Parse `request` data ####

// Parse request bodies, both **json** and **urlencoded**
app.use(bodyParser());

// More *verbose* HTTP methods faking, for `PUT` and `DELETE` support
app.use(methodOverride());

// #### Sessions ####

var sessionOptions = config.session;

sessionOptions.store = new RedisStore({ url: config.redis });

// Initialize cookie parser
app.use(cookieParser());

// Load session middleware
app.use(session(sessionOptions));

// #### Misc. ####

// flash data
app.use(flash());

// anti-forgery middleware
app.use(csrf());




app.get('/', function(req, res){
    console.log(req.session);
    res.json('Hello');
});

// Start the server
app.listen(config.port);

// Log server binding details
console.log('info', config.host + ':' + config.port);
