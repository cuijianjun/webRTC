"use strict"
var https = require('https');
var fs = require('fs');
var options = {
	key: fs.readFileSync('../cert/4990587_test.pplu.vip.key'),
	cert: fs.readFileSync('../cert/4990587_test.pplu.vip.pem')
}

var app = https.createServer(options, function(req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('https:Hello World!\n')
}).listen(444, '0.0.0.0');
