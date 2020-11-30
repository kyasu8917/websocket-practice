var http = require('http');
var fs = require('fs');
// wsモジュール。中身覗きたい
var ws = require('ws');

// メッセージを保管するDBの代わり
var messages = [];

var server = http.createServer();
server.on('request', function(req, res) {
    fs.readFile("public" + req.url, (err, data) => {
        if(!err) {
            res.writeHead(200, {'Content-Type' : 'text/html'});
            res.end(data);
        } else {
            res.writeHead(404, {'Content-Type' : 'text/html'});
            res.end();
        }
    });
});
server.listen(3000);

// WebSocletサーバーを立てる
var wsServer = new ws.Server({port:3001})
// コネクションが生成された時
wsServer.on('connection', socket => {
    console.log("connection open")
    // メッセージを受け取った時
    socket.on('message', ms => {
        messages.push(JSON.parse(ms));
        var json = JSON.stringify(messages);
        wsServer.clients.forEach(client => {
            client.send(json);
        });
    });
    // コネクションが閉じられた時
    socket.on('close', () => {
        console.log("connection close")
    });
});
