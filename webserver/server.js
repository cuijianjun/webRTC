'use strict'
var http = require('http');
var https = require('https');
var fs = require('fs');

var express = require('express');
var serveIndex = require('serve-index');

var socketIo = require('socket.io');
var log4js = require('log4js');
log4js.configure({
	appenders: {
		file: {
			type: 'file',
			filename: 'app.log',
			layout: {
				type: 'pattern',
				pattern: '%r %p =%m'
			}
		}
	},
	categories: {
		default: {
			appenders: ['file'],
			level: 'debug'
		}
	}
})
var logger = log4js.getLogger();


var app = express();
app.use(serveIndex('./public'));
app.use(express.static('./public'));
// http server 
var http_server = http.createServer(app);
http_server.listen(8032, '0.0.0.0');
var options = {
	key: fs.readFileSync('../cert/4990587_test.pplu.vip.key'),
	cert: fs.readFileSync('../cert/4990587_test.pplu.vip.pem')
}
// https server 
var https_server = https.createServer(options, app);
var io = socketIo(https_server)
io.sockets.on('connection', (socket) => {
	socket.on('join', (room) => {
		socket.join(room)
		var myRoom = io.sockets.adapter.rooms.get(room);
		var users = myRoom.size;
		console.log("users", users);
		// logger.log('the number of user in room is: ' + users);
		// socket.emit('joined', room, socket.id) // 单人回复
		// socket.to(room).emit('joined', room, socket.id) // 除自己外的
		// io.in(room).emit('joined', room, socket.id) // 房间内所有人
		socket.broadcast.emit('joined', room, socket.id) // 除自己，全部站点
	}) 
	socket.on('leave', (room) => {
		var myRoom = io.sockets.adapter.rooms.get(room);
		var users = myRoom.size;
		logger.log('the number of user in room is: ' + users);
		socket.leave(room)
		// socket.emit('joined', room, socket.id) 单人回复
		// socket.to(room).emit('joined', room, socket.id) // 除自己外的
		// io.in(room).emit('joined', room, socket.id) // 房间内所有人
		socket.broadcast.emit('joined', room, socket.id) // 除自己，全部站点
	})

	socket.on('message',(room, data)=>{
		console.log("broadcast", room, data);
        socket.broadcast.emit('message', room, data)
    })
})
https_server.listen(444, '0.0.0.0')
