const express = require('express');
const http = require("http");
const socketIo = require("socket.io");
const sqlite3 = require('sqlite3').verbose();

// Create embedded table
const db = new sqlite3.Database('./todolist.db');
const createTable = "CREATE TABLE IF NOT EXISTS todos ('name' text NOT NULL, 'todoId' varchar PRIMARY KEY, complete_task BOOLEAN );"
db.run(createTable, function(err) {
  if (err) {
    console.log(err.message);
  }
  console.log('Table created')
});

const insert_table = data => {
  // db.run(`INSERT into todos(todoId, name, complete_task) values(${data.id}, ${data.text}, ${data.complete})`, function(err) {
  db.run("INSERT INTO todos(todoId, name, complete_task) values(test, testtest, 0)", function(err) {
    if (err) {
      console.log(err.message);
    }
    console.log('Table inserted')
  });
}

const query_table = () => {
  db.each("SELECT rowId AS name FROM todos", function(err, row) {
  // db.all("SELECT todoId FROM todos", function(err, rows) {
    // if (err) {
    //   console.log(err.message);
    // }
    console.log(row.name);
    // console.log(row.todoId + ": " + row.name + ": " + row.complete_task);
    // console.log(err)
  });
}

// db.close();





const port = process.env.PORT || 4001;
const index = require("./routes/index");

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

let interval;



io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("add list", data => {
    insert_table(data);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = socket => {
  const response = new Date();
  
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
  query_table();
};

db.close();

server.listen(port, () => console.log(`Listening on port ${port}`));