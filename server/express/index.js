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

// Instantiate application
// -----------------------

var app = express();

app.enable('trust proxy');
app.disable('x-powered-by');

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

// on regular requests, supply CSRF token and FLASH data to locals
app.use(function(req, res, next){
    if (req.xhr) return next();

    // supply FLASH data
    res.locals.errors = req.flash('errors').pop();
    res.locals.inputs = req.flash('inputs').pop();

    // make token visible in templates
    res.locals._csrf = req.csrfToken();

    next();
});

// Security headers, as suggested at Recx post and implemented in `helmet` lib
// Check: 
// - <http://recxltd.blogspot.com/2012/03/seven-web-server-http-headers-that.html>
// - <https://www.owasp.org/index.php/List_of_useful_HTTP_headers>

app.use(function(req, res, next){
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-FRAME-OPTIONS', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=15768000');

    next();
});


app.get('/', function(req, res){
    console.log(req.session);
    res.json('Hello');
});

// Start the server
app.listen(config.port);

// Log server binding details
console.log('info', config.host + ':' + config.port);
