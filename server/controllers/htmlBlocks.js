/* htmlBlocks.js contains functions that can be used to build up
 * the site's html pages
 *
 * Created by: Andrew Corum, 12 Apr 2018
 */

'use strict';

var handlebars = require( 'handlebars' );
var fs = require( "fs" );
var userPass  = require( './userPass' );
var db = require( './dbModule' );
var signupPass = userPass.signupPass;
var mysql      = require( 'mysql' );
var conn        = mysql.createConnection( {
	host     : 'localhost',
	user     : 'signup',
	password : signupPass,
	database : 'AIChallenge',
} );

/*
 * loadBlocks loads all requested blocks into the html
 *
 * @param: req, the site request
 * @param: html, string
 * @param: blockTypes, an array of blocks to build
 *
 * @return: html, updated with blocks
 */
exports.loadBlocks = function( req, html, blockTypes  )
{
	for ( var i = 0; i < blockTypes.length; i++ ) {
		switch ( blockTypes[i] ) {
			case "navbar":
				html = navbar( req, html );
				break;
		}
	}
	return html;
}


/*
 * navbar creates the bar that is seen at the top of every page
 *
 * @param: req, the site request
 * @param: html, string formatted with {{ navbar }}
 *
 * @return: html, updated with navbar 
 */
function navbar( req, html )
{
	var context, handle;
	// build nav html
	var loginText = req.session.auth ? req.session.username : "Login";

	context = {
		nav: [
			{ url: "#projects", title: "Games" },
			{ url: "#about", title: "About" },
			{ url: "/starters", title: "Starters" },
			{ url: "/signup", title: "Signup" },
			{ url: "/login", title: loginText },
		]
	}

	var navHtml = fs.readFileSync( "./public/html/navbar.html", "utf-8" );
	handle      = handlebars.compile( navHtml );
	navHtml     = handle( context );

	// insert navbar html into main html
	context = { navbar: navHtml };
	handle = handlebars.compile( html );
	html = handle( context )

	return html;
}

