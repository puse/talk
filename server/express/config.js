var config = {};

config.env = process.env.NODE_ENV || 'development';

config.host = process.env.HOST || '0.0.0.0';
config.port = process.argv[2] || process.env.PORT || 9000;

// Sessions
// --------

var session = {};

// Change name of cookies to not expose information about software (Express/Connect)
session.name = 'session.sid';

// Ensure cookies can only be sent over HTTPS
// and there is no script access to the cookie client side.
session.cookie = { 
    httpOnly: true, 
    secure: true 
};

// Trust the reverse proxy (nginx).
// This requires `X-Forwarded-Proto` header to be set on nginx.
session.proxy = true;

// Passphrase to sign cookies with.
// **Important!** 
// On change, all active user sessions will become unavailable, 
// ie. all users should login again to use application.

session.secret = 'Anna Sedokova';

config.session = session;


// Database connections
// --------------------

config.redis = process.env.REDIS_URL || 'redis://127.0.0.1:6379';



// Expose
// ------

module.exports = config;
