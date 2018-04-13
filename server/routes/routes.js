/* routes.js Maintains the routing information for the server.
 *
 * Created by: Andrew Corum, 2 Oct 2017
 */

'use strict';
var session = require( 'express-session' );
var handlebars = require( 'handlebars' );

module.exports = function( app ) {
	var fs = require( "fs" );
	var bodyParser = require( "body-parser" );
	app.use( bodyParser.json() ); // support json encoded bodies
	app.use( bodyParser.urlencoded( { extended: true } ) ); // encoded bodies
	var signup = require( '../controllers/signup' );
	var gameManager = require( '../controllers/gameManager' );
	var login = require( '../controllers/login' );

	app.use( session( {
		secret: 'work hard',
		resave: true,
		saveUninitialized: false,
	} ) );

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
		let watchPage = fs.readFileSync( "./public/html/watch.html", "utf-8" );
		res.send( watchPage );
	} );

	// play
	app.route( '/play' ).get( function( req, res ) {
		let playPage = fs.readFileSync( "./public/html/play.html", "utf-8" );
		res.send( playPage );
	} );
 
	// get a list of live games
	app.route( '/api/liveGames/:action' ).get( function( req, res ) {
		gameManager.liveGames( req, res );
	} );

	// get a list of game types
	app.route( '/api/games' ).get( function( req, res ) {
		gameManager.listGames( req, res );
	} );

	// home
	app.route( '/' ).get( function( req, res ) {
		var html = "";
		var mainPage = fs.readFileSync( "./public/html/index.html", "utf-8" );
		var template = handlebars.compile( mainPage );
		if ( req.session.authenticated == true ) {
			var context = { user: req.session.username };
			html = template( context );
		} else {
			var context = { user: "Login" };
			html = template( context );
		}
		res.send( html );
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

