/* routes.js Maintains the routing information for the server.
 *
 * Created by: Andrew Corum, 2 Oct 2017
 */

'use strict';

module.exports = function( app ) {
	var bodyParser = require( "body-parser" );
	app.use( bodyParser.json() ); // support json encoded bodies
	app.use( bodyParser.urlencoded( { extended: true } ) ); // encoded bodies
	var signup = require( '../controllers/signup' );
	var gameManager = require( '../controllers/gameManager' );

	// signup
	app.route( '/signup' )
		.get( signup.list_instructions )
		.post( signup.add_user );

	// api/startGame
	//app.route( '/api/startGame' )
	//	.post( gameManager.startGame );

	// home
	app.route( '/' ).get( function( req, res ) {
		var fs = require( "fs" );
		var mainPage = fs.readFileSync( "./public/html/index.html", "utf-8" );
		res.send( mainPage );
	} );

	// URL not found
	app.use( function( req, res ) {
      res.status(404).send( { url: '404' + req.originalUrl + ' not found' } )
    } );
};

