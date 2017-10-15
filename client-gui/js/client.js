/**
 * client.js handles the AIChallenge client
 *
 * Created by: Andrew Corum, 6 Oct 2017
 */
'use strict';

var startButton = document.getElementById( 'startButton' );

startButton.addEventListener( 'click', function() {
	var username = document.getElementById( 'formUsername' ).value;
	var password = document.getElementById( 'formPassword' ).value;
	var game     = document.getElementById( 'selectGame' ).value;

	if ( username && password && game ) {
		var waitMsg = document.getElementById( 'waitingMessage' );
		waitMsg.style.display="block";

		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if ( xhr.readyState ==4 && xhr.status == 200) {
				waitMsg.style.display="none";
				return xhr.responseText;
			}
		}

		xhr.open( "POST", 'http://localhost:2306/signup', true );
		xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
		xhr.send( "username="+username+"&password="+password+"&email="+game );

		//location.replace( "html/waiting.html" );
		return false;
	}
} );
var wsUri = "ws://localhost:8080/";
var output;

function init()
{
	output = document.getElementById("output");
	testWebSocket();
}

function testWebSocket()
{
	websocket = new WebSocket(wsUri);
	websocket.onopen = function(evt) { onOpen(evt) };
	websocket.onclose = function(evt) { onClose(evt) };
	websocket.onmessage = function(evt) { onMessage(evt) };
	websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt)
{
	writeToScreen("CONNECTED");
	doSend("WebSocket rocks");
}

function onClose(evt)
{
	writeToScreen("DISCONNECTED");
}

function onMessage(evt)
{
	writeToScreen('<span style="color: blue;">RESPONSE: ' + evt.data+'</span>');
	websocket.close();
}

function onError(evt)
{
	writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message)
{
	writeToScreen("SENT: " + message);
	websocket.send(message);
}

function writeToScreen(message)
{
	var pre = document.createElement("p");
	pre.style.wordWrap = "break-word";
	pre.innerHTML = message;
	output.appendChild(pre);
}

//window.addEventListener("load", init, false);
