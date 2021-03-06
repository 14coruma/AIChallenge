/* routes.js Maintains the routing information for the server.
 *
 * Created by: Andrew Corum, 2 Oct 2017
 */ 
'use strict';
var session = require( 'express-session' );
var mysqlStore = require( 'express-mysql-session' )( session );
var bodyParser = require( "body-parser" );
var fs = require( "fs" );

var site = require( '../controllers/siteManager' );
var blocks = require( '../controllers/htmlBlocks.js' );
var signup = require( '../controllers/signup' );
var gameManager = require( '../controllers/gameManager' );
var login = require( '../controllers/login' );

module.exports = function( app ) {
	app.use( bodyParser.json() ); // support json encoded bodies
	app.use( bodyParser.urlencoded( { extended: true } ) ); // encoded bodies
	// Create mysql session store
	var options = {
		host: 'localhost',
		port: 3306,
		user: 'session',
		password: 'password',
		database: 'AIChallenge',
	};
	var sessionStore = new mysqlStore( options );

	// Create session
	app.use( session( {
		secret: 'work hard',
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
	} ) );

	// Admin controls have highest priority
	app.route( '/admin/maintenance' )
		.get( function( req, res ) {
			if ( req.session.userID == 1 ) {
				site.toggleMaintenanceMode( function() {
					res.redirect( "/" );
				});
			} else {
				res.redirect( "/" );
			}
		} );

	app.route( '/admin/users' )
		.get( function( req, res ) {
			if ( req.session.userID == 1 ) {
				var html = fs.readFileSync( "./public/html/users.html", "utf-8" );
				var blockTypes = [ "navbar", "users" ];
				blocks.loadBlocks( req, res, sessionStore, html, blockTypes, function( html ) {
					res.send( html );
				} );
			} else {
				res.redirect( "/" );
			}
		} );

	/*
	 * HTML Page Routs
	 */
	// signup
	app.route( '/signup' )
		.get( function( req, res ) {
			var html = fs.readFileSync( "./public/html/signup.html", "utf-8" );
			var blockTypes = [ "navbar", "footer", "googleAnalytics" ];
			blocks.loadBlocks( req, res, sessionStore, html, blockTypes, function( html ) {
				res.send( html );
			} );
		} )
		.post( signup.add_user );

	// login
	app.route( '/login' )
		.get( function( req, res ) {
			var html = fs.readFileSync( "./public/html/login.html", "utf-8" );
			var blockTypes = [ "navbar", "footer", "googleAnalytics" ];
			blocks.loadBlocks( req, res, sessionStore, html, blockTypes, function( html ) {
				res.send( html );
			} );
		} )
		.post( login.loginUser );
	app.route( '/logout' )
		.get( function( req, res ) {
			req.session.regenerate( function( err ) { res.redirect( "/" ); } );
		} );

	// watch
	app.route( '/watch' ).get( function( req, res ) {
		var html = fs.readFileSync( "./public/html/watch.html", "utf-8" );
		var blockTypes = [ "navbar", "footer", "googleAnalytics" ];
		blocks.loadBlocks( req, res, sessionStore, html, blockTypes, function( html ) {
			res.send( html );
		} );
	} );

	// play
	app.route( '/play' ).get( function( req, res ) {
		var html = fs.readFileSync( "./public/html/play.html", "utf-8" );
		var blockTypes = [ "navbar", "footer", "googleAnalytics", "hiddenCreds" ];
		blocks.loadBlocks( req, res, sessionStore, html, blockTypes, function( html ) {
			res.send( html );
		} );
	} );
 
	// starters
	app.route( '/starters/:game' ).get( function( req, res ) {
		var page = req.params.game == "main" ? "starters.html" : req.params.game + ".html"
		var html = fs.readFileSync( "./public/html/" + page, "utf-8" );
		var blockTypes = [ "navbar", "footer", "googleAnalytics" ];
		blocks.loadBlocks( req, res, sessionStore, html, blockTypes, function( html ) {
			res.send( html );
		} );
	} );

	// home
	app.route( '/' ).get( function( req, res ) {
		var html = fs.readFileSync( "./public/html/index.html", "utf-8" );
		var blockTypes = [ "navbar", "footer", "googleAnalytics" ];
		blocks.loadBlocks( req, res, sessionStore, html, blockTypes, function( html ) {
			res.send( html );
		} );
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

	// favicon
	app.route( '/favicon.ico' ).get( function( req, res ) {
		let file = fs.readFileSync( "./public/images/favicon.ico" );
		res.send( file );
	} );

	// URL not found
	app.use( function( req, res ) {
		req.route = { path: '' };
		var html = fs.readFileSync( "./public/html/404.html", "utf-8" );
		var blockTypes = [ "navbar", "googleAnalytics" ];
		blocks.loadBlocks( req, res, sessionStore, html, blockTypes, function( html ) {
			res.status( 404 ).send( html );
		} );
	} );
};

