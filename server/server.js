/* server.js runs the main nodejs express server for AIChallenge
 *
 * Created by: Andrew Corum: 2 Oct 2017
 */

var express = require( 'express' );
var app = express(); 
var routes = require( './api/routes/routes' );

app.use(express.static('public'));
routes( app );

app.listen( 8000 );
