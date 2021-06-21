const http = require("http");
const WebSocket = require("ws");
var forge = require("node-forge");
var fs = require("file-system");

var privateKey = fs.readFileSync("./cert/client.key", "utf8");
var certificate = fs.readFileSync("./cert/client.pem");

const certFormated = forge.pki.certificateFromPem(certificate);

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const serverTls = forge.tls.createConnection({
  server: true,
  caStore: forge.pki.createCaStore(Array(certFormated)),
  sessionCache: {},
  // supported cipher suites in order of preference
  cipherSuites: [
    forge.tls.CipherSuites.TLS_RSA_WITH_AES_128_CBC_SHA,
    forge.tls.CipherSuites.TLS_RSA_WITH_AES_256_CBC_SHA,
  ],
  // require a client-side certificate if you want
  verifyClient: false,
  verify: function (connection, verified, depth, certs) {
    if (depth === 0) {
      var cn = certs[0].subject.getField("CN").value;
      if (cn !== "the-client") {
        verified = {
          alert: forge.tls.Alert.Description.bad_certificate,
          message: "Certificate common name does not match expected client.",
        };
      }
    }
    return verified;
  },
  connected: function (connection) {
    console.log("connected");
    // send message to client
    connection.prepare(forge.util.encodeUtf8("Hi client!"));
    /* NOTE: experimental, start heartbeat retransmission timer
    myHeartbeatTimer = setInterval(function() {
      connection.prepareHeartbeatRequest(forge.util.createBuffer('1234'));
    }, 5*60*1000);*/
  },
  getCertificate: function (connection, hint) {
    return myServerCertificate;
  },
  tlsDataReady: function (connection) {
    // TLS data (encrypted) is ready to be sent to the client
    sendToClientSomehow(connection.tlsData.getBytes());
    // if you were communicating with the client above you'd do:
    // client.process(connection.tlsData.getBytes());
  },
  dataReady: function (connection) {
    // clear data from the client is ready
    console.log(
      "the client sent: " + forge.util.decodeUtf8(connection.data.getBytes())
    );
    // close connection
    connection.close();
  },
  /* NOTE: experimental
  heartbeatReceived: function(connection, payload) {
    // restart retransmission timer, look at payload
    clearInterval(myHeartbeatTimer);
    myHeartbeatTimer = setInterval(function() {
      connection.prepareHeartbeatRequest(forge.util.createBuffer('1234'));
    }, 5*60*1000);
    payload.getBytes();
  },*/
  closed: function (connection) {
    console.log("disconnected");
  },
  error: function (connection, error) {
    console.log("uh oh", error);
  },
});

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
  });

  ws.send("something");
});

server.listen(8081);
