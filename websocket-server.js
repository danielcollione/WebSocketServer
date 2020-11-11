var json1 = require('./deviceinfo.json');
var json2 = require('./wifiList.json');

const http = require('http');
const WebSocketServer = require('websocket').server;

const server = http.createServer();
server.listen(9898);

const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);

    connection.on('message', function(message) {
    console.log('Received Message:', message.utf8Data);
    if(message.utf8Data ==  '{"cmd":1}'){
        connection.sendUTF(JSON.stringify(json1));
    }else if(message.utf8Data == '{"cmd":2}'){
        connection.sendUTF(JSON.stringify(json2));
    } else if(message.utf8Data == '{"ssid":"PADOTEC","pswd":"teste"}'){
        connection.sendUTF(JSON.stringify('success'));
    }
    else{
        connection.sendUTF(JSON.stringify('fail'));
    }
      
    });
    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});

// var WebSocketClient = require('websocket').client;
 
// var client = new WebSocketClient();
 
// client.on('connectFailed', function(error) {
//     console.log('Connect Error: ' + error.toString());
// });
 
// client.on('connect', function(connection) {
//     console.log('WebSocket Client Connected');
//     connection.on('error', function(error) {
//         console.log("Connection Error: " + error.toString());
//     });
//     connection.on('close', function() {
//         console.log('echo-protocol Connection Closed');
//     });
//     connection.on('message', function(message) {
//         if (message.type === 'utf8') {
//             console.log("Received: '" + message.utf8Data + "'");
//         }
//     });
    
//     function sendNumber() {
//         if (connection.connected) {
//             var number = Math.round(Math.random() * 0xFFFFFF);
//             connection.sendUTF(number.toString());
//             setTimeout(sendNumber, 1000);
//         }
//     }
//     sendNumber();
// });

// client.connect('ws://172.16.106.112/ws', 'echo-protocol');