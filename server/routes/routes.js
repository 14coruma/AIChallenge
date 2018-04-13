/* routes.js Maintains the routing information for the server.
 *
 * Created by: Andrew Corum, 2 Oct 2017
 */

'use strict';
var session = require( 'express-session' );
var bodyParser = require( "body-parser" );
var fs = require( "fs" );

var blocks = require( '../controllers/htmlBlocks.js' );
var signup = require( '../controllers/signup' );
var gameManager = require( '../controllers/gameManager' );
var login = require( '../controllers/login' );

module.exports = function( app ) {
	app.use( bodyParser.json() ); // support json encoded bodies
	app.use( bodyParser.urlencoded( { extended: true } ) ); // encoded bodies
	app.use( session( {
		secret: 'work hard',
		resave: true,
		saveUninitialized: false,
	} ) );

	/*
	 * HTML Page Routs
	 */
	// signup
	app.route( '/signup' )
		.get( signup.list_instructions )
		.post( signup.add_user );

	// login
	app.route( '/login' )
		.get( login.show_login_page )
		.post( login.loginUser );

	// watch
	app.route( '/watch' ).get( function( req, res ) {
		var html = fs.readFileSync( "./public/html/watch.html", "utf-8" );
		var blockTypes = [ "navbar" ];
		html = blocks.loadBlocks( req, html, blockTypes );
		res.send( html );
	} );

	// play
	app.route( '/play' ).get( function( req, res ) {
		var html = fs.readFileSync( "./public/html/play.html", "utf-8" );
		var blockTypes = [ "navbar" ];
		html = blocks.loadBlocks( req, html, blockTypes );
		res.send( html );
	} );
 
	// home
	app.route( '/' ).get( function( req, res ) {
		var html = fs.readFileSync( "./public/html/index.html", "utf-8" );
		var blockTypes = [ "navbar" ];
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
};

