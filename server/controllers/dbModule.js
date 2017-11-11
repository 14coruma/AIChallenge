/**
 * dbModule.js contains functions to connect, query, and disconnect from the db
 */
'use strict';

/*
 * Send a query to the DB connection
 *
 * @param: connection
 * @param: query, (string) query to send to db
 *
 * @return: query results
 */
exports.queryDB = function( connection, query, callback ) {
	//connectDB( connection );
	connection.query( query, function( err, results, fields ) {
		if ( err ) {
			console.error( 'error fetching results: ' + err );
			callback( err );
		} else {
			callback( results );
		}
	} );
	return;
	//closeDB( connection );
}

/*
 * Starts a connection to the DB
 */
function connectDB( connection ) {
	connection.connect( function( err ) {
		if ( err ) {
			console.error( 'error connecting: ' + err);
			return;
		}
	} );
}


/*
 * Ends a connection to the DB
 * 
 * @param: connection
 */
function closeDB( connection ) {
	connection.end( function( err ) {
		if ( err ) {
			console.error( 'error ending connection: ' + err);
			return;
		}
	} );
}

