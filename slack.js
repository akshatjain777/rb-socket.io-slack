const express = require('express');
const socketio = require('socket.io');

const namespaces = require('./data/namespaces');

const app = express();

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);

const io = socketio(expressServer);

io.on('connection', (socket) => {
  const nsData = namespaces.map((namespace) => {
    const { imageUrl, endpoint } = namespace;
    return {
      imageUrl,
      endpoint,
    };
  });
  socket.emit('nsList', nsData);
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    const username = nsSocket.handshake.query.username;
    nsSocket.emit('nsRoomLoad', namespace.rooms);
    nsSocket.on('joinRoom', (roomToJoin) => {
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsers(namespace, roomToLeave);
      nsSocket.join(roomToJoin);

      const nsRoom = namespace.rooms.find((room) => room.title === roomToJoin);
      nsSocket.emit('roomHistory', nsRoom.history);
      updateUsers(namespace, roomToJoin);
    });
    nsSocket.on('newMessage', (data) => {
      const msg = {
        text: data.text,
        time: Date.now(),
        username: username,
        avatar: 'https://via.placeholder.com/30',
      };
      const roomTitle = Object.keys(nsSocket.rooms)[1];

      const nsRoom = namespace.rooms.find((room) => room.title === roomTitle);

      nsRoom.addMessage(msg);

      io.of(namespace.endpoint).to(roomTitle).emit('newMessage', msg);
    });
  });
});

const updateUsers = (namespace, roomToJoin) => {
  io.of(namespace.endpoint)
    .in(roomToJoin)
    .clients((err, clients) => {
      io.of(namespace.endpoint)
        .in(roomToJoin)
        .emit('updateMembers', clients.length);
    });
};
