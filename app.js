var http        = require('http');
var net         = require('net');
var chatServer  = net.createServer();
var _           = require('lodash');
var clients     = [];
var cleanup     = [];
var chatLog     = "";
var pages       = [];
var webServer   = http.createServer();

var broadcast = function (client, data) {
  var currentMessage = client.name + ":  " + data;
  _(clients).each(function (socket) {
    chatLog += currentMessage + "\n";
    if (socket !== client) {
      if (socket.writable) {
        socket.write(currentMessage);
      } else {
        cleanup.push(socket);
        socket.destroy();
      }
    }
  });
};

chatServer.on('connection', function (client) {
  client.write('hi\n');
  client.name = "User- " + _.random(0, 9999);
  clients.push(client);
  client.on('data', function (data) {
    broadcast(client, data);
  });
  client.on('end', function () {
    _(clients).pull(client);
  });
  client.on('error', function (e) {
    console.log(e);
  });
});

webServer.on('connection', function (socket) {
  pages.push(socket);
});

chatServer.listen(9000, function () {
  console.log("Chat Server Running On Port 9000");
});

webServer.listen(3000, function () {
  console.log("Web Server Listening On Port 3000");
});