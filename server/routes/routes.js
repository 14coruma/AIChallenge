/* routes.js Maintains the routing information for the server.
 *
 * Created by: Andrew Corum, 2 Oct 2017
 */

'use strict';

module.exports = function( app ) {
	var fs = require( "fs" );
	var bodyParser = require( "body-parser" );
	app.use( bodyParser.json() ); // support json encoded bodies
	app.use( bodyParser.urlencoded( { extended: true } ) ); // encoded bodies
	var signup = require( '../controllers/signup' );
	var gameManager = require( '../controllers/gameManager' );

	// signup
	app.route( '/signup' )
		.get( signup.list_instructions )
		.post( signup.add_user );

	// watch
	app.route( '/watch' ).get( function( req, res ) {
		let watchPage = fs.readFileSync( "./public/html/watch.html", "utf-8" );
		res.send( watchPage );
	} );

	// get a list of live games
	app.route( '/liveGames' ).get( function( req, res ) {
		gameManager.getLiveGames( res );
	} );

	// home
	app.route( '/' ).get( function( req, res ) {
		let mainPage = fs.readFileSync( "./public/html/index.html", "utf-8" );
		res.send( mainPage );
	} );

	// files
	app.route( '/files/:type/:name' ).get( function( req, res ) {
		let file = fs.readFileSync( "./public/" + req.params.type + "/" + req.params.name, "utf-8" );
		res.send( file );
	} );

	// URL not found
	app.use( function( req, res ) {
      res.status( 404 ).send( { url: '404' + req.originalUrl + ' not found' } )
    } );
};

