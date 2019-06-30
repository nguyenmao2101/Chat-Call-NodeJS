const socketio = require('socket.io');
const mongoose = require('mongoose');
const events = require('events');
const _ = require('lodash');
const eventEmitter = new events.EventEmitter();

//Add models
require('../models/messages.model');
require('../models/rooms.model');
require('../models/users.model');

//using mongoose Schema models
var usersModel = mongoose.model('Users');
var msgModel = mongoose.model('Messages');
var roomModel = mongoose.model('Rooms');

//Socket.io
module.exports.sockets = function(http) {

    //Set route
    io = socketio.listen(http);
    var ioMsg = io.of('/chat');
    var userSocket = {};
    var userList = {};
    var idList = [];

    //Connect socket.io
    ioMsg.on('connection', function(socket) {
        socket.on('set-user-data', function(username) {
            console.log(username+ ' đã đăng nhập');

            //Store username
            socket.username = username;
            //Store sessionId
            userSocket[socket.username] = socket.id;
      
            socket.broadcast.emit('broadcast',{ description: username + ' đã đăng nhập'});

            //Get all users list
            eventEmitter.emit('get-all-users');
      
            //Check online users
            onlineUserList = function() {
              for (i in userSocket) {
                for (j in userList) {
                  if (j == i) {
                    userList[j] = "Online";
                  }
                }
              }
              //For popping connection message.
              ioMsg.emit('onlineList', userList, idList);
            }
        });

        //Set room.
        socket.on('set-room', function(room) {
            //Leave room.
            socket.leave(socket.room);
            //Get room data.
            eventEmitter.emit('get-room-data', room);
            //Set room and join.
            setRoom = function(room) {
                socket.room = room;
                console.log("room : " + socket.room);
                socket.join(socket.room);
                ioMsg.to(userSocket[socket.username]).emit('set-room-user', socket.room);
            };
        });

        //emits event to read old-chats-init from database.
        socket.on('old-msg-init', function(data) {
            eventEmitter.emit('read-msg', data);
        });

        //Send old messages to room.
        oldMsg = function(result, username, room) {
            ioMsg.to(userSocket[username]).emit('old-msg', {
                result: result,
                room: room
            });
        }

        //Show messages
        socket.on('send-msg', function(data) {

            //emits event to save chat to database.
            eventEmitter.emit('save-msg', {
                msgFrom: socket.username,
                msgTo: data.msgTo,
                msg: data.msg,
                room: socket.room,
                date: data.date
            });

            //emits event to send chat msg to all clients.
            ioMsg.to(socket.room).emit('detail-msg', {
                msgFrom: socket.username,
                msg: data.msg,
                date: data.date
            });
        });

        //for popping disconnection message.
        socket.on('disconnect', function() {

            console.log(socket.username+ ' đã đăng xuất');
            socket.broadcast.emit('broadcast',{ description: socket.username + ' đã đăng xuất'});
            
            //Remove user from userSocket when user disconnnected with server
            _.unset(userSocket, socket.username);
            userList[socket.username] = "Offline";
    
            ioMsg.emit('onlineList', userList, idList);
        });
    });

    //Save messages to database
    eventEmitter.on('save-msg', function(data) {

        var newMsg = new msgModel({
    
          msgFrom: data.msgFrom,
          msgTo: data.msgTo,
          msg: data.msg,
          room: data.room,
          createdOn: data.date
    
        });
    
        newMsg.save(function(err, result) {
          if (err) {
            console.log("Error : " + err);
          } else if (result == undefined || result == null || result == "") {
            console.log("Messages is not saved.");
          } else {
            console.log(result);
          }
        });
    });

    //reading chat from database.
    eventEmitter.on('read-msg', function(data) {
        msgModel.find({})
        .where('room').equals(data.room)
        .sort('-createdOn')
        .limit(5)
        .exec(function(err, result) {
          if (err) {
            console.log("Error : " + err);
          } else {
            //calling function which emits event to client to show chats.
            oldMsg(result, data.username, data.room);
          }
        });
    });

    //listening for get-all-users event. creating list of all users.
    eventEmitter.on('get-all-users', function() {
        usersModel.find({})
        .select('_id name')
        .exec(function(err, result) {
            if (err) {
            console.log("Error : " + err);
            } else {
            //console.log(result);
            for (var i = 0; i < result.length; i++) {
                userList[result[i].name] = "Offline";
                idList.push(result[i]._id);
            }
            onlineUserList();
            }
        });
    });

    //listening get-room-data event.
    eventEmitter.on('get-room-data', function(room) {
        roomModel.find({
            $or: [{
                name1: room.name1
            }, {
                name1: room.name2
            }, {
                name2: room.name1
            }, {
                name2: room.name2
            }]}, function(err, result) {
        if (err) {
            console.log("Error : " + err);
        } else {
            if (result == "" || result == undefined || result == null) {

            var today = Date.now();

            newRoom = new roomModel({
                name1: room.name1,
                name2: room.name2,
                lastActive: today,
                createdOn: today
            });

            newRoom.save(function(err, newResult) {

                if (err) {
                console.log("Error : " + err);
                } else if (newResult == "" || newResult == undefined || newResult == null) {
                console.log("Some Error Occured During Room Creation.");
                } else {
                setRoom(newResult._id);
                }
            });

            } else {
            var jresult = JSON.parse(JSON.stringify(result));
            setRoom(jresult[0]._id);
            }
        }
        });
    });
}