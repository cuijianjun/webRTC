'use strict'
var http = require('http');
var https = require('https');
var fs = require('fs');

var express = require('express');
var serveIndex = require('serve-index');

var app = express();
app.use(serveIndex('./public'));
app.use(express.static('./public'));
// http server 
var http_server = http.createServer(app);
http_server.listen(8032, '0.0.0.0');
var options = {
	key: fs.readFileSync('./cert/4990587_test.pplu.vip.key'),
	cert: fs.readFileSync('./cert/4990587_test.pplu.vip.pem')
}
// https server 
var https_server = https.createServer(options, app);
https_server.listen(444, '0.0.0.0')
