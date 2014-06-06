// Load express
var express = require('express');

// Instantiate application
var app = express();

// Load config from file
var config = require('./config.js');

app.get('/', function(req, res){
	res.json('Hello');
});

// Start the server
app.listen(config.port);

// Log server binding details
console.log('info', config.host + ':' + config.port);
