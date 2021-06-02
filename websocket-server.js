// var fs = require('file-system');

// var privateKey = fs.readFileSync("./cert/key.pem", "utf8");
// var certificate = fs.readFileSync("./cert/cert.pem", "utf8");

// var credentials = { key: privateKey, cert: certificate };

// const http = require('https');
// const WebSocketServer = require('websocket').server;

// const server = http.createServer();
// server.listen(8081);

// const wss = new WebSocketServer({
//     httpServer: server
// });

// wss.on("connection", function connection(ws) {
//   ws.on("message", function incoming(message) {
//     console.log("received: %s", message);
//   });

//   ws.send("something");
// });
const https = require("https");
const WebSocket = require("ws");

var fs = require('file-system');

var privateKey = fs.readFileSync("./cert/server.key", "utf8");
var certificate = fs.readFileSync("./cert/server.cert", "utf8");

var credentials = { key: privateKey, cert: certificate };

const server = https.createServer(credentials);
const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.send("something");
});

server.listen(8081);
