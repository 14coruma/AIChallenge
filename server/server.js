var express = require( 'express' );
var app = express(); 
var routes = require( './api/routes/routes' );
routes( app );

app.listen( 2306 );

//connection.end();
//exit( 0 );
