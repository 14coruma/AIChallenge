/* htmlBlocks.js contains functions that can be used to build up
 * the site's html pages
 *
 * Created by: Andrew Corum, 12 Apr 2018
 */

'use strict';

var site = require( '../controllers/siteManager' );
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
 * also checks if site is in maintenance mode, and responds accordingly
 *
 * @param: req, the site request
 * @param: res, the site response
 * @param: sessionStore, the storage of sessions in mysql
 * @param: html, string
 * @param: blockTypes, an array of blocks to build
 * @param: callback
 *
 * @return: html, updated with blocks
 */
exports.loadBlocks = function( req, res, sessionStore, html, blockTypes, callback )
{
	site.maintenanceMode( function( maintenanceMode ) {
		// Allow login however
		if ( maintenanceMode === "true" && req.route.path != "/login" ) {
			html = fs.readFileSync( "./public/html/maintenance.html", "utf-8" );
			blockTypes = [ "navbar", "googleAnalytics" ];
			res.status( 503 );
		}

		var handle = handlebars.compile( html );
		var context = {};
		for ( var i = 0; i < blockTypes.length; i++ ) {
			switch ( blockTypes[i] ) {
				case "navbar":
					context = navbar( req, html, handle, context );
					break;
				case "googleAnalytics":
					context = googleAnalytics( html, handle, context );
					break;
				case "hiddenCreds":
					context = hiddenCreds( req, html, handle, context );
					break;
				case "users":
					//context = users( sessionStore, html, handle, context ).then( v => { console.log(v) } ); 
					break;
				case "footer":
					context = footer( html, handle, context );
					break;
			}
		}

		callback( handle( context ) );
	} );
}


/*
 * navbar creates the bar that is seen at the top of every page
 *
 * @param: req, the site request
 * @param: html, string formatted with {{navbar}}
 * @param: handle, handler template compiled by handlebarsjs
 * @param: context, current handlebar context
 *
 * @return: context, updated with navbar 
 */
function navbar( req, html, handle, context )
{
	// build nav html
	var loginText = req.session.auth ? "Sign out, " + req.session.username : "Log in";
	var loginUrl  = req.session.auth ? "/logout" : "/login";

	var navContext = {
		admin: req.session.userID == 1,
		control: [
			{ url: "/admin/maintenance", title: "Maintenance" },
//			{ url: "/admin/users", title: "Users" },
		],
		nav: [
			{ url: "/starters/main", title: "Starters" },
			{ url: "/play", title: "Play" },
			{ url: "/watch", title: "Watch" },
			{ url: "/signup", title: "Signup" },
			{ url: loginUrl, title: loginText },
		],
	};

	var navHtml   = fs.readFileSync( "./public/html/blocks/navbar.html", "utf-8" );
	var navHandle = handlebars.compile( navHtml );
	navHtml       = navHandle( navContext );

	// insert navbar html into main html
	context["navbar"] = navHtml;

	return context;
}

/*
 * googleAnalytics creates the code needed for google analytics to run 
 *
 * @param: html, string formatted with {{googleAnalytics}}
 * @param: handle, the handler template compiled by handlebarsjs
 * @param: context, current handlebar context
 *
 * @return: context, updated with google analyitcs html
 */
function googleAnalytics( html, handle, context )
{
	var googleHtml = fs.readFileSync( "./public/html/blocks/googleAnalytics.html", "utf-8" );

	// insert google html into main html
	context["googleAnalytics"] = googleHtml;

	return context;
}

/*
 * Stores user login creds hidden inside html for future use
 *
 * @param: req, the site request
 * @param: html, string formatted with {{googleAnalytics}}
 * @param: handle, the handler template compiled by handlebarsjs
 * @param: context, current handlebar context
 *
 * @return: context, updated with hiddenCreds
 */
function hiddenCreds ( req, html, handle, context )
{
	var hiddenCredsContext = {
		username: req.session.username,
		password: req.session.password,
	};
	var hiddenCredsHtml   = fs.readFileSync( "./public/html/blocks/hiddenCreds.html", "utf-8" );
	var hiddenCredsHandle = handlebars.compile( hiddenCredsHtml );
	hiddenCredsHtml       = hiddenCredsHandle( hiddenCredsContext );

	// insert html into main html
	context["hiddenCreds"] = hiddenCredsHtml;

	return context;
}

/*
 * Lists all online userrs in users.html
 *
 * @param: sessionStore, the storage of sessions in mysql db
 * @param: html, string formatted with {{googleAnalytics}}
 * @param: handle, the handler template compiled by handlebarsjs
 * @param: context, current handlebar context
 *
 * @return: context, updated with online user info
 */
async function users( sessionStore, html, handle, context )
{
	await sessionStore.all( function( err, sessions ) {
		// insert html into main html
		context["user"] = [];
		for ( var key in sessions ) {
			context["user"].push( {
				username: sessions[key].username ? sessions[key].username : "guest",
				auth: sessions[key].auth,
			} );
		}
		context["hey"] = "hey there";
	} );
	return context;
}

/*
 * Creates the site footer 
 *
 * @param: html, string formatted with {{footer}}
 * @param: handle, the handler template compiled by handlebarsjs
 * @param: context, current handlebar context
 *
 * @return: context, updated with footer 
 */
function footer( html, handle, context )
{
	var footerHtml = fs.readFileSync( "./public/html/blocks/footer.html", "utf-8" );

	// insert footer html into main html
	context["footer"] = footerHtml;

	return context;
}
