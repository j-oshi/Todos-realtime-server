const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const sqlite3 = require('sqlite3').verbose();
const {
  database_create,
  database_insert,
  database_update,
  database_delete,
  asyncCallQuery
} = require('./sqlite-command');

database_create();

const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let interval;

io.on('connection', socket => {
  // Query database
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);

  console.log('a user connected');

  socket.on('add todo', (data) => {
    database_insert(data.id, data.name, data.task);
    console.log('Todo with an id of ' + data.id  + 'was added.');
  });

  socket.on('remove todo', (id) => {
    database_delete(id);
    console.log('Todo with an id of ' + id + ' was removed.');
  });

  socket.on('update todo', (data) => {
    database_update(data.id, data.name, data.task);
    console.log('Todo with an id of ' + data.id + ' was updated.');
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  let db = new sqlite3.Database('./db/todolist.db');
  db.all('SELECT name as name, todoId as id, task as task FROM todos', [], (err, rows) => {
      if (err) {
          return console.error(err.message);
      }
      console.log('Data received from Db:\n');
      console.log(rows);
      socket.emit('showrows', rows);
  })
  db.close();
};

server.listen(port, () => console.log(`Listening on port ${port}`));