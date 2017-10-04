/* routes.js Maintains the routing information for the server.
 *
 * Created by: Andrew Corum, 2 Oct 2017
 * Updated: 2 Oct 2017
 */

'use strict';
module.exports = function( app ) {
	var bodyParser = require( "body-parser" );
	app.use( bodyParser.json() ); // support json encoded bodies
	app.use( bodyParser.urlencoded( { extended: true } ) ); // encoded bodies
//	var signup = require( '../controllers/signupController' );
//	var api = require( '../controllers/apiController' );

	// signup routes
//	app.route( '/signup' )
//		.get( signup.list_instructions )
//		.post( signup.add_user );

	app.route( '/' ).get( function( req, res )
	{
		var fs = require( "fs" );
		var mainPage = fs.readFileSync( "./html/index.html", "utf-8" );
		res.send( mainPage );
	} );

	// client interaction routes
//	app.route( '/api' )
//		.get( api.timesTwo )
//		.post( api.timesTwo );

	app.use( function( req, res ) {
      res.status(404).send( { url: req.originalUrl + ' not found' } )
    } );
};

