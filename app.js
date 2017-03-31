var http = require('http'),
    express = require('express');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public'))
    .use('/bower_components', express.static(__dirname + '/bower_components/'));

io.on('connection', function(socket) {
    console.log('Socket.IO listening on port 8080');
});

server.listen(8080, function() {
    console.log('Express listening on port 8080');
});