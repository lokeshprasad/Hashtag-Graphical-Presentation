var twitter = require('ntwitter'),
    credentials = require('./credentials.js'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

var t = new twitter({
    consumer_key: credentials.Credential.consumer_key,
    consumer_secret: credentials.Credential.consumer_secret,
    access_token_key: credentials.Credential.access_token_key,
    access_token_secret: credentials.Credential.access_token_secret
});

app.get('/dashboard', function (req, res) {
	res.sendfile(__dirname + '/dashboard.html');
});

server.listen(3000);
var counter = 0;
io.sockets.on('connection', function (socket) {

  console.log('SOCKET CONNECTED\n');
  var track_item = '#love';
  t.stream(
    'statuses/filter',
    { track: [track_item] },
    function(stream) {
      stream.on('data', function(tweet) {
        if(tweet.text.match(track_item)) {
			counter = counter+1;
			var x = (new Date()).getTime(),y = counter;

			socket.emit('sample', {
			x: x,
			y: y
		});
        }
      });
    }
  );

});