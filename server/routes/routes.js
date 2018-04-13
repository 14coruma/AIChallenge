/* routes.js Maintains the routing information for the server.
 *
 * Created by: Andrew Corum, 2 Oct 2017
 */ 
'use strict';
var session = require( 'express-session' );
var bodyParser = require( "body-parser" );
var fs = require( "fs" );

var site = require( '../controllers/siteManager' );
var blocks = require( '../controllers/htmlBlocks.js' );
var signup = require( '../controllers/signup' );
var gameManager = require( '../controllers/gameManager' );
var login = require( '../controllers/login' );

// Create session
module.exports = function( app ) {
	app.use( bodyParser.json() ); // support json encoded bodies
	app.use( bodyParser.urlencoded( { extended: true } ) ); // encoded bodies
	app.use( session( {
		secret: 'work hard',
		resave: true,
		saveUninitialized: false, } ) );

	// login (has precendence even over maintenance page)
	app.route( '/login' )
		.get( function( req, res ) {
			var html = fs.readFileSync( "./public/html/login.html", "utf-8" );
			var blockTypes = [ "navbar", "googleAnalytics" ];
			html = blocks.loadBlocks( req, html, blockTypes );
			res.send( html );
		} )
		.post( login.loginUser );
	app.route( '/logout' )
		.get( function( req, res ) {
			req.session.regenerate( function( err ) { res.redirect( "/" ); } );
		} );

	// Check if site is in matenance mode
	site.maintenanceMode( function( maintenanceMode ) {
		if ( maintenanceMode === "true" ) {
			app.use( function( req, res ) {
				var html = fs.readFileSync( "./public/html/maintenance.html", "utf-8" );
				var blockTypes = [ "navbar", "googleAnalytics" ];
				html = blocks.loadBlocks( req, html, blockTypes );
				res.status( 503 ).send( html );
			} );
		} else {
		/*
		 * HTML Page Routs
		 */
		// signup
		app.route( '/signup' )
			.get( function( req, res ) {
				var html = fs.readFileSync( "./public/html/signup.html", "utf-8" );
				var blockTypes = [ "navbar", "googleAnalytics" ];
				html = blocks.loadBlocks( req, html, blockTypes );
				res.send( html );
			} )
			.post( signup.add_user );

		// watch
		app.route( '/watch' ).get( function( req, res ) {
			var html = fs.readFileSync( "./public/html/watch.html", "utf-8" );
			var blockTypes = [ "navbar", "googleAnalytics" ];
			html = blocks.loadBlocks( req, html, blockTypes );
			res.send( html );
		} );

		// play
		app.route( '/play' ).get( function( req, res ) {
			var html = fs.readFileSync( "./public/html/play.html", "utf-8" );
			var blockTypes = [ "navbar", "googleAnalytics" ];
			html = blocks.loadBlocks( req, html, blockTypes );
			res.send( html );
		} );
	 
		// home
		app.route( '/' ).get( function( req, res ) {
			var html = fs.readFileSync( "./public/html/index.html", "utf-8" );
			var blockTypes = [ "navbar", "googleAnalytics" ];
			html = blocks.loadBlocks( req, html, blockTypes );
			res.send( html );
		} );

		/*
		 * API Routes
		 */
		// get a list of live games
		app.route( '/api/liveGames/:action' ).get( function( req, res ) {
			gameManager.liveGames( req, res );
		} );

		// get a list of game types
		app.route( '/api/games' ).get( function( req, res ) {
			gameManager.listGames( req, res );
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
	} } );
};

