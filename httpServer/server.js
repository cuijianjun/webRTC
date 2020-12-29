'use strict'
var http = require('http')
var app =  http.createServer (function (req, res) {
	res.writeHead(200, {'Content-Type': 'text-plain'})
	res.end('http: Hello World\n')
}).listen(8032, '0.0.0.0');
