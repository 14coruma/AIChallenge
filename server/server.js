var express = require( 'express' );
var app = express(); 
var routes = require( './api/routes/routes' );
routes( app );

var signup = require( './api/controllers/signup' );

app.listen( 2306 );

//connection.end();
//exit( 0 );
