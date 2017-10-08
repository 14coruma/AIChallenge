'use strict';

var startButton = document.getElementById( 'startButton' );

startButton.addEventListener( 'click', function() {
	var username = document.getElementById( 'formUsername' ).value;
	var password = document.getElementById( 'formPassword' ).value;
	var game     = document.getElementById( 'selectGame' ).value;

	var xhr = new XMLHttpRequest();
	xhr.open( "POST", 'http://localhost:2306/signup', true );
	xhr.setRequestHeader( "Content-Type", "application/x-www-form-urlencoded" );
	xhr.send( "username="+username+"&password="+password+"&email="+game );
});
