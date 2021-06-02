var fs = require('file-system');

var privateKey = fs.readFileSync("./cert/key.pem", "utf8");
var certificate = fs.readFileSync("./cert/cert.pem", "utf8");

var credentials = { key: privateKey, cert: certificate };

const https = require('https');
const WebSocketServer = require('websocket').server;

const server = https.createServer(credentials);
server.listen(8081);

const wss = new WebSocketServer({
    httpServer: server
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.send("something");
});
