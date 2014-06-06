var config = {};

config.env = process.env.NODE_ENV || 'development';

config.host = process.env.HOST || '0.0.0.0';
config.port = process.argv[2] || process.env.PORT || 9000;

// Secrets
// -------

config.secret = {};

// #### Session Secret ####

// **Important!** 
// On change, all active user sessions will become unavailable, 
// ie. all users should login againg to use application.

config.secret.session = 'Secret for session';


// Expose
// ------

module.exports = config;
