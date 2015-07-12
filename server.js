'use strict';

//Dependencies and variables
var express = require('express'),
	app = express(),
	port = process.env.PORT || 3000;

//Set default node envoironment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

//Root Path
process.env.PWD = process.cwd();

// Initilize with config file
require('./app/config/init')(app, express);

//initilize routes
require('./app/config/routes')(app, express);

//Create server in listen on default port if exists or 3000
app.listen(port, function () {
	console.log('Bism Allah , Server runs on port ' + port);
});