/**
 * server.js runs the main nodejs express server and
 * WebSocket server for AIChallenges
 *
 * Created by: Andrew Corum: 2 Oct 2017
 */

var express = require( 'express' );
var app = express(); 
var routes = require( './api/routes/routes' );

app.use(express.static('public'));
routes( app );

app.listen( 8000 );

const WebSocket = require('ws');
 
const wss = new WebSocket.Server({ port: 8080 });
 
wss.on('connection', function connection(ws) {
	ws.on('message', function incoming(message) {
		console.log('received: %s', message);
	});
 
	ws.send('something');
});
