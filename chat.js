// 1.init
var fs = require('fs');
var server = require('http').createServer(function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  var output = fs.readFileSync('./chat.html', 'utf-8');
  res.end(output);
}).listen(1338);
var io = require('socket.io').listen(server);

var userHash = {};

// 2.event
io.sockets.on('connection', function (socket) {

  // connect-start
  socket.on('connected', function (name) {
    var msg = name + 'が入室しました';
    userHash[socket.id] = name;
    io.sockets.emit('publish', {value: msg});
  });

  // message
  socket.on('publish', function (data) {
    io.sockets.emit('publish', {value: data.value});
  });

  // finish
  socket.on('disconnect', function () {
    if (userHash[socket.id]) {
      var msg = userHash[socket.id] + 'が退出しました';
      delete userHash[socket.id];
      io.sockets.emit('publish', {value: msg});
    }
  });
});

console.log('Run ...');
