const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { formatDate } = require('./utils/util');

let users = {};

app.use(express.static(__dirname + '/www'));

io.on('connection', socket => {
  socket.on('online', ({ nickname }) => {
    users[socket.id] = {nickname};
    io.emit('onlineList', Object.values(users));
    io.emit('online', {nickname, time: formatDate(new Date())});
  });

  socket.on('disconnect', () => {
    let leaveData = {
      nickname: users[socket.id] ? users[socket.id].nickname : undefined,
      time: formatDate(new Date()),
    }
    io.emit('leave', leaveData);
    delete(users[socket.id]);
    io.emit('onlineList', Object.values(users));
  })

  socket.on('message', ({ content }) => {
    let messageData = {
      nickname: users[socket.id] ? users[socket.id].nickname : undefined,
      time: formatDate(new Date()),
      content
    }
    io.emit('message', messageData);
  })

});

http.listen(3000, () =>  {
  console.log('server start at 3000');
})
